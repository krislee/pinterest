import { useEffect, useState, useRef } from 'react'

export default function UseIntersect({url, resultsPerPage}) { // When your scrolling hits the bottom, fetch the next page of results
    const [startSliceNumber, setStartSliceNumber] = useState(0)

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [pins, setPins] = useState([])

    const [hasMore, setHasMore] = useState(false)


    useEffect(() => {

        setLoading(true) // We are making a request, so loading is true
        setError(false) // Every time we are making a brand new request we do not have an error so set error to false

        const abortController = new AbortController()
        const signal = abortController.signal

        const getPins = async () => {

            try {
                const pinsResponse = await fetch(`${url}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'

                    },
                    signal: signal
                })

                const pinsJSON = await pinsResponse.json()
                console.log(pinsJSON)

                const nextPins = pinsJSON.slice(startSliceNumber, startSliceNumber+resultsPerPage)

                setPins(prevPins => {
                    return [...new Set([...prevPins, ...nextPins])]
                })

                setLoading(false)
                setHasMore(!(startSliceNumber >= pinsJSON.length))

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

    }, [startSliceNumber])


    const loader = useRef(null) // null initially - then a reference to loading element


    const options = {
        root: null,
        rootMargin: "0px",
        threshold: 0
    }
    const handleObserver = entries => {
        // Only observing one target element, the loading element
        if (entries[0].isIntersecting) {
            console.log('Visible')
            setStartSliceNumber(prevStartSliceNumber => prevStartSliceNumber + resultsPerPage)
        }
    }

    useEffect(() => {
        console.log(109, loading, hasMore)
        if (!hasMore) return // If we have reached 

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

    // return { error, pins, hasMore }

    return (
        <div>
            <h1>Pinterest</h1>
            
            <div>
                {
                    pins.map((pin, index) => {
                        
                        return (
                            <>
                            <div style={{width: '200px', height: '100px', backgroundColor:'yellow'}} key={pin.id}>{pin.title}</div>
                            <p>--------------------------</p>
                            </>
                        )
                        
                    })
                }

                <div ref={loader} style={{display: hasMore? 'block': 'none'}}>Loading...</div>
            </div>
        
            
        
        </div>
    );
}