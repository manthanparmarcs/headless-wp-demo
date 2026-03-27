import Link from "next/link";
import { notFound } from "next/navigation";

import { fetchGraphQL } from "@/lib/graphql";
import { GET_COMPANY, GET_COMPANY_WITH_FEATURED_IMAGE } from "@/lib/queries";
import UpdateCompanyForm from "../../components/update-company-form";

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
  if (!company) {
    notFound();
  }

  const initialTitle = company.title ?? "";

  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: 24 }}>
      <h1 style={{ marginTop: 0 }}>Edit Company</h1>
      {company.status ? (
        <p style={{ color: "#94a3b8", marginTop: 0 }}>Status: {company.status}</p>
      ) : null}

      <UpdateCompanyForm id={id} initialTitle={initialTitle} />

      <p style={{ marginTop: "16px" }}>
        <Link href="/company">Back to list</Link>
      </p>
    </main>
  );
}
