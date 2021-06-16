import { useEffect, useState } from 'react'
import { getPins } from './getPins'

export default function UsePinsInfiniteScroll(url, resultsPerPage, loader, options, query, startSliceNumber, grabStartSliceNumber) { // When your scrolling hits the bottom, fetch the next page of results
    // States
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    // const [startSliceNumber, setStartSliceNumber] = useState(0)
    const [pins, setPins] = useState([])

    const [hasMore, setHasMore] = useState(false)

    useEffect(() => {
        setPins([])
    }, [query])

    /*
     * Re-renders component to display new pins everytime startSliceNumber, which acts as the page number, changes when we scroll to the bottom 
     */
    useEffect(async() => {

        const grabLoading = (loading) => setLoading(loading)
        const grabError = (error) => setError(error)

        const abortController = new AbortController()
        const signal = abortController.signal

        const pinterestPins = await getPins(url, signal, grabLoading, grabError, startSliceNumber, resultsPerPage, query)


        if(pinterestPins.nextPins) {
            console.log(33, "pins")
            setPins(prevPins => {
                // return [...new Set([...prevPins, ...pinterestPins.nextPins])]
                return [...prevPins, ...pinterestPins.nextPins]
            })

            setLoading(false)
            setHasMore(!(startSliceNumber >= pinterestPins.allPinsLength))
        }

        return () => {
            console.log("aborting")
            abortController.abort()
        }

    }, [startSliceNumber, query])


    useEffect(() => {
        console.log(52, loading, hasMore)
        if (loading || !hasMore) return // If we have no more pins (hasMore is false), we do not want to keep calling the Intersection Observer API. 

        const observer = new IntersectionObserver(handleObserver, options)

        if(loader.current) {
            console.log(58, loader.current)
            observer.observe(loader.current)
        }

        return () => {
            console.log(63)
            if(loader.current) {
                observer.unobserve(loader.current)
            }
        }
    }, [hasMore]) // startSliceNumber as dependency does not allow for infinite scrolling


    const handleObserver = entries => {
        // Only observing one target element, the loading element
        if (entries[0].isIntersecting) {
            grabStartSliceNumber(prevStartSliceNumber => prevStartSliceNumber + resultsPerPage)
            console.log(72, "Visible")
        }
    }

    return {pins, hasMore, error, loading}
}