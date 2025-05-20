import addToExcel from './addToExcel.js'
import getCoordinates from './getCoordinates.js'
import locationFromDesc from './locationFromDesc.js'

export default async function scrapeActiveJobData(page, finalURL, fileName) {
  const jobDetailSelector =
    '#container-d04abd4ec7 > div > div.job-detail.aem-GridColumn.aem-GridColumn--default--12 > div > table'

  const jobTable = await page.$(jobDetailSelector)

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
    addToExcel(
      fileName,
      [
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
      ],
      [
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
      ],
    )

    // console.log('Job details saved.')
  } else {
    console.log('No job details table found.')
  }
}
