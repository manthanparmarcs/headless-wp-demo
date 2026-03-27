export async function POST(request) {
  try {
    const formData = await request.formData();

    // Prepare the payload for CF7
    const payload = new URLSearchParams();
    const unitTag = process.env.CF7_UNIT_TAG || "nextjs-form"; // must match your CF7 form unit tag if required
    payload.append("_wpcf7_unit_tag", unitTag);
    payload.append("your-name", formData.get("your-name") || "");
    payload.append("your-email", formData.get("your-email") || "");
    payload.append("your-subject", formData.get("your-subject") || "");
    payload.append("your-message", formData.get("your-message") || "");

    // CF7 URL (WordPress REST endpoint provided by the Contact Form 7 REST API plugin)
    // Prefer explicit CF7_FEEDBACK_URL, but allow constructing it from components for easier setup.
    const cf7RestBaseUrl =
      process.env.CF7_REST_BASE_URL || "http://graphql-practise.local/wp-json";
    const cf7RestNamespace = process.env.CF7_REST_NAMESPACE || "contact-form-7";
    const cf7FormId = process.env.CF7_FORM_ID || "42";

    const constructedCf7Url = `${cf7RestBaseUrl}/${cf7RestNamespace}/v1/contact-forms/${cf7FormId}/feedback`;
    const cf7Url = process.env.CF7_FEEDBACK_URL || constructedCf7Url;

    const postAttempt = async (url, { format }) => {
      // CF7 REST endpoints are sometimes strict about Content-Type / body encoding.
      // Supported by this code: "form" (x-www-form-urlencoded), "multipart", and "json".
      const headers = { Accept: "application/json" };
      let body;

      if (format === "form") {
        headers["Content-Type"] = "application/x-www-form-urlencoded; charset=UTF-8";
        body = payload.toString();
      } else if (format === "multipart") {
        // Use FormData so fetch sets the multipart boundary correctly.
        const fd = new FormData();
        for (const [key, value] of payload.entries()) fd.append(key, value);
        body = fd;
      } else if (format === "json") {
        headers["Content-Type"] = "application/json";
        body = JSON.stringify(Object.fromEntries(payload.entries()));
      } else {
        throw new Error(`Unsupported cf7 request format: ${format}`);
      }

      const response = await fetch(url, { method: "POST", body, headers });

      const contentType = response.headers.get("content-type") || "";
      const upstreamStatus = response.status;

      if (contentType.includes("application/json")) {
        const data = await response.json();
        return { response, json: data, upstreamStatus, format };
      }

      const text = await response.text();
      return { response, json: { message: text }, upstreamStatus, format };
    };

    const isPayloadFormatError = (result) => {
      const msg = (result.json?.message || result.json?.error || "").toLowerCase();
      return (
        result.upstreamStatus === 415 ||
        msg.includes("payload format") ||
        msg.includes("request payload format is not supported")
      );
    };

    const urlsToTry = (url) => (url.endsWith("/") ? [url, url.slice(0, -1)] : [url, `${url}/`]);

    // Try both `.../feedback` and `.../feedback/` (WordPress route matching can be strict in some setups).
    const formatsToTry = ["form", "multipart", "json"];

    for (const format of formatsToTry) {
      for (const url of urlsToTry(cf7Url)) {
        const result = await postAttempt(url, { format });

        // Successful CF7 responses tend to have `mail_sent` / `status` fields;
        // if it's something else, we can still surface it.
        if (!isPayloadFormatError(result) && result.upstreamStatus !== 404) {
          return new Response(
            JSON.stringify({
              ...result.json,
              cf7Url: url,
              unitTag,
              upstreamStatus: result.upstreamStatus,
              requestFormat: result.format,
            }),
            {
              status: result.upstreamStatus,
              headers: { "Content-Type": "application/json" },
            }
          );
        }

        // If we hit "payload format not supported", we keep trying formats,
        // but we don't keep looping URLs unnecessarily (next loops may still help).
        if (format === "form" && !isPayloadFormatError(result)) {
          // Keep behavior consistent: try next URL in the same format.
          continue;
        }
      }
    }

    // If everything failed, return the last response we got.
    // (We re-run the last attempt deterministically with form encoding for better debug.)
    const finalResult = await postAttempt(cf7Url, { format: "form" });
    return new Response(
      JSON.stringify({
        ...finalResult.json,
        cf7Url: cf7Url,
        unitTag,
        upstreamStatus: finalResult.upstreamStatus,
        requestFormat: finalResult.format,
      }),
      {
        status: finalResult.upstreamStatus,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}