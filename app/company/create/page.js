import Link from "next/link";

import { createCompany } from "../actions";

export default function CreatePage() {
  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: 24 }}>
      <h1 style={{ marginTop: 0 }}>Add Company</h1>
      <p style={{ color: "#94a3b8", marginTop: 0 }}>
        Create a company entry and publish it to WordPress.
      </p>

      <form
        action={createCompany}
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
            Create &amp; Publish
          </button>
        </div>
      </form>

      <p style={{ marginTop: "16px" }}>
        <Link href="/company">Back to list</Link>
      </p>
      <p style={{ color: "#94a3b8", fontSize: 13 }}>
        Tip: Image ID is the WordPress Media Library attachment ID.
      </p>
    </main>
  );
}
