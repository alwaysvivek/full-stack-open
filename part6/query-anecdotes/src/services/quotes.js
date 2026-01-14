import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getQuotes = async () => {
  const res = await axios.get(baseUrl)
  return res.data
}

const createQuote = async (content) => {
  const res = await axios.post(baseUrl, content)
  return res.data
}

const updateQuote = async (updatedQuote) => {
  const res = await axios.put(`${baseUrl}/${updatedQuote.id}`, updatedQuote)
  return res.data
}

export default { getQuotes, createQuote, updateQuote }