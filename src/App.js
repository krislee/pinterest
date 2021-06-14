import './App.css';
import React, { useRef, useState } from 'react' 
import UsePinsInfiniteScroll from './UsePinsInfiniteScroll'

const apiURL = 'nyc_ttp_pins.json'
const resultsPerPage = 10
const options = {
    root: null,
    rootMargin: "0px",
    threshold: 1.0
}



function App() {
    const loader = useRef(null) // null initially - then a reference to loading element
    const [query, setQuery] = useState('')
    const [startSliceNumber, setStartSliceNumber] = useState(0)

    const grabStartSliceNumber = (startSliceNumber) => setStartSliceNumber(startSliceNumber)

    const {pins, error, loading} = UsePinsInfiniteScroll(apiURL,resultsPerPage, loader, options, query, startSliceNumber, grabStartSliceNumber)

    const handleQuery = (event) => {
        setQuery(event.target.value)
    
        // Reset the page back to the beginning
        setStartSliceNumber(0) 
    }
    
 
    return (
        <div>
            <h1>Pinterest</h1>
            <input type="text" value={query} onChange={handleQuery} className="searchBar"></input>

            <div className="pin_container">
                {
                    pins.map((pin, index) => {
                        
                        return (
                            <>
                            <div key={index} className="card">
                                {/* <div className="image" style={{backgroundImage: `url(${pin.images["474x"].url})`}}></div> */}
                            
                                {pin.title.length > 30 ? <p><b>{pin.title.slice(0, 30)}...</b></p> : <p><b>{pin.title}</b></p>}
                                <p>{pin.pinner.username}</p>
                            </div>
                            </>
                        )
                        
                    })
                }

                {/* <h1 ref={loader} style={{display: hasMore? 'block': 'none'}}>Loading...</h1> */}
            </div>
            <div ref={loader}>
                <h1 style={{
                    display: loading ? 'block': 'none', 
                    backgroundColor: 'blue', 
                    margin: 'auto', 
                    width: '75%', 
                    height: '100px',
                    textAlign: 'center'
                }}>
                Loading...
                </h1>
            </div>
            {error && <div>{error}</div>}
            
        
        </div>

    )
}

export default App;
