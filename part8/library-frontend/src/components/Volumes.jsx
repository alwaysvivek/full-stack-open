import { useQuery } from '@apollo/client/react'
import { ALL_VOLUMES } from '../queries'

const Volumes = ({ show, selectedGenre, handleGenreChange }) => {
  const allVolumeResult = useQuery(ALL_VOLUMES);
  const genreVolumeResult = useQuery(ALL_VOLUMES, {
    variables: { genre: selectedGenre }
  });

  if (!show) {
    return null
  }

  if (allVolumeResult.loading || genreVolumeResult.loading) {
    return <div>loading...</div>
  }

  if (!allVolumeResult.data) {
    return <div>Failed to load volumes</div>
  }

  const genres = [...new Set(allVolumeResult.data.allVolumes.flatMap(volume => volume.genres))].sort();
  const volumes = selectedGenre ? genreVolumeResult.data.allVolumes : allVolumeResult.data.allVolumes;

  if (volumes.length === 0) {
    return <div>No volumes to show</div>
  }


  return (
    <div>
      <h2>volumes</h2>

      {selectedGenre && <p>in genre <b>{selectedGenre}</b></p>}

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>writer</th>
            <th>published</th>
          </tr>
          {volumes.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.writer.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />

      {genres.length > 0 && (
        <div>
          <label>
            Select genre:
            <select value={selectedGenre} onChange={handleGenreChange}>
              <option value={""}>all</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}
    </div>
  )
}

export default Volumes
