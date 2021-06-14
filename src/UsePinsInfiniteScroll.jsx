import { useEffect, useState } from 'react'
import getPins from './getPins'

// Intersection Observer Options
const options = {
    root: null,
    rootMargin: "0px",
    threshold: 0
}

export default function UsePinsInfiniteScroll(url, resultsPerPage, loader) { // When your scrolling hits the bottom, fetch the next page of results
    // States
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    const [startSliceNumber, setStartSliceNumber] = useState(0)
    const [pins, setPins] = useState([])

    const [hasMore, setHasMore] = useState(false)

    /*
     * Re-renders component to display new pins everytime startSliceNumber, which acts as the page number, changes when we scroll to the bottom 
     */
    useEffect(async() => {

        const grabLoading = (loading) => setLoading(loading)
        const grabError = (error) => setError(error)

        const abortController = new AbortController()
        const signal = abortController.signal

        const pinterestPins = await getPins(url, signal, grabLoading, grabError, startSliceNumber, resultsPerPage)


        if(pinterestPins.nextPins) {
            setPins(prevPins => {
                // return [...new Set([...prevPins, ...pinterestPins.nextPins])]
                return [...prevPins, ...pinterestPins.nextPins]
            })

            setLoading(false)
            setHasMore(!(startSliceNumber >= pinterestPins.allPinsLength))
        }

        return () => abortController.abort()

    }, [startSliceNumber])


    useEffect(() => {
        if (!hasMore) return // If we have no more pins, we do not want to keep calling the Intersection Observer API

        const observer = new IntersectionObserver(handleObserver, options)

        if(loader.current) {
            observer.observe(loader.current)
        }

        return () => {
            if(loader.current) {
                observer.unobserve(loader.current)
            }
        }
    }, [hasMore]) // startSliceNumber as dependency does not allow for infinite scrolling


    const handleObserver = entries => {
        // Only observing one target element, the loading element
        if (entries[0].isIntersecting) {
            setStartSliceNumber(prevStartSliceNumber => prevStartSliceNumber + resultsPerPage)
        }
    }

    return {pins, hasMore, error}
}