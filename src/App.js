import './App.css';
import React, { useRef } from 'react' 
import UsePinsInfiniteScroll from './UsePinsInfiniteScroll'

const apiURL = 'nyc_ttp_pins.json'
const resultsPerPage = 10

function App() {
    const loader = useRef(null) // null initially - then a reference to loading element

    const {pins, hasMore, error} = UsePinsInfiniteScroll(apiURL, resultsPerPage, loader)
    
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
                {error && <div>{error}</div>}
            </div>
        
            
        
        </div>

    )
}

export default App;
