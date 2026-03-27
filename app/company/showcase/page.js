import Link from "next/link";

import { fetchGraphQL } from "@/lib/graphql";
import { GET_COMPANY_SHOWCASE } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function stripHtml(value) {
  return (value || "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function renderedContent(company) {
  const c = company?.content;
  if (typeof c === "string") return c;
  return c?.rendered ?? "";
}

function firstImageSrcFromHtml(html) {
  const m = html?.match(/<img[^>]+src=["']([^"']+)["']/i);
  return m?.[1] ?? null;
}

export default async function CompanyShowcasePage() {
  let companies = [];
  try {
    const data = await fetchGraphQL(GET_COMPANY_SHOWCASE);
    companies = data?.companies?.nodes || [];
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <section className="mx-auto max-w-6xl px-6 py-12">
          <h1 className="text-2xl font-bold">Company Showcase</h1>
          <p className="mt-3 text-slate-300">
            Could not load companies from WPGraphQL.
          </p>
          <pre className="mt-4 whitespace-pre-wrap rounded-xl border border-slate-800 bg-slate-900/70 p-4 text-xs text-slate-200">
            {msg}
          </pre>
          <p className="mt-6">
            Check that your WPGraphQL endpoint is reachable at{" "}
            <span className="text-cyan-300">
              {process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL}
            </span>
            .
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">
              Company Showcase
            </p>
            <h1 className="mt-2 text-4xl font-bold md:text-5xl">
              Featured Companies
            </h1>
            <p className="mt-3 max-w-2xl text-slate-300">
              Explore companies from WordPress. This page is fully driven by your
              WPGraphQL backend.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/company"
              className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:border-cyan-400 hover:text-cyan-300"
            >
              Manage CRUD
            </Link>
            <Link
              href="/company/create"
              className="rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Add Company
            </Link>
          </div>
        </div>

        {companies.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-8 text-slate-300">
            No companies found. Create one from the CRUD page.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {companies.map((company) => {
              const html = renderedContent(company);
              const image =
                firstImageSrcFromHtml(html) ||
                null;
              const alt = company?.title || "Company";
              const plain = stripHtml(html);
              const description =
                plain ||
                "No description yet — add body content to this company in WordPress.";

              return (
                <article
                  key={company.id}
                  className="group overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-lg shadow-black/25 transition hover:-translate-y-1 hover:border-cyan-500/40"
                >
                  {image ? (
                    <img
                      src={image}
                      alt={alt}
                      className="h-48 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="flex h-48 w-full items-center justify-center bg-gradient-to-br from-cyan-600/40 to-indigo-600/40 text-sm text-slate-100">
                      No image
                    </div>
                  )}

                  <div className="p-5">
                    <h2 className="line-clamp-2 text-xl font-semibold">
                      {company.title || "Untitled Company"}
                    </h2>
                    <p className="mt-3 line-clamp-3 text-sm text-slate-300">
                      {description}
                    </p>
                    <p className="mt-4 text-xs text-slate-400">
                      ID: {company.databaseId}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
