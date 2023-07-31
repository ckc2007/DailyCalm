// import { ApolloClient, InMemoryCache } from "@apollo/client";
// import { authService } from "./auth";
import client from "./ApolloClient";
import { GET_ME } from "../graphql/queries";
import {
  LOGIN_USER,
  ADD_USER,
  SAVE_CARD,
  REMOVE_CARD,
} from "../graphql/mutations";

// debug
// const client = new ApolloClient({
//   link: authLink,
//   uri: "/graphql",
//   cache: new InMemoryCache(),
// });

export const getMe = async (token) => {
  try {
    const response = await client.query({
      query: GET_ME,
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    if (!response || !response.data || !response.data.me) {
      throw new Error("Invalid response or missing data.");
    }

    return response.data.me;
  } catch (err) {
    console.error(err);
    throw new Error("Error fetching user data.");
  }
};

export const createUser = (userData) => {
  return client.mutate({
    mutation: ADD_USER,
    variables: userData,
  });
};

export const loginUser = (userData) => {
  return client.mutate({
    mutation: LOGIN_USER,
    variables: userData,
  });
};

// API.js
export const saveCard = async (cardData, token) => {
  try {
    const response = await client.mutate({
      mutation: SAVE_CARD,
      // was: variables: {cardData}
      variables: { cardData },
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    if (!response || !response.data || !response.data.saveCard) {
      throw new Error("Invalid response or missing data.");
    }

    return response.data.saveCard;
  } catch (err) {
    console.error(err);
    throw new Error("Error saving the card.");
  }
};

export const deleteCard = (cardId, token) => {
  return client.mutate({
    mutation: REMOVE_CARD,
    variables: { cardId },
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
};

export const fetchSavedCards = async (token) => {
  try {
    const response = await client.query({
      query: GET_ME,
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    if (!response || !response.data || !response.data.me) {
      throw new Error("Invalid response or missing data.");
    }

    // Assuming that `me.savedCards` contains the array of user's saved cards
    return response.data.me.savedCards;
  } catch (err) {
    console.error(err);
    throw new Error("Error fetching saved cards.");
  }
};

// change line 86. modify comment when done
// export const searchGoogleBooks = (query) => {
//   return fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
// };

export default client;
