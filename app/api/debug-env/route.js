export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({
    hasGraphqlUrl: Boolean(process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL),
    hasUsername: Boolean(process.env.WORDPRESS_GRAPHQL_USERNAME),
    hasApplicationPassword: Boolean(process.env.WORDPRESS_GRAPHQL_APPLICATION_PASSWORD),
    hasAuthToken: Boolean(process.env.WORDPRESS_GRAPHQL_AUTH_TOKEN),
    nodeEnv: process.env.NODE_ENV || null,
    vercelEnv: process.env.VERCEL_ENV || null,
  });
}
