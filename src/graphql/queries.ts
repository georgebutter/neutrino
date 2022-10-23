import { gql } from '@apollo/client';

export const GET_REPO = gql`
  query GetRepo {
    viewer {
      login
      repository(name: "NeutrinoDocs") {
        sshUrl
      }
    }
  }
`;
