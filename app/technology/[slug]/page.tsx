import { client } from "@/lib/apollo";
import { gql } from "@apollo/client";

const GET_TECH = gql`
  query GetTech($slug: ID!) {
    technology(id: $slug, idType: SLUG) {
      title
      content
    }
  }
`;

type TechQueryData = {
  technology: {
    title: string;
    content: string;
  } | null;
};

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function SingleTech({ params }: PageProps) {
  const { slug } = await params;

  const { data } = await client.query<TechQueryData>({
    query: GET_TECH,
    variables: { slug },
  });

  const post = data?.technology;
  if (!post) return <p>Technology post not found.</p>;

  return (
    <div>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  );
}