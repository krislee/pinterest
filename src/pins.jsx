import React from 'react';

export default function Pins ({ query, handleQuery, pins, loader, loading, error}) {
    return (
        <div>
            <h1 className="pinterest-heading">Pinterest</h1>
            <input type="text" value={query} onChange={handleQuery} placeholder="Search Pins" className="searchBar"></input>
            <div className="pin_container">
                {
                    pins.map((pin, index) => {
                        return (
                            <>
                            <div key={pin.id} className="card">
                                <div className="image" style={{backgroundImage: `url(${pin.images["474x"].url})`}}></div>
                                {pin.title.length > 30 ? <p><b>{pin.title.slice(0, 30)}...</b></p> : <p><b>{pin.title}</b></p>}
                                <p>{pin.pinner.username}</p>
                            </div>
                         
                            </>
                        )
                        
                    })
                }
            </div>
            <div ref={loader}>
                <h1 
                style={{
                    display: loading ? 'block': 'none',
                    margin: 'auto', 
                    width: '75%', 
                    height: '75px',
                    textAlign: 'center'
                }}
                >
                Loading...
                </h1>
            </div>
            {error && <div>{error}</div>}
        </div>

    )
}