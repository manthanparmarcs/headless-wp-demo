export const GET_COMPANIES = `
  query {
    companies {
      nodes {
        id
        databaseId
        title
        status
      }
    }
  }
`;

export const GET_COMPANIES_WITH_FEATURED_IMAGE = `
  query {
    companies {
      nodes {
        id
        databaseId
        title
        status
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
  }
`;

export const GET_COMPANY = `
  query GetCompany($id: ID!) {
    company(id: $id, idType: DATABASE_ID) {
      id
      databaseId
      title
      status
    }
  }
`;

export const GET_COMPANY_WITH_FEATURED_IMAGE = `
  query GetCompanyWithFeaturedImage($id: ID!) {
    company(id: $id, idType: DATABASE_ID) {
      id
      databaseId
      title
      status
      featuredImage {
        node {
          id
          sourceUrl
          altText
        }
      }
    }
  }
`;

export const GET_COMPANY_SHOWCASE = `
  query GetCompanyShowcase {
    companies {
      nodes {
        id
        databaseId
        title
        content
      }
    }
  }
`;