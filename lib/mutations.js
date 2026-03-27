export const CREATE_COMPANY = `
  mutation ($title: String!) {
    createCompany(input: { title: $title, status: PUBLISH }) {
      company {
        id
        databaseId
        title
        status
      }
    }
  }
`;

export const CREATE_COMPANY_WITH_FEATURED_IMAGE = `
  mutation ($title: String!, $featuredImageId: Int!) {
    createCompany(
      input: {
        title: $title
        status: PUBLISH
        featuredImageId: $featuredImageId
      }
    ) {
      company {
        id
        databaseId
        title
        status
      }
    }
  }
`;

export const UPDATE_COMPANY = `
  mutation ($id: ID!, $title: String!) {
    updateCompany(input: { id: $id, title: $title, status: PUBLISH }) {
      company {
        id
        databaseId
        title
        status
      }
    }
  }
`;

export const UPDATE_COMPANY_WITH_FEATURED_IMAGE = `
  mutation ($id: ID!, $title: String!, $featuredImageId: Int) {
    updateCompany(
      input: {
        id: $id
        title: $title
        status: PUBLISH
        featuredImageId: $featuredImageId
      }
    ) {
      company {
        id
        databaseId
        title
        status
      }
    }
  }
`;

export const DELETE_COMPANY = `
  mutation ($id: ID!) {
    deleteCompany(input: { id: $id }) {
      deletedId
    }
  }
`;