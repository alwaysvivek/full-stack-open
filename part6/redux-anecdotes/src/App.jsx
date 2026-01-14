import { useEffect } from "react";
import { useDispatch } from 'react-redux'
import StoryForm from "./components/StoryForm";
import StoryList from "./components/StoryList";
import Filter from "./components/Filter";
import Notifications from "./components/Notifications";
import { initializeStories } from './reducers/storyReducer'

const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(initializeStories())
  }, [dispatch])

  return (
    <div>
      <h2>Stories</h2>
      <Notifications />
      <Filter />
      <StoryList />
      <StoryForm />
    </div>
  );
};

export default App;
