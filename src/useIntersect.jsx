import { useEffect, useState, useRef, useCallback} from 'react'

export default function UseIntersect() { // When your scrolling hits the bottom, fetch the next page of results

    const [startSliceNumber, setStartSliceNumber] = useState(0)
    const [prevY, setPrevY] = useState(0)

    const [error, setError] = useState(false)
    const [pins, setPins] = useState([])
    const [allPins, setAllPins] = useState([])
    const [hasMore, setHasMore] = useState(true)


    useEffect(() => {
        // Every time we are making a brand new request we do not have an error so set error to false
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
                
                setAllPins(pinsJSON)

                // Get only 10 or less results every time we scroll to the bottom
                setPins(pinsJSON.slice(startSliceNumber, startSliceNumber+10))

                // console.log(40, !(startSliceNumber >= pinsResponse.length))
                setHasMore(!(startSliceNumber >= pinsResponse.length))


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

    }, [])
    
    useEffect(() => {

        const getNextPins =  () => {
            // if(hasMore) {
                console.log(63, startSliceNumber)
                // Get only 10 or less results every time we scroll to the bottom
                const nextPins = allPins.slice(startSliceNumber, startSliceNumber+10)

                setPins(prevPins => {
                    return [...new Set([...prevPins, ...nextPins.map(pin => pin)])]
                })

                // console.log(72, !(startSliceNumber >= allPins.length))
                
                setHasMore(!(startSliceNumber >= allPins.length))
            // }
            // console.log(75, hasMore)
        }
        
        getNextPins()


    }, [startSliceNumber]) // Want to fetch results everytime we do a search or scrolling


    const observer = useRef(null) // null initially - then set a reference to the last book element

    const lastPinElementRef = useCallback(element => {
        const options = {
            root: null,
            // rootMargin: "20px",
            threshold: 1.0
        }

        if (observer.current) observer.current.disconnect()

        observer.current = new IntersectionObserver(entries => {
        
            // Only observing one target element 
            if (entries[0].isIntersecting) {
                console.log('Visible')
                // console.log(99, hasMore)

 
                setStartSliceNumber(prevStartSliceNumber => prevStartSliceNumber + 10)
                console.log(102, startSliceNumber)
                setPrevY(entries[0].boundingClientRect.y)

            }
        }, options)

        if(element) {
            observer.current.observe(element)
        }
    }, [hasMore])

    // return { error, pins, hasMore }

    return (
        <div>
            <h1>Pinterest</h1>
            
            <div>
            {
                pins.map((pin, index) => {
                    if(pins.length === index + 1) {
                        return (
                            <>
                            <div ref={lastPinElementRef} style={{width: '200px', height: '100px', backgroundColor:'yellow'}} key={pin.id}>{pin.title}</div>
                            <p>***************************</p>
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
            }
            <div> {hasMore && 'Loading...'}</div>
            </div>
        
            
        
        </div>
    );

  
}

