import { useState } from "react";

const App = () => {
  const anecdotesList = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.",
    "The only way to go fast, is to go well.",
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [points, setPoints] = useState(new Array(anecdotesList.length).fill(0));

  const selectRandomAnecdote = () => {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * anecdotesList.length);
    } while (randomIndex === activeIndex);
    setActiveIndex(randomIndex);
  };

  const voteForAnecdote = () => {
    const newPoints = [...points];
    newPoints[activeIndex] += 1;
    setPoints(newPoints);
  };

  const getTopAnecdoteIndex = () => {
    return points.indexOf(Math.max(...points));
  };

  const topIndex = getTopAnecdoteIndex();

  return (
    <>
      <h1>Anecdote of the day</h1>
      <div>{anecdotesList[activeIndex]}</div>
      <div>has {points[activeIndex]} votes</div>
      <button onClick={voteForAnecdote}>vote</button>
      <button onClick={selectRandomAnecdote}>next anecdote</button>
      <h1>Anecdote with most votes</h1>
      <div>{anecdotesList[topIndex]}</div>
      <div>has {points[topIndex]} votes</div>
    </>
  );
};

export default App;
