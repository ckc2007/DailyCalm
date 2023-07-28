import React, { useState, useEffect } from "react";
import { Container, Col, Form, Button, Card, Row } from "react-bootstrap";

import { authService } from "../utils/auth";
import { saveCard, searchGoogleCards } from "../utils/API";
import { saveCardIds, getSavedCardIds } from "../utils/localStorage";

const SearchCards = () => {
  // create state for holding returned google api data
  const [searchedCards, setSearchedCards] = useState([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState("");

  // create state to hold saved cardId values
  const [savedCardIds, setSavedCardIds] = useState(getSavedCardIds());

  // for saved message
  const [showSavedMessage, setShowSavedMessage] = useState(false);

  // set up useEffect hook to save `savedCardIds` list to localStorage on component unmount
  // learn more here: https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup
  useEffect(() => {
    return () => saveCardIds(savedCardIds);
  }, [savedCardIds]);

  // create method to search for cards and set state on form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await searchGoogleCards(searchInput);

      if (!response.ok) {
        throw new Error("something went wrong!");
      }

      const { items } = await response.json();

      const cardData = items.map((card) => ({
        cardId: card.id,
        authors: card.volumeInfo.authors || ["No author to display"],
        title: card.volumeInfo.title,
        description: card.volumeInfo.description,
        image: card.volumeInfo.imageLinks?.thumbnail || "",
      }));

      setSearchedCards(cardData);
      setSearchInput("");
    } catch (err) {
      console.error(err);
    }
  };

  // create function to handle saving a card to our database
  const handleSaveCard = async (cardId) => {
    // find the card in `searchedCards` state by the matching id
    const cardToSave = searchedCards.find((card) => card.cardId === cardId);

    // get token
    const token = authService.loggedIn() ? authService.getToken() : null;

    if (!token) {
      return false;
    }
    // debug
    try {
      const savedCard = await saveCard(cardToSave, token);
      // Handle the response from saveCard if needed
      console.log("Card saved:", savedCard);

      // Show the saved message only when saving for the first time
      if (!savedCardIds.includes(cardId)) {
        setShowSavedMessage(true);
        setTimeout(() => {
          setShowSavedMessage(false);
        }, 2000); // Hide the message after 2 seconds (adjust the time as needed)
      }
      // Update the savedCardIds state
      setSavedCardIds([...savedCardIds, cardToSave.cardId]);
    } catch (err) {
      console.error(err);
      // Handle the error message if needed
      console.log("Error saving the card:", err.message);
    }
  };

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Search for Cards!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name="searchInput"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type="text"
                  size="lg"
                  placeholder="Search for a card"
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type="submit" variant="success" size="lg">
                  Submit Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>

      <Container>
        <h2 className="pt-5">
          {searchedCards.length
            ? `Viewing ${searchedCards.length} results:`
            : "Search for a card to begin"}
        </h2>
        <Row>
          {searchedCards.map((card) => {
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
                    <p className="small">Authors: {card.authors}</p>
                    <Card.Text>{card.description}</Card.Text>
                    {authService.loggedIn() && (
                      <Button
                        disabled={savedCardIds?.some(
                          (savedCardId) => savedCardId === card.cardId
                        )}
                        className="btn-block btn-info"
                        onClick={() => handleSaveCard(card.cardId)}
                      >
                        {savedCardIds?.some(
                          (savedCardId) => savedCardId === card.cardId
                        )
                          ? "This card has already been saved!"
                          : "Save this Card!"}
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
      {showSavedMessage && <div>Saved!</div>}
    </>
  );
};

export default SearchCards;
