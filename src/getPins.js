// import { useEffect, useState } from 'react'

// Fetch to get new pins 
export const getPins = async (url, signal, grabLoading, grabError, startSliceNumber, resultsPerPage, query) => {
    grabLoading(true)
    grabError(false)

    try {
        const pinsResponse = await fetch(`${url}`, {signal})

        const pinsJSON = await pinsResponse.json()

        if (query) {
           
            const getQueryResults = pinsJSON.filter((pin) => {
                const filteredPin = pin['pin_join']['visual_annotation'].filter(word => word.toLowerCase().includes(query.toLowerCase()))
                if (filteredPin.length) return filteredPin
                
            })
            console.log(26, getQueryResults)

            const nextPins = getQueryResults.slice(startSliceNumber, startSliceNumber+resultsPerPage)
            return {nextPins: nextPins, allPinsLength: getQueryResults.length}

        } else {
            const nextPins = pinsJSON.slice(startSliceNumber, startSliceNumber+resultsPerPage)
            return {nextPins: nextPins, allPinsLength: pinsJSON.length}
        }

    } catch (error) {
        if (error.name === 'AbortError') {
            console.log('Request was cancelled')
            return
        }
        grabError(true)
    }

}

