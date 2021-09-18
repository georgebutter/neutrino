import { gql } from "@apollo/client";

export const GET_REPO = gql`
  query GetRepo {
    viewer {
      login
      repository (name: "NeutrinoDocs") {
        sshUrl
      }
    }
  }
`;

export const CREATE_REPO = gql`
  mutation createRepository {
    createRepository(input: {
      name: "NeutrinoDocs",
      visibility: PRIVATE
    }) {
      repository {
        sshUrl
      }
    }
  }
`;
