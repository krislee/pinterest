import { useEffect, useState } from 'react'
import { getPins } from './getPins'

export default function UsePinsInfiniteScroll(url, resultsPerPage, loader, options, startSliceNumber, grabStartSliceNumber, noMore, grabNoMore, query) { // When your scrolling hits the bottom, fetch the next page of results
    // States
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    // const [startSliceNumber, setStartSliceNumber] = useState(0)
    const [pins, setPins] = useState([])

    useEffect(() => {
        setPins([])
    }, [query])

    /*
     * Re-renders component to display new pins everytime startSliceNumber, which acts as the page number, changes when we scroll to the bottom 
     */
    useEffect(() => {

        const abortController = new AbortController()
        const signal = abortController.signal

        setLoading(true)
        setError(false)

        const getPins = async () => {
            try {
                console.log(31)
                const pinsResponse = await fetch(`${url}`, {signal: signal})
        
                const pinsJSON = await pinsResponse.json()
        
                if (query) {
                   
                    const getQueryResults = pinsJSON.filter((pin) => {
                        const filteredPin = pin['pin_join']['visual_annotation'].filter(word => word.toLowerCase().includes(query.toLowerCase()))
                        if (filteredPin.length) return filteredPin
                        
                    })
                    console.log(43, startSliceNumber, getQueryResults, getQueryResults.length)
        
                    const nextPins = getQueryResults.slice(startSliceNumber, startSliceNumber+resultsPerPage)
                    
                    console.log(47, "pins")
                    setPins(prevPins => {
                        return [...prevPins, ...nextPins]
                    })

                    setLoading(false)
                    if(startSliceNumber >= getQueryResults.length) grabNoMore(true)
        
                } else {
                    
                    const nextPins = pinsJSON.slice(startSliceNumber, startSliceNumber+resultsPerPage)
                    console.log(58, startSliceNumber, nextPins)

                    setPins(prevPins => {
                        return [...prevPins, ...nextPins]
                    })

                    setLoading(false)
                    if(startSliceNumber >= pinsJSON.length) grabNoMore(true)
                    
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

        return () => {
            console.log("aborting")
            abortController.abort()
        }

    }, [startSliceNumber, query])


    useEffect(() => {
        console.log(89, loading, noMore)
        // If we have no more pins (noMore is true) and loading, we do not want to keep calling the Intersection Observer API. 
        if (loading || noMore) return 

        const observer = new IntersectionObserver(entries => {
            // Only observing one target element, the loading element
            if (entries[0].isIntersecting) {
                grabStartSliceNumber(prevStartSliceNumber => prevStartSliceNumber + resultsPerPage)
            }
        }, options)

        if(loader.current) {
            observer.observe(loader.current)
        }

        return () => observer.unobserve(loader.current)
    }, [loading, noMore]) // startSliceNumber as dependency does not allow for infinite scrolling


    return {pins, error, loading}
}