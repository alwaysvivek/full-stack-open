import { useState } from 'react'
import PropTypes from 'prop-types'

const Post = ({ post, likePost, removePost, user }) => {
  const [visible, setVisible] = useState(false)

  const postStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleLike = () => {
    likePost(post)
    // console.log('liked')
  }

  const handleRemove = () => {
    if (window.confirm(`Remove post ${post.title} by ${post.author}`)) {
      removePost(post)
    }
  }

  return (
    <div style={postStyle} className="post">
      <div className="postTitle">
        {post.title} {post.author}
        <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      </div>
      {visible && (
        <div className="postContent">
          <div>{post.url}</div>
          <div>
            likes {post.likes} <button onClick={handleLike}>like</button>
          </div>
          <div>{post.user.name}</div>
          {user.username === post.user.username && (
            <button onClick={handleRemove}>remove</button>
          )}
        </div>
      )}
    </div>
  )
}

Post.propTypes = {
  post: PropTypes.object.isRequired,
  likePost: PropTypes.func.isRequired,
  removePost: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
}

export default Blog
