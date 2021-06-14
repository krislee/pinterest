// Fetch to get new pins 
const getPins = async (url, signal, grabLoading, grabError, startSliceNumber, resultsPerPage) => {
    grabLoading(true)
    grabError(false)

    try {
        const pinsResponse = await fetch(`${url}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'

            },
            signal: signal
        })

        const pinsJSON = await pinsResponse.json()

        const nextPins = pinsJSON.slice(startSliceNumber, startSliceNumber+resultsPerPage)
        
        return {nextPins: nextPins, allPinsLength: pinsJSON.length}

    } catch (error) {
        if (error.name === 'AbortError') {
            console.log('Request was cancelled')
            return
        }
        grabError(true)
    }

}

export default getPins