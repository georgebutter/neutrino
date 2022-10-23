import { gql } from '@apollo/client';

export const CREATE_REPO = gql`
  mutation createRepository {
    createRepository(input: { name: "NeutrinoDocs", visibility: PRIVATE }) {
      repository {
        sshUrl
      }
    }
  }
`;
