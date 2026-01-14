import { useDispatch } from 'react-redux'
import { createStory } from '../reducers/storyReducer'
import { setNotification } from '../reducers/notificationReducer'

const StoryForm = () => {
  const dispatch = useDispatch()

  const addStory = async (event) => {
    event.preventDefault()
    const content = event.target.story.value
    event.target.story.value = ''
    dispatch(createStory(content))
    dispatch(setNotification(`new story '${content}'`, 5))
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addStory}>
        <div><input name="story" /></div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default StoryForm;
