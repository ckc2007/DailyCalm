import React, { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_SCORE, UPDATE_GOAL } from "../graphql/mutations";
import { GET_ME } from "../graphql/queries";
// TODO: refactor api:
import { fetchSavedCards } from "../utils/API";
import Confetti from "react-confetti";
import { Link } from "react-router-dom";
import { authService } from "../utils/auth";

const PlayPage = () => {
  const [savedCards, setSavedCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  // const [score, setScore] = useState(0);
  // const [goal, setGoal] = useState(5);
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
    }, 30 * 1000); // 30 minutes in milliseconds

    // Clean up the setInterval when the component unmounts
    return () => clearInterval(timer);
  }, [savedCards]);

  // Use ADD_SCORE mutation
  const [addScoreMutation] = useMutation(ADD_SCORE, {
    update(cache, { data: { addScore: updatedScore } }) {
      try {
        const { me } = cache.readQuery({ query: GET_ME });
        const newScore = updatedScore.score;
        cache.writeQuery({
          query: GET_ME,
          data: {
            me: {
              ...me,
              score: newScore,
            },
          },
        });
      } catch (e) {
        console.error(e);
      }
    },
  });

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
      <div className="container">
        <div className="columns is-centered">
          <div className="column is-half">
            <div className="box">
              <div className="field">
                <label htmlFor="goal" className="label">
                  What is your goal for today?
                </label>
                <div className="control">
                  <input
                    type="number"
                    id="goal"
                    name="goal"
                    value={goal}
                    onChange={handleGoalChange}
                    className="input"
                  />
                </div>
              </div>
              {/* Display the progress */}
              <div className="content">
                <p>
                  Progress: {score}/{goal}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Display confetti animation when the "+" button is clicked */}
      {confettiActive && <Confetti />}

      {/* Display the current card based on currentCardIndex */}
      {savedCards.length > 0 ? (
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-half">
              <div className="box">
                <div className="card">
                  {savedCards[currentCardIndex].image ? (
                    <div className="card-image">
                      <figure className="image">
                        <img
                          src={savedCards[currentCardIndex].image}
                          alt={`The cover for ${savedCards[currentCardIndex].title}`}
                        />
                      </figure>
                    </div>
                  ) : (
                    // If there's no image, display a placeholder image or other content
                    <div className="card-content">
                      <div className="content">No Image Available</div>
                    </div>
                  )}
                  <div className="card-content">
                    <p className="title is-4">
                      {savedCards[currentCardIndex].title}
                    </p>
                    <p>{savedCards[currentCardIndex].description}</p>
                  </div>
                  <div className="card-footer">
                    {/* Add a "+" button to update the score */}
                    <button
                      className="button is-success"
                      onClick={handleAddScore}
                    >
                      +
                    </button>
                    {/* Add a "Next" button to display the next card */}
                    <button
                      className="button is-primary"
                      onClick={handleNextClick}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-half">
              <div className="box">
                <div className="content">
                  <p>
                    To start your self-care routine, please search for Calms and
                    save them. You can search for Calms <Link to="/">here</Link>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PlayPage;
