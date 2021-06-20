import React, { useEffect, useState, } from 'react';
import { useParams } from 'react-router-dom';
import './IndividualPin.css'

export default function IndividualPin ({ apiURL, grabStartSliceNumber, grabNoMorePins }) {
    const [loadingPin, setLoadingPin] = useState(true)
    const [errorPin, setErrorPin] = useState(false)

    const [onePin, setOnePin] = useState(null)

    const { pinId } = useParams() 


    useEffect(() => {
        const abortController = new AbortController()
        const signal = abortController.signal

        setLoadingPin(true)
        setErrorPin(false)

        const getOnePin = async () => {
            try {
                const pinsResponse = await fetch(`../${apiURL}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        signal: signal
                    }
                })

                const pinsJSON = await pinsResponse.json()

                setOnePin(pinsJSON.filter(pin => pin.id === pinId))
                setLoadingPin(false)
                
        
            } catch (error) {
                if (error.name === 'AbortError') {
                    console.log("abort error")
                    return
                }
                setErrorPin(true)
            }
        }

        getOnePin()

        return () => {
            console.log("aborting")
            // Reset when going back to another page 
            grabStartSliceNumber(0)
            grabNoMorePins(false)
            abortController.abort()
        }
    },[])
    
    if(loadingPin) {
        return <></>
    } else {
        return (
            <>
            <div className="onePin">
                <img src={onePin[0].images["orig"].url}></img>
                <div className="onePinDetails">
                    <div className="saveButtonContainer">
                        <button className="saveButton" disabled>Save</button>
                    </div>
                    <div className="onePinTitle"><h1>{onePin[0].title}</h1></div>
                    <div className="onePinDescription">
                        {onePin[0].description.length > 100 ? <p>{onePin[0].description.slice(0, 100)}...</p> : <p>{onePin[0].description}</p>}
                    </div>
                    <br></br>
                    <div className="onePinUser">
                        <p><b>{onePin[0].pinner.username}</b></p>
                        <button className="followButton" disabled>Follow</button>
                    </div>
                </div>
            </div>

            {errorPin && <div>{errorPin}</div>}
            </>
        )
    }
}