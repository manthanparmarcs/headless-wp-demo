export async function POST(request) {
  try {
    const formData = await request.formData();

    // Create FormData payload for Contact Form 7
    const payload = new FormData();

    // REQUIRED field for CF7
    payload.append("_wpcf7_unit_tag", "nextjs-form");

    // Form fields (must match CF7 form field names)
    payload.append("your-name", formData.get("your-name") || "");
    payload.append("your-email", formData.get("your-email") || "");
    payload.append("your-subject", formData.get("your-subject") || "");
    payload.append("your-message", formData.get("your-message") || "");

    // 🔥 IMPORTANT: Replace with your actual WordPress CF7 endpoint
    const cf7Url =
      "https://wordpress-401163-6209935.cloudwaysapps.com/wp-json/contact-form-7/v1/contact-forms/97275/feedback";

    const response = await fetch(cf7Url, {
      method: "POST",
      body: payload, // ✅ DO NOT set headers manually
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message || "Something went wrong",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}