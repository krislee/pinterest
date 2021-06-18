import './App.css';
import React, { useRef } from 'react' 
import UseGetPins from './useGetPins'
import UseIntersect from './useIntersect'
import Pins from './pins'

// CONSTANTS
const apiURL = 'nyc_ttp_pins.json'
const resultsPerPage = 10
const options = {
    root: null,
    rootMargin: "0px",
    threshold: 1.0
}


export default function App() {
    const loader = useRef(null) 

    // Get all or query pins from UseGetPins hook
    const { loading, noMorePins, grabStartSliceNumber, query, handleQuery, pins, error } = UseGetPins(apiURL, resultsPerPage, loader, options)
    // UseIntersect hook for infinity scroll 
    UseIntersect(loading, noMorePins, resultsPerPage, loader, options, grabStartSliceNumber)


    return (
        <Pins query={query} handleQuery={handleQuery} pins={pins} loader={loader} loading={loading} error={error}/>
    )
}
