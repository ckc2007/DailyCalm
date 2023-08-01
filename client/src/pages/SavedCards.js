import React, { useState, useEffect } from "react";
import { Container, Card, Button, Row, Col } from "react-bootstrap";

import { getMe, deleteCard } from "../utils/API";
import { authService } from "../utils/auth";
import { removeCardId } from "../utils/localStorage";

const SavedCards = () => {
  const [userData, setUserData] = useState({});

  // use this to determine if `useEffect()` hook needs to run again
  const userDataLength = Object.keys(userData).length;

  useEffect(() => {
    const getUserData = async () => {
      try {
        const token = authService.loggedIn() ? authService.getToken() : null;

        if (!token) {
          return false;
        }

        const user = await getMe(token);

        if (!user) {
          throw new Error("something went wrong!");
        }

        // debugged response here not an HTTP response object, added user instead from getMe
        setUserData(user);
      } catch (err) {
        console.error(err);
      }
    };

    getUserData();
  }, [userDataLength]);

  // create function that accepts the card's mongo _id value as param and deletes the card from the database
  const handleDeleteCard = async (cardId) => {
    const token = authService.loggedIn() ? authService.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await deleteCard(cardId, token);
  
      // If the deleteCard function does not throw an error,
      // it means the card was deleted successfully.
      // So, update the user data and remove the card's id from localStorage.
      const updatedUser = { ...userData };
      updatedUser.savedCards = updatedUser.savedCards.filter(
        (card) => card.cardId !== cardId
      );
      setUserData(updatedUser);
      removeCardId(cardId);
    } catch (err) {
      console.error(err);
      // Handle the error message if needed
      console.log("Error deleting the card:", err.message);
      // ...
    }
  };

  // if data isn't here yet, say so
  if (!userDataLength) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div fluid className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved Calms!</h1>
        </Container>
      </div>
      <Container>
        <h2 className="pt-5">
          {userData.savedCards.length
            ? `Viewing ${userData.savedCards.length} saved ${
                userData.savedCards.length === 1 ? "card" : "cards"
              }:`
            : "You have no saved cards!"}
        </h2>
        <Row>
          {userData.savedCards.map((card) => {
            return (
              <Col key={card.cardId} md="4">
                <Card key={card.cardId} border="dark">
                  {card.image ? (
                    <Card.Img
                      src={card.image}
                      alt={`The cover for ${card.title}`}
                      variant="top"
                    />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{card.title}</Card.Title>
                    <p className="small">Date: {card.date}</p>
                    <Card.Text>{card.description}</Card.Text>
                    <Button
                      className="btn-block btn-danger"
                      onClick={() => handleDeleteCard(card.cardId)}
                    >
                      Delete this Calm!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedCards;
