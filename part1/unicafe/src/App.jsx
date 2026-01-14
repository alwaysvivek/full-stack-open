import { useState } from "react";

const FeedbackBtn = ({ onClick, label }) => (
  <button onClick={onClick}>{label}</button>
);

const StatLine = ({ label, value }) => {
  return (
    <tr>
      <td>{label}</td>
      <td>{value}</td>
    </tr>
  );
};

const FeedbackHistory = ({ goodCount, neutralCount, badCount }) => {
  const totalCount = goodCount + neutralCount + badCount;
  const avgScore = ((goodCount - badCount) / totalCount).toFixed(1);
  const positivePct = ((goodCount / totalCount) * 100).toFixed(1);

  if (totalCount === 0) {
    return <p>No feedback given</p>;
  }

  return (
    <table>
      <tbody>
        <StatLine label="good" value={goodCount} />
        <StatLine label="neutral" value={neutralCount} />
        <StatLine label="bad" value={badCount} />
        <StatLine label="all" value={totalCount} />
        <StatLine label="average" value={avgScore} />
        <StatLine label="positive" value={positivePct + " %"} />
      </tbody>
    </table>
  );
};

const App = () => {
  const [goodCount, setGoodCount] = useState(0);
  const [neutralCount, setNeutralCount] = useState(0);
  const [badCount, setBadCount] = useState(0);

  const incGood = () => setGoodCount(goodCount + 1);
  const incNeutral = () => setNeutralCount(neutralCount + 1);
  const incBad = () => setBadCount(badCount + 1);

  return (
    <>
      <h1>give feedback</h1>
      <FeedbackBtn onClick={incGood} label="good" />
      <FeedbackBtn onClick={incNeutral} label="neutral" />
      <FeedbackBtn onClick={incBad} label="bad" />
      <h1>statistics</h1>
      <FeedbackHistory goodCount={goodCount} neutralCount={neutralCount} badCount={badCount} />
    </>
  );
};

export default App;
