import { useEffect, useState } from 'react'

export default function useIntersect(query, startSliceNumber, endSliceNumber) { // When your scrolling hits the bottom, fetch the next page of results
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [pins, setPins] = useState([])
    const [allPins, setAllPins] = useState([])
    const [allQueryPins, setAllQueryPins] = useState([])
    const [hasMore, setHasMore] = useState(false)

    useEffect(() => {
        setPins([])
    }, [query])

    useEffect(() => {
        // Every time we are making a brand new request we are loading so set loading to true, 
        // and we do not have an error for a new request do set error to false
        setLoading(true)
        setError(false)

        const abortController = new AbortController()
        const signal = abortController.signal

        const getPins = async () => {

            try {
                const pinsResponse = await fetch('nyc_ttp_pins.json', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'

                    },
                    signal: signal
                })

                const pinsJSON = await pinsResponse.json()
                console.log(pinsJSON)

                if (query) {
                    const getQueryResults = pinsJSON.filter((pin) => {
                        const filteredPin = pin['pin_join']['visual_annotation'].filter(word => word.includes(query))
                        if (filteredPin.length > 0) {
                            return filteredPin
                        } 
                    })
                    console.log(47, getQueryResults)

                    setAllQueryPins(getQueryResults) // Hold all the results

                    setPins(getQueryResults.slice(startSliceNumber, endSliceNumber))
                    // setPins(prevPins => {
                    //     return [...new Set([...prevPins, ...getQueryResults.map(pin => pin)])]
                    // })
                    setHasMore(!(startSliceNumber >= getQueryResults.length))
                    setLoading(false)
                } else {
                    setAllPins(pinsJSON)
                    // Get only 100 or less results every time we scroll to the bottom
                    setPins(pinsJSON.slice(startSliceNumber, endSliceNumber))
                    // const somePins = pinsJSON.slice(startSliceNumber, endSliceNumber)
                    // setPins(prevPins => {
                    //     return [...new Set([...prevPins, ...somePins.map(pin => pin)])]
                    // })
                    console.log(64, !(startSliceNumber >= pinsResponse.length))
                    setHasMore(!(startSliceNumber >= pinsResponse.length))
                    setLoading(false)
                }
            } catch (error) {
                if (error.name === 'AbortError') {
                    console.log('Request was cancelled')
                    return
                }
                setError(true)
            }
           
        }
        
        getPins()

        return () => abortController.abort()

    }, [query])
    
    useEffect(() => {
        // Every time we are making a brand new request we are loading so set loading to true, 
        // and we do not have an error for a new request do set error to false
        setLoading(false)
        setError(false)

        const getNextPins =  (query, startSliceNumber, endSliceNumber) => {

            if (query) {
                console.log(94, query)
                const nextQueryPins = allQueryPins.slice(startSliceNumber, endSliceNumber)

                setPins(prevPins => {
                    return [...new Set([...prevPins, ...nextQueryPins.map(pin => pin)])]
                })
                setHasMore(!(startSliceNumber >= allQueryPins.length))
                // setLoading(false)
            } else {
                console.log(102, startSliceNumber, endSliceNumber)
                // Get only 10 or less results every time we scroll to the bottom
                const nextPins = allPins.slice(startSliceNumber, endSliceNumber)

                setPins(prevPins => {
                    return [...new Set([...prevPins, ...nextPins.map(pin => pin)])]
                })

                console.log(112, !(startSliceNumber >= allPins.length))
                
                setHasMore(!(startSliceNumber >= allPins.length))
                // setLoading(false)
            }
        }
        
        getNextPins()

    }, [query, startSliceNumber]) // Want to fetch results everytime we do a search or scrolling

    return { loading, error, pins, hasMore }
}

