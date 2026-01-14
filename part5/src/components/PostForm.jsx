import { useState } from 'react'

const PostForm = ({ createPost }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const handlePostCreation = async (event) => {
    event.preventDefault()
    const success = await createPost({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    })
    if (success) {
      setNewTitle('')
      setNewAuthor('')
      setNewUrl('')
    }
  }

  return (
    <div>
      <h2>Create a new post</h2>

      <form onSubmit={handlePostCreation}>
        <div>
          title:
          <input
            value={newTitle}
            onChange={(event) => setNewTitle(event.target.value)}
            placeholder="write details here"
            id="title-input"
          />
        </div>
        <div>
          author:
          <input
            value={newAuthor}
            onChange={(event) => setNewAuthor(event.target.value)}
            placeholder="write details here"
            id="author-input"
          />
        </div>
        <div>
          url:
          <input
            value={newUrl}
            onChange={(event) => setNewUrl(event.target.value)}
            placeholder="write details here"
            id="url-input"
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default PostForm
