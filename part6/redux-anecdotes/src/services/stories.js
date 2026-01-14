import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getStories = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const createStory = async (content) => {
  const object = { content, votes: 0 }
  const response = await axios.post(baseUrl, object)
  return response.data
}

const updateStoryVote = async (id, newObject) => {
  const response = await axios.put(`${baseUrl}/${id}`, newObject)
  return response.data
}

export default { getStories, createStory, updateStoryVote }
