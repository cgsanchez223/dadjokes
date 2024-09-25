import React, { Component, useState, useEffect } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

/** List of jokes. */
// refractoring class to function. Using useState and useEffect instead of Component
function JokeList(props) {
  const [jokes, setJokes] = useState([]);
  const [seenJokes, setSeenJokes] = useState({});
  const [isLoading, setIsLoading] = useState(true);


  // /* retrieve jokes from API */

  // Changed class to function
  async function getJokes() {
    try {
      // load jokes one at a time, adding not-yet-seen jokes
      let newJokes = [];
      let newSeenJokes = { ...seenJokes };

      while (newJokes.length < props.numJokesToGet) {
        let res = await axios.get("https://icanhazdadjoke.com", {
          headers: { Accept: "application/json" }
        });
        let joke = res.data;

        if (!newSeenJokes[joke.id]) {
          newSeenJokes[joke.id] = true;
          newJokes.push({ id: joke.id, joke: joke.joke, votes: 0 });
        } else {
          console.log("duplicate found!", joke.joke);
        }
      }

      setSeenJokes(newSeenJokes);
      setJokes(newJokes);
      setIsLoading(false);

    } catch (err) {
      console.error(err);
    }
  }

  // get jokes at mount
  useEffect(() => {
    getJokes();
  }, []);

  /* empty joke list, set to loading state, and then call getJokes */
  // converting to a function
  function generateNewJokes() {
    setIsLoading(true);
    let newJokes = [];
    let newSeenJokes = { ...seenJokes };
  

    // Fetch new jokes
    async function fetchNewJokes() {
      try {
        while (newJokes.length < props.numJokesToGet) {
          let res = await axios.get("https://icanhazdadjoke.com", {
            headers: { Accept: "application/json"},
          });
          let joke = res.data;

          if (!newSeenJokes[joke.id]) {
            newSeenJokes[joke.id] = true;
            newJokes.push({ id: joke.id, joke: joke.joke, votes: 0 });
          } else {
            console.log("Duplicate found", joke.joke)
          }
        }

        setSeenJokes(newSeenJokes);
        setJokes((prevJokes) => [...prevJokes, ...newJokes]);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setIsLoading(false);
      }
    }

    fetchNewJokes();
  }

  /* change vote for this id by delta (+1 or -1) */
  // convert to function

  function vote(id, delta) {
    setJokes((st) => 
      st.map((j) =>
        j.id === id ? { ...j, votes: j.votes + delta } : j
      )
    );
  }

  /* render: either loading spinner or list of sorted jokes. */

  let sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);
  if (isLoading) {
    return (
      <div className="loading">
        <i className="fas fa-4x fa-spinner fa-spin" />
      </div>
    );
  }

  return (
    <div className="JokeList">
      <button
        className="JokeList-getmore"
        onClick={generateNewJokes}
      >
        Get New Jokes
      </button>

      {sortedJokes.map((j) => (
        <Joke
          text={j.joke}
          key={j.id}
          id={j.id}
          votes={j.votes}
          vote={vote}
        />
      ))}
    </div>
  );
}

JokeList.defaultProps = {
  numJokesToGet: 5,
};

export default JokeList;
