import { gql } from "@apollo/client";

export const GET_ME = gql`
  query {
    me {
      _id
      username
      email
      savedCards {
        _id
        authors
        description
        cardId
        image
        link
        title
      }
    }
  }
`;

// note this may need to change