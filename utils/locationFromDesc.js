export default async function locationFromDesc(page) {
  try {
    const titleSelector =
      '#container-b68bd68b63 > div > div.jobs-banner.aem-GridColumn.aem-GridColumn--default--12 > div > div > h2'

    await page.waitForSelector(titleSelector, { timeout: 5000 })

    const title = await page.$eval(titleSelector, (el) => el.innerText)

    // Improved city/state extractor function
    function extractCityState(title) {
      // Split by dash or em dash
      const chunks = title.split(/[-—]/).map((s) => s.trim())

      const cityStateRegex = /^([a-zA-Z\s]+),\s*([A-Z]{2})$/

      // Check from the end to find valid city, state with a comma
      for (let i = chunks.length - 1; i >= 0; i--) {
        const match = chunks[i].match(cityStateRegex)
        if (match) {
          return { city: match[1], state: match[2] }
        }
      }
      return null
    }

    const cityState = extractCityState(title)
    if (cityState) {
      // console.log(`${cityState.city}, ${cityState.state}`)
      return `${cityState.city}, ${cityState.state}`
    } else {
      // console.log('No city, state found in title')
    }

    // Extract city/location from job description
    const cityOrLocation = await page.evaluate(() => {
      const container = document.querySelector(
        '#container-8dc29864b3 > div > div > div > div.job-content__description',
      )
      if (!container) return null

      const elements = [...container.querySelectorAll('*')].filter((el) =>
        /city|location/i.test(el.textContent.trim()),
      )

      for (const el of elements) {
        const nextElem = el.nextElementSibling
        if (nextElem && nextElem.textContent.trim()) {
          return nextElem.textContent.trim()
        }
      }
      return null
    })

    console.log('City or Location:', cityOrLocation)
    return cityOrLocation
  } catch (error) {
    console.error('Error in locationFromDesc:', error.message)
  }
}
