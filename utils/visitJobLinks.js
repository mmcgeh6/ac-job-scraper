import addToExcel from "./addToExcel.js"
import scrapeActiveJobData from "./scrapeActiveJobData.js"

export default async function visitJobLinks(jobData, browser) {
  for (const url of jobData) {
    if (!url || typeof url !== 'string') {
      console.log('Invalid URL skipped:', url)
      continue
    }

    console.log('\nVisiting:', url) // Debug log

    try {
      const page = await browser.newPage()
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 })

      const title = await page.title()
      console.log(`Visited: Title: ${title}`)

      const finalURL = page.url()
      if (finalURL.includes('job-overview.expired')) {
        console.log('Job Expired')
        await addToExcel(
          './expired_jobs.xlsx',
          ['Expired Job URLs'],
          [url],
        )
        // console.log('Job added to expired_jobs.xlsx')
      } else {
        await scrapeActiveJobData(page, finalURL)
      }

      await page.close()
    } catch (error) {
      console.error(`Failed to visit ${url}: ${error.message}`)
    }
  }
}
