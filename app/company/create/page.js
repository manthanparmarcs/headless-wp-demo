import Link from "next/link";

import CreateCompanyForm from "../components/create-company-form";

export default function CreatePage() {
  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: 24 }}>
      <h1 style={{ marginTop: 0 }}>Add Company</h1>
      <p style={{ color: "#94a3b8", marginTop: 0 }}>
        Create a company entry and publish it to WordPress.
      </p>

      <CreateCompanyForm />

      <p style={{ marginTop: "16px" }}>
        <Link href="/company">Back to list</Link>
      </p>
      <p style={{ color: "#94a3b8", fontSize: 13 }}>
        Tip: Image ID is the WordPress Media Library attachment ID.
      </p>
    </main>
  );
}
