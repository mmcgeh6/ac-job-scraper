import puppeteer from 'puppeteer'
import fetchLinkFromSheet from './utils/fetchLinkFromSheet.js'
import visitJobLinks from './utils/visitJobLinks.js'

const browser = await puppeteer.launch({ headless: false })

const jobData = await fetchLinkFromSheet('./job_links.xlsx')
// console.log('jobData:', jobData)

await visitJobLinks(jobData, browser)

await browser.close()
