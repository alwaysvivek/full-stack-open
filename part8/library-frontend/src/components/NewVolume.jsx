import { useState } from 'react'
import { CombinedGraphQLErrors } from "@apollo/client/errors";
import { useMutation } from '@apollo/client/react'
import { ADD_VOLUME } from '../queries'
import { updateVolumes, updateWriters } from '../cache';
import { NEWBOOKERROR } from '../const';

const NewVolume = ({ show, setError }) => {
  const [title, setTitle] = useState('')
  const [writer, setWriter] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [addVolume] = useMutation(ADD_VOLUME, {
    onError: (error) => {
      let errorMessage = NEWBOOKERROR
      if (error instanceof CombinedGraphQLErrors) {
        errorMessage = error.errors.map(e => e.message).join(', ')
      }
      setError(errorMessage)
    },
    update: (cache, response) => {
      const volumeData = response?.data?.addVolume

      if (!volumeData) {
        return
      }

      updateVolumes(cache, volumeData)
      updateWriters(cache, volumeData)
    }
  })

  if (!show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    addVolume({ variables: { title: title.trim(), writer: writer.trim(), published: parseInt(published), genres } })

    setTitle('')
    setPublished('')
    setWriter('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    if (genre.trim() !== '') {
      setGenres(genres.concat(genre.toLocaleLowerCase()))
    }
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          writer
          <input
            value={writer}
            onChange={({ target }) => setWriter(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create volume</button>
      </form>
    </div>
  )
}

export default NewVolume