import { useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate, useMatch } from "react-router-dom";
import { useField } from "./hooks";

const Menu = () => {
  const padding = {
    paddingRight: 5,
  };
  return (
    <div>
      <Link to="/" style={padding}>
        stories
      </Link>
      <Link to="/create" style={padding}>
        create new
      </Link>
      <Link to="/about" style={padding}>
        about
      </Link>
    </div>
  );
};

const Story = ({ story }) => {
  return (
    <div>
      <h2>{story.content}</h2>
    </div>
  );
};

const StoryList = ({ stories }) => (
  <div>
    <h2>Stories</h2>
    <ul>
      {stories.map((story) => (
        <li key={story.id}>
          <Link to={`/stories/${story.id}`}>{story.content}</Link>
        </li>
      ))}
    </ul>
  </div>
);

const About = () => (
  <div>
    <h2>About story app</h2>
    <p>According to Wikipedia:</p>

    <em>
      A story is a brief, revealing account of an individual person or an
      incident.
    </em>

    <p>
      Software engineering is full of excellent stories, at this app you can
      find the best and add more.
    </p>
  </div>
);

const Footer = () => (
  <div>
    Story app for <a href="https://fullstackopen.com/">Full Stack Open</a>.
  </div>
);

const CreateStory = ({ addNew, setNotification }) => {
  const { onReset: onContentReset, ...content } = useField("text");
  const { onReset: onAuthorReset, ...author } = useField("text");
  const { onReset: onInfoReset, ...info } = useField("text");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    addNew({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0,
    });
    navigate("/");
    setNotification(`A new story ${content.value} created successfully!`);
  };

  const handleReset = (e) => {
    e.preventDefault();
    onContentReset();
    onAuthorReset();
    onInfoReset();
  };

  return (
    <div>
      <h2>create a new story</h2>
      <form>
        <div>
          content
          <input
            {...content}
          />
        </div>
        <div>
          author
          <input
            {...author}
          />
        </div>
        <div>
          url for more info
          <input
            {...info}
          />
        </div>
        <button onClick={handleSubmit}>create</button>
        <button onClick={handleReset}>reset</button>
      </form>
    </div>
  );
};

const App = () => {
  const [stories, setStories] = useState([
    {
      content: "If it hurts, do it more often",
      author: "Jez Humble",
      info: "https://martinfowler.com/bliki/FrequencyReducesDifficulty.html",
      votes: 0,
      id: 1,
    },
    {
      content: "Premature optimization is the root of all evil",
      author: "Donald Knuth",
      info: "http://wiki.c2.com/?PrematureOptimization",
      votes: 0,
      id: 2,
    },
  ]);

  const [notification, setNotification] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setNotification(null);
    }, 4000);
    return () => {
      clearTimeout(timeout);
    };
  }, [notification]);

  const match = useMatch("/stories/:id");
  const story = match
    ? stories.find((story) => story.id === Number(match.params.id))
    : null;

  const addNew = (story) => {
    story.id = Math.round(Math.random() * 10000);
    setStories(stories.concat(story));
  };

  return (
    <div>
      <h1>Software stories</h1>
      <Menu />
      {notification}
      <Routes>
        <Route path="/" element={<StoryList stories={stories} />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/create"
          element={
            <CreateStory addNew={addNew} setNotification={setNotification} />
          }
        />
        <Route
          path="/stories/:id"
          element={<Story story={story} />}
        />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
