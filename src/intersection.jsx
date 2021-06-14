import { useEffect, useState, useRef } from 'react'

export default function useIntersect(loader, newSlicingNumber, hasMore) {
    // const loader = useRef(null) // null initially - then a reference to loading element


    const options = {
        root: null,
        rootMargin: "0px",
        threshold: 0
    }
    const handleObserver = entries => {
        // Only observing one target element, the loading element
        if (entries[0].isIntersecting) {
            console.log('Visible')
            newSlicingNumber()
        }
    }

    useEffect(() => {
        // console.log(109, loading, hasMore)
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
}


import './App.css';
import React, { useState, useRef, useEffect, useCallback } from 'react' 
import UseIntersect from './UsePinsInfiniteScroll'

const apiURL = 'nyc_ttp_pins.json'
const resultsPerPage = 10

function App() {
    const loader = useRef(null) // null initially - then a reference to loading element

    const {pins, hasMore} = UseIntersect(apiURL, resultsPerPage, loader)
    
    return (
        <div>
            <h1>Pinterest</h1>
            
            <div>
                {
                    pins.map((pin, index) => {
                        
                        return (
                            <>
                            <div style={{width: '200px', height: '100px', backgroundColor:'yellow'}} key={index}>{pin.title}</div>
                            <p>--------------------------</p>
                            </>
                        )
                        
                    })
                }

                <div ref={loader} style={{display: hasMore? 'block': 'none'}}>Loading...</div>
            </div>
        
            
        
        </div>

    )
}

export default App;
