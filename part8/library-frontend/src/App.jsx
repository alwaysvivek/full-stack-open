import { useState, useEffect } from "react";
import { useApolloClient, useQuery, useSubscription } from "@apollo/client/react";
import Writers from "./components/Writers";
import Volumes from "./components/Volumes";
import NewVolume from "./components/NewVolume";
import Recommend from "./components/Recommend";
import Login from "./components/Login";
import Notify from "./components/Notify";
import { VOLUME_ADDED, ME } from "./queries";
import { ERRORCOLOR, INFOCOLOR } from "./const";
import { updateWriters, updateVolumes } from "./cache";

const App = () => {
  const [page, setPage] = useState("writers");
  const [errorMessage, setErrorMessage] = useState(null);
  const [infoMessage, setInfoMessage] = useState(null);
  const [token, setToken] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState("");
  const client = useApolloClient();

  const userResult = useQuery(ME);
  const favoriteGenre = userResult?.data?.me?.favoriteGenre;

  useEffect(() => {
    const localUserToken = localStorage.getItem("app-user-token");
    if (localUserToken) {
      setToken(localUserToken);
    }
  }, []);

  useSubscription(VOLUME_ADDED, {
    onData: ({ data, client }) => {
      if (!data?.data?.volumeAdded) {
        return;
      }
      handleNewVolume(data.data.volumeAdded, client);
    }
  })

  const handleNewVolume = (volume, client) => {
    const writer = volume.writer.name;
    const title = volume.title;
    updateVolumes(client, volume);
    updateWriters(client, volume);
    setInfoMessage(`New volume added: ${title} by ${writer}`);
    setTimeout(() => {
      setInfoMessage(null);
    }, 10000);
  };

  const notify = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 10000);
  };

  const handleLogin = (token) => {
    setToken(token);
    localStorage.setItem("app-user-token", token);
    setPage("writers");
  }

  const handleLogout = () => {
    setToken("");
    localStorage.clear();
    client.resetStore();
    setPage("writers");
  };

  const handleGenreChange = (event) => {
    setSelectedGenre(event.target.value);
  };

  return (
    <div>
      <Notify message={errorMessage} color={ERRORCOLOR} />
      <div>
        <button onClick={() => setPage("writers")}>writers</button>
        <button onClick={() => setPage("volumes")}>volumes</button>
        {token ? (
          <>
            <button onClick={() => setPage("add")}>add volume</button>
            <button onClick={() => setPage("recommend")}>recommend</button>
            <button onClick={handleLogout}>logout</button>
          </>
        ) : (
          <button onClick={() => setPage("login")}>login</button>
        )}
      </div>
      <Writers
        show={page === "writers"}
        setError={notify}
      />
      <Volumes
        show={page === "volumes"}
        selectedGenre={selectedGenre}
        handleGenreChange={handleGenreChange}
      />
      <Recommend
        show={page === "recommend"}
        favoriteGenre={favoriteGenre}
      />
      <NewVolume
        show={page === "add"}
        setError={notify}
      />
      <Login
        show={page === "login"}
        setError={notify}
        handleLogin={handleLogin}
      />
      <Notify message={infoMessage} color={INFOCOLOR} />
    </div>
  );
};

export default App;
