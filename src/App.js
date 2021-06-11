import './App.css';
// import PinterestPins from './data'

// We need an element reference to the last pin element in order to know which element is the last one
// When reference changes to the last pin when we reach to the bottom scroll, component is not rerendered
import React, { useState, useRef, useCallback } from 'react' // useRef is to store a value that persists after each render
import useIntersect from './useIntersect'

function App() {
  const [query, setQuery] = useState('')
  const [startSliceNumber, setStartSliceNumber] = useState(0)
  const [endSliceNumber, setEndSliceNumber] = useState(10)

  const {loading, error, pins, hasMore } = useIntersect(query, startSliceNumber, endSliceNumber)

  const observer = useRef(null) // null initially - then set a reference to the last book element

  const lastPinElementRef = useCallback(node => {
    console.log(19, loading)
    if(loading) return // If we are loading we do not want to trigger infinite scrolling

    const options = {
      root: null,
      // rootMargin: "20px",
      threshold: 0
    }

    // Disconnect the reference from the previous last pin 
    if (observer.current) observer.current.disconnect()

    observer.current = new IntersectionObserver(entries => {
      // Only observing one target element 
      console.log(33, hasMore)
      console.log(34, entries[0].isIntersecting)
      if (entries[0].isIntersecting && hasMore) {
        console.log('Visible')
        setStartSliceNumber(prevStartSliceNumber => prevStartSliceNumber + 10)
        console.log(38, startSliceNumber)
        setEndSliceNumber(prevEndSliceNumber => prevEndSliceNumber + 10)
        console.log(40, endSliceNumber)
      }
    }, options)

    // If we have a last element, we want to reference it and observe that element 
    if (node) observer.current.observe(node)

  }, [loading, hasMore])



  const handleQuery = (event) => {
    setQuery(event.target.value) // Each letter a user types in the input box will update the query, which will call useIntersect 

    // Reset the page back to the beginning
    setStartSliceNumber(0) 
    setEndSliceNumber(10)
  }
// 19 false, 64 true, 33 true, 34 false  
// 33 true 34 true Visible 102 undefined undefined 112 true 19 false 19 false 33 true 34 false
// 33 true 34 true Visible 102 undefined undefined 112 true

  return (
    <div>
      <h1>Pinterest</h1>
      <input type="text" value={query} onChange={handleQuery}></input>
      {/* <PinterestPins/> */}
      
      <div>{
          pins.map((pin, index) => {
            if (pins.length === index + 1) { // This means we are at our last pin
              return (
                <>
                <div style={{width: '200px', height: '100px', backgroundColor:'yellow'}} ref={lastPinElementRef} key={pin.id}>{pin.title}</div>
                <p>**************************</p>
                </>
              )
            } else {
              return (
                <>
                <div style={{width: '200px', height: '100px', backgroundColor:'yellow'}} key={pin.id}>{pin.title}</div>
                <p>--------------------------</p>
                </>
              )
            }
          })
      }</div>

      <div>{loading && 'Loading...'}</div>
      <div>{error && 'Error'}</div>

    </div>
  );
}

export default App;
