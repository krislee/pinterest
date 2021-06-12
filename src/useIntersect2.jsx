import { useEffect, useState, useRef } from 'react'

export default function UseIntersect() { // When your scrolling hits the bottom, fetch the next page of results
    const [startSliceNumber, setStartSliceNumber] = useState(0)
    const [endSliceNumber, setEndSliceNumber] = useState(10)

    const [error, setError] = useState(false)
    const [pins, setPins] = useState([])
    const [allPins, setAllPins] = useState([])
    const [hasMore, setHasMore] = useState(false)


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
                // Get only 100 or less results every time we scroll to the bottom
                setPins(pinsJSON.slice(startSliceNumber, endSliceNumber))
                // console.log(40, !(startSliceNumber >= pinsResponse.length))
                // setHasMore(!(startSliceNumber >= pinsResponse.length))

             
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

            console.log(64, startSliceNumber)
            // Get only 10 or less results every time we scroll to the bottom
            const nextPins = allPins.slice(startSliceNumber, startSliceNumber+10)

            setPins(prevPins => {
                return [...new Set([...prevPins, ...nextPins.map(pin => pin)])]
            })

            // console.log(72, !(startSliceNumber >= allPins.length))
            
            setHasMore(!(startSliceNumber >= allPins.length))
            
        }
        
        getNextPins()

    }, [startSliceNumber]) // Want to fetch results everytime we do a search or scrolling


    const loader = useRef(null) // null initially - then set a reference to the last book element

    useEffect(() => {
        const options = {
            root: null,
            // rootMargin: "20px",
            threshold: 0
        }

        // if (loader.current) loader.current.disconnect()

        const observer = new IntersectionObserver(entries => {
        // console.log(33, hasMore)
        // console.log(34, entries[0].isIntersecting)
        
            // Only observing one target element 
            if (entries[0].isIntersecting) {
                console.log('Visible')
                setStartSliceNumber(prevStartSliceNumber => prevStartSliceNumber + 10)
                // setEndSliceNumber(prevEndSliceNumber => prevEndSliceNumber + 10)

            }
        }, options)

        if(loader.current) {
            observer.observe(loader.current)
        }

    }, [])

    // return { error, pins, hasMore }
    const loadingTextCSS = { display: hasMore ? "block" : "none" };
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
            <div ref={loader}>
                {/* <span style={loadingTextCSS}>Loading...</span> */}
                Loading...
            </div>
            </div>
        
            
        
        </div>
    );
}