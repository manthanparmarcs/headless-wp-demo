import Link from "next/link";
import { fetchGraphQL } from "@/lib/graphql";
import { GET_COMPANIES, GET_COMPANIES_WITH_FEATURED_IMAGE } from "@/lib/queries";
import DeleteCompanyForm from "./components/delete-company-form";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Page() {
  let companies = [];
  let imageQuerySupported = true;
  try {
    let data;
    try {
      data = await fetchGraphQL(GET_COMPANIES_WITH_FEATURED_IMAGE);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (!message.toLowerCase().includes("featuredimage")) throw error;
      imageQuerySupported = false;
      data = await fetchGraphQL(GET_COMPANIES);
    }
    companies = data?.companies?.nodes || [];
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return (
      <main style={{ padding: "20px" }}>
        <h1>Companies</h1>
        <p style={{ marginTop: 8 }}>Could not load companies from WPGraphQL.</p>
        <pre
          style={{
            marginTop: 12,
            whiteSpace: "pre-wrap",
            border: "1px solid #2b3440",
            padding: 12,
            background: "#111827",
            color: "#e5e7eb",
            borderRadius: 12,
          }}
        >
          {msg}
        </pre>
        <p style={{ marginTop: 12 }}>
          Check that your WPGraphQL endpoint is reachable at{" "}
          <span style={{ color: "#67e8f9" }}>
            {process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL}
          </span>
          .
        </p>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 980, margin: "0 auto", padding: "24px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <h1 style={{ margin: 0, fontSize: 28 }}>Companies</h1>
        <div style={{ display: "flex", gap: 10 }}>
          <Link
            href="/company/create"
            style={{
              textDecoration: "none",
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid #244",
              background: "#0b3f3f",
              color: "#fff",
            }}
          >
            + Add Company
          </Link>
          <Link
            href="/"
            style={{
              textDecoration: "none",
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid #2b3440",
              background: "#0f172a",
              color: "#e2e8f0",
            }}
          >
            Home
          </Link>
        </div>
      </div>

      <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
        {!imageQuerySupported ? (
          <p style={{ color: "#94a3b8", margin: 0, fontSize: 13 }}>
            Featured image preview is unavailable in current WPGraphQL schema.
          </p>
        ) : null}
        {companies.length === 0 ? (
          <p style={{ color: "#94a3b8" }}>No companies found.</p>
        ) : null}

        {companies.map((c) => (
          <article
            key={c.databaseId || c.id}
            style={{
              border: "1px solid #1f2937",
              borderRadius: 12,
              padding: 14,
              display: "grid",
              gridTemplateColumns: "80px 1fr auto",
              gap: 14,
              alignItems: "center",
              background: "#0b1220",
            }}
          >
            <div>
              {c.featuredImage?.node?.sourceUrl ? (
                <img
                  src={c.featuredImage.node.sourceUrl}
                  alt={c.featuredImage.node.altText || c.title || "Company image"}
                  style={{
                    width: 72,
                    height: 72,
                    objectFit: "cover",
                    borderRadius: 8,
                    border: "1px solid #334155",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 8,
                    border: "1px dashed #334155",
                    display: "grid",
                    placeItems: "center",
                    color: "#64748b",
                    fontSize: 12,
                  }}
                >
                  No image
                </div>
              )}
            </div>

            <div>
              <div style={{ fontWeight: 700 }}>{c.title || "(Untitled)"}</div>
              {c.status ? (
                <div style={{ color: "#94a3b8", marginTop: 4, fontSize: 13 }}>
                  Status: {c.status}
                </div>
              ) : null}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Link href={`/company/edit/${c.databaseId}`}>Edit</Link>
              <DeleteCompanyForm id={c.databaseId || c.id} />
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
