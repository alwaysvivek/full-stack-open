import PropTypes from 'prop-types'
import Post from './Post'

const PostList = ({ posts, likePost, removePost, user }) => {
  return (
    <div>
      {posts.map((post) => (
        <Post key={post.id} post={post} likePost={likePost} removePost={removePost} user={user} />
      ))}
    </div>
  )
}

PostList.propTypes = {
  posts: PropTypes.array.isRequired,
  likePost: PropTypes.func.isRequired,
  removePost: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
}

export default BlogList
