import addToExcel from './addToExcel.js'
import deleteJobsFromWebhook from './deleteJobsFromWebhook.js'
import extractStateFromCity from './extractStateFromCity.js'
import getCoordinates from './getCoordinates.js'
import locationFromDesc from './locationFromDesc.js'
import upadteJobsOnWebhook from './upadteJobsOnWebhook.js'

export default async function scrapeActiveJobData(page, finalURL, fileName) {
  const jobDetailSelector =
    '#container-d04abd4ec7 > div > div.job-detail.aem-GridColumn.aem-GridColumn--default--12 > div > table'


    const jobTable = await page.$(jobDetailSelector)
    const jobTitle = await page.title()
    // console.log('Job Title:', jobTitle)

    if (jobTable) {
      const jobDetails = await page.evaluate((selector) => {
        const rows = Array.from(
          document.querySelector(selector).querySelectorAll('tr'),
        )
        const detailMap = {}
        rows.forEach((row) => {
          const cells = row.querySelectorAll('td')
          if (cells.length === 2) {
            const key = cells[0].innerText.trim().replace(':', '')
            const value = cells[1].innerText.trim()
            detailMap[key] = value
          }
        })
        return detailMap
      }, jobDetailSelector)

      if (jobDetails['Country'] !== 'United States') {
        return
      }

      // Set state from city if not already defined
      if (jobDetails['City'] !== undefined && !jobDetails['State']) {
        const inferredState = extractStateFromCity(jobDetails['City'], jobTitle)
        // console.log('Inferred state:', inferredState)
        if (inferredState) {
          jobDetails['State'] = inferredState
        }
      }

      const { latitude, longitude } =
        jobDetails['City'] === undefined
          ? { latitude: '', longitude: '' }
          : await getCoordinates(
              jobDetails['City'] || '',
              jobDetails['State'] || '',
              jobDetails['Country'] || '',
            )

      let jobLocation
      if (jobDetails['City'] === undefined) {
        jobLocation = await locationFromDesc(page)
      }

      const headers = [
        'URL',
        'Functional area',
        'Country',
        'State',
        'City',
        'On-site/remote',
        'Brand',
        'Company Name',
        'Date of Posting',
        'Last day to apply',
        'Latitude',
        'Longitude',
        'Misc',
      ]

      const data = [
        finalURL,
        jobDetails['Functional area'] || '',
        jobDetails['Country'] || '',
        jobDetails['State'] || '',
        jobDetails['City'] || '',
        jobDetails['On-site/remote'] || '',
        jobDetails['Brand'] || '',
        jobDetails['Company Name'] || '',
        jobDetails['Date of Posting'] || '',
        jobDetails['Last day to apply'] || '',
        latitude,
        longitude,
        jobLocation || '',
      ]

      await deleteJobsFromWebhook(headers, data)

      await upadteJobsOnWebhook(headers, data)

      // console.log('Job details saved.')
    } else {
      console.log('No job details table found.')
    }
}
