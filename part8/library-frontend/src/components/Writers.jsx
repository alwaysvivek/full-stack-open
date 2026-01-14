import { useQuery } from '@apollo/client/react'
import { ALL_WRITERS } from '../queries'
import SetBirthyear from './SetBirthyear'

const Writers = ({ show, setError }) => {
  const { loading, data } = useQuery(ALL_WRITERS)

  if (!show) {
    return null
  }

  if (loading) {
    return <div>loading...</div>
  }

  if (!data) {
    return <div>Failed to load writers</div>
  }

  if (data.allWriters.length === 0) {
    return <div>No writers to show</div>
  }

  return (
    <div>
      <h2>writers</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>volumes</th>
          </tr>
          {data.allWriters.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.volumeCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <SetBirthyear allWriters={data.allWriters} setError={setError} />
    </div>
  )
}

export default Writers
