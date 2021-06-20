import './App.css';
import React, { useState } from 'react' 
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Pins from './Pins'
import IndividualPin from './IndividualPin';

// CONSTANTS
const apiURL = 'nyc_ttp_pins.json'
const resultsPerPage = 10
const options = {
    root: null,
    rootMargin: "0px",
    threshold: 1.0
}


export default function App() {
    const [startSliceNumber, setStartSliceNumber] = useState(0)
    const [noMorePins, setNoMorePins] = useState(false)

    const grabStartSliceNumber = (startSliceNumber) => setStartSliceNumber(startSliceNumber)
    const grabNoMorePins = (noMorePins) => setNoMorePins(noMorePins)

    return (
        <BrowserRouter>
            
            <Switch>
              
                <Route exact path="/pin/:pinId">
                    <IndividualPin apiURL={apiURL} grabStartSliceNumber={grabStartSliceNumber} grabNoMorePins={grabNoMorePins} />
                </Route>
                <Route exact path="/">
                <Pins apiURL={apiURL} resultsPerPage={resultsPerPage} options={options} startSliceNumber={startSliceNumber} grabStartSliceNumber={grabStartSliceNumber} noMorePins={noMorePins} grabNoMorePins={grabNoMorePins} />
                </Route>
            </Switch>
        </BrowserRouter>
       
    )
}
