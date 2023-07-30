import React, { useState, useEffect } from "react";
import { Container, Col, Form, Button, Card, Row } from "react-bootstrap";

import { authService } from "../utils/auth";
import { saveCard } from "../utils/API";
import { saveCardIds, getSavedCardIds } from "../utils/localStorage";

// import { GET_ME } from "../utils/queries"; // Import the GET_ME query if you haven't already
// import { useQuery } from "@apollo/client"; // Import useQuery hook

// hard coded dummy data - will be replaced by our custom card data
// TODO: bring in our card data here once we create it
const dummyCards = [
  {
    cardId: "dummy_card_1",
    title: "Dummy Card 1",
    description: "This is the first dummy card.",
    image: "https://dummyimage.com/200x300",
  },
  {
    cardId: "dummy_card_2",
    title: "Dummy Card 2",
    description: "This is the second dummy card.",
    image: "https://dummyimage.com/200x300",
  },
  {
    cardId: "dummy_card_3",
    title: "Dummy Card 3",
    description: "This is the third dummy card.",
    image: "https://dummyimage.com/200x300",
  },
  {
    cardId: "dummy_card_4",
    title: "Dummy Card 4",
    description: "This is the fourth dummy card.",
    image: "https://dummyimage.com/200x300",
  },
  {
    cardId: "dummy_card_5",
    title: "Dummy Card 5",
    description: "This is the fifth dummy card.",
    image: "https://dummyimage.com/200x300",
  },
  {
    cardId: "dummy_card_6",
    title: "Dummy Card 6",
    description: "This is the sixth dummy card.",
    image: "https://dummyimage.com/200x300",
  },
];

const SearchCards = () => {
  // create state for holding returned google api data
  const [searchedCards, setSearchedCards] = useState([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState("");

  // create state to hold saved cardId values
  const [savedCardIds, setSavedCardIds] = useState(getSavedCardIds());

  // for saved message
  const [showSavedMessage, setShowSavedMessage] = useState(false);

  // Create a useEffect hook to set the dummyCards as searchedCards on component mount
  useEffect(() => {
    setSearchedCards(dummyCards);
  }, []);

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

    // new code

    try {
      // no need for an API fetch here anymore
      console.log("Form submitted with search input:", searchInput);

      setSearchedCards(dummyCards);
      setSearchInput("");
    } catch (err) {
      console.error(err);
    }
  };

  // create function to handle saving a card to our database
  const handleSaveCard = async (cardId) => {
    // debug searchedCards
    console.log("Searched Cards:", searchedCards);
    // find the card in `searchedCards` state by the matching id
    const cardToSave = searchedCards.find((card) => card.cardId === cardId);

    // debug >>> reading UNDEFINED
    console.log("cardToSave:", cardToSave);

    // get token
    const token = authService.loggedIn() ? authService.getToken() : null;

    if (!token) {
      return false;
    }

    // Construct the `cardData` object based on the expected structure from the server
    const cardData = {
      title: cardToSave.title,
      description: cardToSave.description,
      image: cardToSave.image,
      // Add other properties as needed based on the `CardInput` type in the GraphQL schema
    };
    // debug
    console.log("cardData:", cardData);

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
          {searchedCards.length > 0
            ? searchedCards.map((card) => {
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
                        {authService.loggedIn() && (
                          <Button
                            className="btn-block btn-info"
                            onClick={() => {
                              console.log("clicked card:", card);
                              handleSaveCard(card.cardId);
                            }}
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
              })
            : // Display the dummy cards when no searched cards are available
              dummyCards.map((card) => {
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
                        <Card.Text>{card.description}</Card.Text>
                        <Button
                          className="btn-block btn-info"
                          onClick={() => {
                            console.log(
                              "Clicked on Save Button for Card ID:",
                              card.cardId
                            );
                            handleSaveCard(card.cardId);
                          }}
                        >
                          {savedCardIds?.some(
                            (savedCardId) => savedCardId === card.cardId
                          )
                            ? "This card has already been saved!"
                            : "Save this Card!"}
                        </Button>
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
