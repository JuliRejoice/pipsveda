import { gql } from "@apollo/client";

export const GET_ALL_BLOG_DATA = gql`
  query ExampleQuery($pagination: PaginationArg, $filters: BlogFiltersInput) {
  blogs_connection(pagination: $pagination, filters: $filters) {
    nodes {
      author {
        id
        name
        picture {
          url
        }
        biography
        title
      }
      categories {
        slug
        createdAt
        description
        name
      }
      coverImage {
        url
      }
      createdAt
      documentId
      shortDescription
      title
      slug
    }
    pageInfo {
      total
      page
      pageCount
      pageSize
    }
  }
}
`;

export const GET_BLOG_CATEGORIES = gql`
    query ExampleQuery {
        categories {
            name
            slug
        }
    }
`;

export const GET_BLOG_DETAILS = gql`
   query Query($pagination: PaginationArg, $filters: BlogFiltersInput) {
  blogs_connection(filters: $filters) {
    nodes {
      documentId
      title
      slug
      coverImage {
        url
      }
      shortDescription
      detailImage {
        url
      }
      blogContent
      categories {
        name
        slug
        description
      }
      seo {
        id
        title
        description
        image {
          url
        }
        url
        slug
        keywords
        faqSchema
      }
      author {
        id
        name
        picture {
          url
        }
        biography
        title
      }
      faq(pagination: $pagination) {
        question
        answer
      }
      createdAt
      updatedAt
      publishedAt
    }
  }
}
`;