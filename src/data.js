import React, { useEffect, useState } from 'react';

export default function PinterestPins() {

    const [pins, setPins] = useState([])

    useEffect(() => {
        const getPins = async () => {
            const pinsResponse = await fetch('nyc_ttp_pins.json', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'

                }
            })

            const pinsJSON = await pinsResponse.json()
            console.log(pinsJSON)
            setPins(pinsJSON)
        }

        getPins()
    }, [])

    return (
        <>
        <input type="text"></input>
        <div>{
            pins.map((pin) => {
                return <img key={pin.id} width="236px" height="287px" src={pin.images["474x"].url}/>
            })
        }</div>
        </>
    )
}