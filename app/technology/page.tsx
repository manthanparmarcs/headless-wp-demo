"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

const GET_TECHNOLOGIES = gql`
{
  technologies {
    nodes {
      title
      slug
    }
  }
}
`;

type TechnologiesQueryData = {
  technologies: {
    nodes: Array<{ title: string; slug: string }>;
  };
};

export default function TechnologyPage() {
  const { loading, data, error } =
    useQuery<TechnologiesQueryData>(GET_TECHNOLOGIES);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading technologies</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Technology Posts</h1>

      {data?.technologies?.nodes?.map((item) => (
        <div key={item.slug} style={{ marginBottom: "10px" }}>
          <h2>{item.title}</h2>
        </div>
      ))}
    </div>
  );
}