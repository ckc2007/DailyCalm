import React, { useEffect, useState } from "react";
import { fetchSavedCards } from "../utils/API";
import Confetti from "react-confetti";
import { Link } from "react-router-dom";
import { authService } from "../utils/auth";
import { Card, Button, Container, Row, Col } from "react-bootstrap";

const PlayPage = () => {
  const [savedCards, setSavedCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [goal, setGoal] = useState(5);
  const [confettiActive, setConfettiActive] = useState(false);

  let timer; // Declare the timer variable outside the useEffect hook

  useEffect(() => {
    // Fetch saved cards data when the component mounts
    const token = authService.getToken();
    fetchSavedCards(token)
      .then((cards) => {
        setSavedCards(cards);
      })
      .catch((error) => {
        console.error(error);
      });

    // Clean up the setInterval when the component unmounts
    return () => clearInterval(timer);
  }, []);

  // Function to update the displayed card index every 30 minutes
  useEffect(() => {
    timer = setInterval(() => {
      setCurrentCardIndex((prevIndex) => (prevIndex + 1) % savedCards.length);
    }, 30 * 60 * 1000); // 30 minutes in milliseconds

    // Clean up the setInterval when the component unmounts
    return () => clearInterval(timer);
  }, [savedCards]);

  // Function to handle the "Next" button click
  const handleNextClick = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % savedCards.length);
  };

  // Function to handle the "+" button click to update the score and trigger confetti animation
  const handleAddScore = () => {
    setScore((prevScore) => prevScore + 1);
    setConfettiActive(true); // Activate confetti animation
  };

  // Function to stop confetti animation after a brief period
  useEffect(() => {
    if (confettiActive) {
      const confettiTimer = setTimeout(() => {
        setConfettiActive(false);
      }, 3000); // Duration of the confetti animation in milliseconds

      // Clean up the setTimeout when the component unmounts or when confettiActive becomes false
      return () => clearTimeout(confettiTimer);
    }
  }, [confettiActive]);

  // Function to handle goal input change
  const handleGoalChange = (e) => {
    const newGoal = parseInt(e.target.value, 10);
    setGoal(newGoal);
  };

  return (
    <>
      {/* Goal input box */}
      <Container>
        <Row>
          <Col md={6} className="mx-auto">
            <Card>
              <Card.Body>
                <div>
                  <label htmlFor="goal">What is your goal for today?</label>
                  <input
                    type="number"
                    id="goal"
                    name="goal"
                    value={goal}
                    onChange={handleGoalChange}
                  />
                </div>
                {/* Display the progress */}
                <div>
                  Progress: {score}/{goal}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Display confetti animation when the "+" button is clicked */}
      {confettiActive && <Confetti />}

      {/* Display the current card based on currentCardIndex */}
      {savedCards.length > 0 ? (
        <Container>
          <Row>
            <Col md={4} className="mx-auto">
              <Card>
                {savedCards[currentCardIndex].image ? (
                  <Card.Img
                    src={savedCards[currentCardIndex].image}
                    alt={`The cover for ${savedCards[currentCardIndex].title}`}
                    variant="top"
                  />
                ) : (
                  // If there's no image, display a placeholder image or other content
                  <div className="image-placeholder">No Image Available</div>
                )}
                <Card.Body>
                  <Card.Title>{savedCards[currentCardIndex].title}</Card.Title>
                  <Card.Text>
                    {savedCards[currentCardIndex].description}
                  </Card.Text>
                  {/* Add a "+" button to update the score */}
                  <Button onClick={handleAddScore}>+</Button>
                  {/* Add a "Next" button to display the next card */}
                  <Button onClick={handleNextClick}>Next</Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      ) : (
        <Container>
          <Row>
            <Col md={6} className="mx-auto">
              <Card>
                <Card.Body>
                  <p>
                    To start your self-care routine, please search for Calms and
                    save them. You can search for Calms <Link to="/">here</Link>
                    .
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
};

export default PlayPage;
