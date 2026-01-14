import { useState, useEffect } from 'react'
import axios from 'axios'

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

const useNation = (name) => {
  const [nation, setNation] = useState(null)

  const getNation = async (name) => {
    const response = await axios.get(`https://studies.cs.helsinki.fi/restcountries/api/name/${name}`)
    return response.data
  }

  useEffect(() => {
    if (name !== '') {
      getNation(name).then(response => {
        setNation({ found: true, data: response })
      }).catch(error => {
        if (error.response.status === 404) {
          setNation({ found: false })
        }
        else {
          console.log(error)
        }
      })
    }
  }, [name])

  return nation
}

const Nation = ({ nation }) => {
  if (!nation) {
    return null
  }

  if (!nation.found) {
    return (
      <div>
        not found...
      </div>
    )
  }

  return (
    <div>
      <h3>{nation.data.name.common} </h3>
      <div>capital {nation.data.capital} </div>
      <div>population {nation.data.population}</div>
      <img src={nation.data.flags.svg} height='100' alt={`flag of ${nation.data.name.common}`} />
    </div>
  )
}

const App = () => {
  const nameInput = useField('text')
  const [name, setName] = useState('')
  const nation = useNation(name)

  const fetch = (e) => {
    e.preventDefault()
    setName(nameInput.value)
  }

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>

      <Nation nation={nation} />
    </div>
  )
}

export default App