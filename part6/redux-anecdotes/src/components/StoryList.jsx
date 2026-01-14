import { useDispatch, useSelector } from 'react-redux'
import { voteStory } from '../reducers/storyReducer'
import { setNotification } from '../reducers/notificationReducer'

const StoryList = () => {
  const dispatch = useDispatch()
  const stories = useSelector(({ stories, filter }) => {
    if (filter === 'ALL') {
      return stories
    }
    return stories.filter(story => story.content.toLowerCase().includes(filter.toLowerCase()))
  })

  // sort by votes
  const sortedStories = [...stories].sort((a, b) => b.votes - a.votes)

  const vote = (story) => {
    console.log('vote', story.id)
    dispatch(voteStory(story))
    dispatch(setNotification(`you voted '${story.content}'`, 5))
  }

  return (
    <div>
      {sortedStories.map(story =>
        <div key={story.id}>
          <div>
            {story.content}
          </div>
          <div>
            has {story.votes}
            <button onClick={() => vote(story)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default StoryList;
