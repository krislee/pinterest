import { useEffect, useState } from 'react'

/*
 * When your scrolling hits the bottom, fetch the next "page" of pins
 */
export default function UseGetPins(apiURL, resultsPerPage, startSliceNumber, grabStartSliceNumber, grabNoMorePins) { 
    // States
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    const [query, setQuery] = useState('')
    const [pins, setPins] = useState([])

    const handleQuery = (event) => {
        setQuery(event.target.value)
    
        // Reset the page back to the beginning
        grabStartSliceNumber(0) 
        // Reset noMore state so infinity scroll can be triggered
        grabNoMorePins(false)
    }

    useEffect(() => {
        setPins([])
    }, [query])

    /*
     * Re-renders component to display new pins everytime the "page" number changes when we scroll to the bottom 
     */
    useEffect(() => {

        const abortController = new AbortController()
        const signal = abortController.signal

        setLoading(true)
        setError(false)

        const getPins = async () => {
            try {
                const pinsResponse = await fetch(`../${apiURL}`, {signal: signal})

                const pinsJSON = await pinsResponse.json()
        
                if (query) {
                    const getQueryResults = pinsJSON.filter((pin) => {
                        const filteredPin = pin['pin_join']['visual_annotation'].filter(word => word.toLowerCase().includes(query.toLowerCase()))
                        if (filteredPin.length) return filteredPin
                        
                    })

                    const nextPins = getQueryResults.slice(startSliceNumber, startSliceNumber+resultsPerPage)
                    
                    setPins(prevPins => {
                        return [...prevPins, ...nextPins]
                    })

                    setLoading(false)
                    if(startSliceNumber >= getQueryResults.length) grabNoMorePins(true)
        
                } else {
                    const nextPins = pinsJSON.slice(startSliceNumber, startSliceNumber+resultsPerPage)

                    setPins(prevPins => {
                        return [...prevPins, ...nextPins]
                    })

                    setLoading(false)
                    if(startSliceNumber >= pinsJSON.length) grabNoMorePins(true)
                    
                }
        
            } catch (error) {
                if (error.name === 'AbortError') return
                setError(true)
            }
        }
        
        getPins()

        return () => {
            console.log("aborting")
            abortController.abort()
        }

    }, [startSliceNumber, query])

    return { loading, query, handleQuery, pins, error }

}