import './App.css';
import React, { useRef } from 'react' 
import UsePinsInfiniteScroll from './UsePinsInfiniteScroll'

const apiURL = 'nyc_ttp_pins.json'
const resultsPerPage = 10

function App() {
    const loader = useRef(null) // null initially - then a reference to loading element

    const {pins, hasMore, error} = UsePinsInfiniteScroll(apiURL, resultsPerPage, loader)
    
    // style={{width: '200px', height: '100px', backgroundColor:'yellow'}}
    return (
        <div>
            <h1>Pinterest</h1>
            
            <div className="pin_container">
                {
                    pins.map((pin, index) => {
                        
                        return (
                            <>
                            <div key={pin.id} className="card">{pin.title}</div>
                            </>
                        )
                        
                    })
                }

                <div ref={loader} style={{display: hasMore? 'block': 'none'}}>Loading...</div>
            </div>
            
            {error && <div>{error}</div>}
            
        
        </div>

    )
}

export default App;
