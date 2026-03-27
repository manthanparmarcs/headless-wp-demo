const GRAPHQL_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL ||
  "https://wordpress-401163-6209935.cloudwaysapps.com/graphql";

function getAuthHeaders() {
  const token = process.env.WORDPRESS_GRAPHQL_AUTH_TOKEN;
  if (token) {
    return { Authorization: `Bearer ${token.trim()}` };
  }

  const user = process.env.WORDPRESS_GRAPHQL_USERNAME;
  const appPassword = process.env.WORDPRESS_GRAPHQL_APPLICATION_PASSWORD;
  if (user && appPassword) {
    const raw = `${user}:${appPassword.replace(/\s+/g, "")}`;
    const encoded =
      typeof Buffer !== "undefined"
        ? Buffer.from(raw, "utf8").toString("base64")
        : btoa(raw);
    return { Authorization: `Basic ${encoded}` };
  }

  return {};
}

/**
 * @param {string} query
 * @param {Record<string, unknown>} [variables]
 * @param {{ auth?: boolean }} [options] Pass auth: true for mutations; requires server env vars (never NEXT_PUBLIC_*).
 */
export async function fetchGraphQL(query, variables = {}, options = {}) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (options.auth) {
    const authHeaders = getAuthHeaders();
    if (!authHeaders.Authorization) {
      throw new Error(
        "Missing WordPress credentials for mutations. In the graphql-frontend folder (same place as package.json), create .env.local — copy from .env.example — and set WORDPRESS_GRAPHQL_USERNAME + WORDPRESS_GRAPHQL_APPLICATION_PASSWORD, or WORDPRESS_GRAPHQL_AUTH_TOKEN. Restart `npm run dev`.",
      );
    }
    Object.assign(headers, authHeaders);
  }

  let res;
  try {
    res = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers,
      body: JSON.stringify({ query, variables }),
      cache: "no-store",
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(
      `fetchGraphQL: fetch failed to ${GRAPHQL_URL}. ${msg}`,
    );
  }

  const json = await res.json();

  if (!res.ok || json.errors) {
    const message =
      json?.errors?.map((e) => e.message).join(", ") || "GraphQL request failed";
    throw new Error(message);
  }

  return json.data;
}
