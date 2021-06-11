import { useEffect, useState } from 'react'

export default function useIntersect(query, startSliceNumber, endSliceNumber) { // When your scrolling hits the bottom, fetch the next page of results
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

            if (query) {
                const getQueryResults = pinsJSON.filter((pin) => {
                    filteredPin = pin['pin_join']['visual_annotation'].filter(word => word.includes(query))
                    if (filteredPin.length > 0) {
                        return filteredPin
                    }
                })
                setPins(getQueryResults.slice(startSliceNumber, endSliceNumber))
            } else {
                // Get only 100 or less results every time we scroll to the bottom
                setPins(pinsJSON.slice(startSliceNumber, endSliceNumber))
            }
            

           
        }

        getPins()
    }, [query, pageNumber]) // Want to fetch results everytime we do a search or scrolling

    return null
}
