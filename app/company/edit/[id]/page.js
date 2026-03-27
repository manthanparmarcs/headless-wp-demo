import Link from "next/link";

import { fetchGraphQL } from "@/lib/graphql";
import { GET_COMPANY, GET_COMPANY_WITH_FEATURED_IMAGE } from "@/lib/queries";
import { updateCompany } from "../../actions";

export default async function EditPage({ params }) {
  const { id } = await params;
  let data;
  try {
    data = await fetchGraphQL(GET_COMPANY_WITH_FEATURED_IMAGE, { id });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!message.toLowerCase().includes("featuredimage")) throw error;
    data = await fetchGraphQL(GET_COMPANY, { id });
  }
  const company = data?.company;
  const initialTitle = company?.title ?? "";

  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: 24 }}>
      <h1 style={{ marginTop: 0 }}>Edit Company</h1>
      {company?.status ? (
        <p style={{ color: "#94a3b8", marginTop: 0 }}>Status: {company.status}</p>
      ) : null}

      <form
        action={updateCompany.bind(null, id)}
        style={{
          border: "1px solid #1f2937",
          borderRadius: 12,
          padding: 16,
          background: "#0b1220",
          display: "grid",
          gap: 14,
        }}
      >
        <label style={{ display: "grid", gap: 8 }}>
          <span>Company title</span>
          <input
            name="title"
            placeholder="Company title"
            defaultValue={initialTitle}
            required
            style={{
              background: "#020617",
              border: "1px solid #334155",
              color: "#e2e8f0",
              borderRadius: 10,
              padding: "10px 12px",
            }}
          />
        </label>

        {/* <label style={{ display: "grid", gap: 8 }}>
          <span>Featured image ID (optional)</span>
          <input
            type="number"
            name="featuredImageId"
            placeholder="Example: 123"
            min={1}
            style={{
              background: "#020617",
              border: "1px solid #334155",
              color: "#e2e8f0",
              borderRadius: 10,
              padding: "10px 12px",
            }}
          />
        </label> */}

        <div>
          <button
            type="submit"
            style={{
              border: "1px solid #244",
              background: "#0b3f3f",
              color: "#fff",
              borderRadius: 10,
              padding: "10px 14px",
              cursor: "pointer",
            }}
          >
            Update &amp; Publish
          </button>
        </div>
      </form>

      <p style={{ marginTop: "16px" }}>
        <Link href="/company">Back to list</Link>
      </p>
    </main>
  );
}
