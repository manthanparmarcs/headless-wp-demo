"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import Link from "next/link";

const GET_POSTS = gql`
{
  posts {
    nodes {
      title
      slug
    }
  }
}
`;

type PostsQueryData = {
  posts: {
    nodes: Array<{ title: string; slug: string }>;
  };
};

export default function Page() {
  const { loading, data, error } = useQuery<PostsQueryData>(GET_POSTS);

  if (loading) return <p style={{ padding: 24 }}>Loading...</p>;
  if (error) return <p style={{ padding: 24 }}>Error loading posts</p>;

  return (
    <main style={{ maxWidth: 980, margin: "0 auto", padding: 24 }}>
      <header
        style={{
          border: "1px solid #1f2937",
          borderRadius: 14,
          padding: 18,
          background: "#0b1220",
        }}
      >
        <h1 style={{ margin: 0, fontSize: 30 }}>Next.js Demo</h1>
        <p style={{ margin: "8px 0 0", color: "#94a3b8" }}>by Manthan Parmar</p>
        <nav style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link
            href="/company"
            style={{
              textDecoration: "none",
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid #334155",
              background: "#0f172a",
              color: "#e2e8f0",
            }}
          >
            Company
          </Link>
          <Link
            href="/cf7"
            style={{
              textDecoration: "none",
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid #334155",
              background: "#0f172a",
              color: "#e2e8f0",
            }}
          >
            Contact Us
          </Link>
        </nav>
      </header>

      <section style={{ marginTop: 20 }}>
        <h2 style={{ marginTop: 0 }}>My Blog</h2>
        <div style={{ display: "grid", gap: 10 }}>
          {data?.posts?.nodes?.map((post) => (
            <article
              key={post.slug}
              style={{
                border: "1px solid #1f2937",
                borderRadius: 10,
                padding: 12,
                background: "#0b1220",
              }}
            >
              {post.title}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}