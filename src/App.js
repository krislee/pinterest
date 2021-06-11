import logo from './logo.svg';
import './App.css';
// import PinterestPins from './data'
import React, { useState } from 'react'
import useIntersect from './useIntersect'

function App() {
  const [query, setQuery] = useState('')
  const [startSliceNumber, setStartSliceNumber] = useState(0)
  const [endSliceNumber, setEndSliceNumber] = useState(100)

  useIntersect(query, startSliceNumber, endSliceNumber)

  const handleQuery = (event) => {
    setQuery(event.target.value)

    // Reset the page back to the beginning
    setStartSliceNumber(0) 
    setEndSliceNumber(100)
  }

  return (
    <div>
    <h1>Pinterest</h1>
    <input type="text" onChange={handleQuery}></input>
    {/* <PinterestPins/> */}

    </div>
  );
}

export default App;
