import { useState, useEffect, useRef } from 'react'
import PostList from './components/PostList'
import PostForm from './components/PostForm'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import postService from './services/posts'
import loginService from './services/login'

const App = () => {
  const [posts, setPosts] = useState([])
  const [notification, setNotification] = useState(null)
  const [user, setUser] = useState(null)

  const postFormRef = useRef()

  useEffect(() => {
    postService.getAll().then((data) => setPosts(sortPosts(data)))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      postService.setToken(user.token)
      setUser(user)
    }
  }, [])

  const loginUser = async (loginCredentials) => {
    try {
      const user = await loginService.login(loginCredentials)
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      postService.setToken(user.token)
      setUser(user)
    } catch (error) {
      handleError(error)
    }
  }

  const logOutUser = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
    postService.setToken(null)
  }

  const createPost = async (newPost) => {
    try {
      const createdPost = await postService.create(newPost)
      setPosts(posts.concat(createdPost))
      handleNotification(
        `A new post "${createdPost.title}" by ${createdPost.author} added`,
        'success'
      )
      postFormRef.current.toggleVisibility()
      return true
    } catch (error) {
      handleError(error)
      return false
    }
  }

  const likePost = async (post) => {
    const { id, title, author, url, likes } = post
    try {
      const updatedPost = await postService.update({
        id,
        title,
        author,
        url,
        likes: likes + 1,
      })
      setPosts(
        sortPosts(posts.map((p) => (p.id === updatedPost.id ? updatedPost : p)))
      )
    } catch (error) {
      handleError(error)
    }
  }

  const removePost = async ({ id, title, author }) => {
    try {
      await postService.remove(id)
      setPosts(posts.filter((p) => p.id !== id))
      handleNotification(`Post "${title}" by ${author} was deleted`, 'success')
    } catch (error) {
      handleError(error)
    }
  }

  const sortPosts = (items) => {
    return items.sort((a, b) => b.likes - a.likes)
  }

  const handleNotification = (message, type) => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 4000)
  }

  const handleError = (error) => {
    if (error.response?.data?.error) {
      handleNotification(error.response.data.error, 'error')
    } else {
      handleNotification('An unknown error occurred', 'error')
    }
  }

  return (
    <div>
      {!user ? (
        <>
          <h2>Log in to application</h2>
          <Notification notification={notification} />
          <LoginForm loginUser={loginUser} />
        </>
      ) : (
        <>
          <h2>Posts</h2>
          <Notification notification={notification} />
          <p>
            {user.name} logged in
            <button onClick={logOutUser}>Logout</button>
          </p>
          <Togglable buttonLabel="new post" ref={postFormRef}>
            <PostForm createPost={createPost} />
          </Togglable>
          <br />
          <PostList posts={posts} likePost={likePost} removePost={removePost} user={user} />
        </>
      )}
    </div>
  )
}

export default App
