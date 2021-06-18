import { useEffect } from "react"

export default function UseIntersect(loading, noMorePins, resultsPerPage, loader, options, grabStartSliceNumber) {
    /*
    * Change the "page" number when we scroll to the bottom
    */
    useEffect(() => {

        // If we have no more pins (noMore is true) and loading, we do not want to keep calling the Intersection Observer API. 
        if (loading || noMorePins) return 

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
    }, [loading, noMorePins]) // We want loading and noMore in the dependency array because we want to know 
    // if we should still be observing or not if we are loading pins or there is no more pins

}