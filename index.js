import puppeteer from 'puppeteer'
import fetchLinkFromSheet from './utils/fetchLinkFromSheet.js'
import visitJobLinks from './utils/visitJobLinks.js'
import scrapeJobsLinks from './utils/scrapeJobsLinks.js'

const browser = await puppeteer.launch({ headless: false })

const startingLink =
  'https://www.atlascopcogroup.com/en/careers/jobs/job-overview?GROUP_EN_dateDesc%5BrefinementList%5D%5Bdata.country%5D%5B0%5D=United%20States'

const filename = await scrapeJobsLinks(startingLink, browser)

const jobData = await fetchLinkFromSheet(filename)
// console.log('jobData:', jobData)

await visitJobLinks(jobData, browser)

await browser.close()
