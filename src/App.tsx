import './App.css'
import { useState } from 'react'

function App() {
const [ count, setCount ] = useState(0)

  return (
    <>
<div>
  <p>{count}</p>
  <button onClick={() => setCount(count + 1)} >count</button>
</div>
    </>
  

)
}

export default App
