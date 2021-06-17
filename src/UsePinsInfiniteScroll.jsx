import { useEffect, useState } from 'react'

/*
 * When your scrolling hits the bottom, fetch the next "page" of results
 */
export default function UsePinsInfiniteScroll(url, resultsPerPage, loader, options, startSliceNumber, grabStartSliceNumber, noMore, grabNoMore, query) { 
    // States
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [pins, setPins] = useState([])

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
                const pinsResponse = await fetch(`${url}`, {signal: signal})
        
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
                    if(startSliceNumber >= getQueryResults.length) grabNoMore(true)
        
                } else {
                    const nextPins = pinsJSON.slice(startSliceNumber, startSliceNumber+resultsPerPage)

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

    /*
     * Change the "page" number when we scroll to the bottom
     */
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
    }, [loading, noMore]) // We want loading and noMore in the dependency array because we want to know 
    // if we should still be observing or not if we are loading pins or there is no more pins


    return {pins, error, loading}
}