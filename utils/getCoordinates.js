import axios from 'axios'

const GOOGLE_API_KEY = '' // TODO: Replace with your Google Maps API key

export default async function getCoordinates(city, state, country) {
  const address = `${city}, ${state}, ${country}`
  const url = `https://maps.googleapis.com/maps/api/geocode/json`

  try {
    const response = await axios.get(url, {
      params: {
        address,
        key: GOOGLE_API_KEY,
      },
    })

    const result = response.data.results[0]
    if (result) {
      const { lat, lng } = result.geometry.location
      return { latitude: lat, longitude: lng }
    } else {
      console.warn(`No coordinates found for: ${address}`)
      return { latitude: '', longitude: '' }
    }
  } catch (error) {
    console.error(`Google Maps API error: ${error.message}`)
    return { latitude: '', longitude: '' }
  }
}
