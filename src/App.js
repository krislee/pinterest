import './App.css';
// import PinterestPins from './data'

// We need an element reference to the last pin element in order to know which element is the last one
// When reference changes to the last pin when we reach to the bottom scroll, component is not rerendered
import React, { useState, useRef, useEffect, useCallback } from 'react' // useRef is to store a value that persists after each render
import UseIntersect from './useIntersect2'

const apiURL = 'nyc_ttp_pins.json'
const resultsPerPage = 10
function App() {
  
  return (
    <UseIntersect url={apiURL} resultsPerPage={resultsPerPage} />
  )
}

export default App;
