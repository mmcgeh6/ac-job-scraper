import puppeteer from 'puppeteer'
import fs from 'fs'
import fetchLinkFromSheet from './utils/fetchLinkFromSheet.js'
import visitJobLinks from './utils/visitJobLinks.js'
import scrapeJobsLinks from './utils/scrapeJobsLinks.js'
import dotenv from 'dotenv'
import cron from 'node-cron'

dotenv.config({
  path: './.env',
})

async function scrapeJobs() {
  const browser = await puppeteer.launch({ headless: false })

  const startingLink =
    'https://www.atlascopcogroup.com/en/careers/jobs/job-overview?GROUP_EN_dateDesc%5BrefinementList%5D%5Bdata.country%5D%5B0%5D=United%20States'

  const filename = await scrapeJobsLinks(startingLink, browser)

  const jobData = await fetchLinkFromSheet(filename)
  // console.log('jobData:', jobData)

  await visitJobLinks(jobData, browser)

  fs.unlink(filename, (err) => {
    if (err) {
      console.error(`Error deleting file: ${err.message}`)
    } else {
      // console.log('File deleted successfully!')
    }
  })

  await browser.close()
}

cron.schedule('59 23 * * *', () => {
  ;(async () => {
    try {
      await scrapeJobs()
      console.log(`Cron job ran successfully at ${new Date().toLocaleString()}`)
    } catch (error) {
      console.log('Follwoing error occurred while running cron job:', error)
    }
  })()
})