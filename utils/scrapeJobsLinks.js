import addJobLinksToExcel from './addJobLinksToExcel.js'

export default async function scrapeJobsLinks(startingLink, browser) {
  try {
    const page = await browser.newPage()

    await page.goto(startingLink)

    const olSelector =
      '#container-7c305579d2 > div > div.filter-list.aem-GridColumn.aem-GridColumn--default--12 > div > div > div.ds_ais-Container.ds_ais-Container--filter-list > div > div > div.ds_ais-SearchResults.search-results-custom-class > div.ds_ais-Hits.hits-custom-class > ol'
    const nextBtnSelector =
      '#container-7c305579d2 > div > div.filter-list.aem-GridColumn.aem-GridColumn--default--12 > div > div > div.ds_ais-Container.ds_ais-Container--filter-list > div > div > div.ds_ais-SearchResults.search-results-custom-class > div.ais-Pagination.ds_ais-Pagination.pagination-custom-class > ul > li.ais-Pagination-item.ais-Pagination-item--nextPage > a'

    const nextDisabledSelector =
      '#container-7c305579d2 > div > div.filter-list.aem-GridColumn.aem-GridColumn--default--12 > div > div > div.ds_ais-Container.ds_ais-Container--filter-list > div > div > div.ds_ais-SearchResults.search-results-custom-class > div.ais-Pagination.ds_ais-Pagination.pagination-custom-class > ul > li.ais-Pagination-item.ais-Pagination-item--disabled.ais-Pagination-item--nextPage'

    const readableDate = new Date().toLocaleString().replace(/[/:, ]+/g, '-')
    const filename = `./job_links_${readableDate}.xlsx`

    while (true) {
      try {
        await page.waitForSelector(olSelector, { timeout: 30000 })
      } catch (error) {
        console.error('Error waiting for selector:', error.message)
        break
      }

      const jobLinks = await page.$$eval(
        `${olSelector} li article a.ds_ais-Hit-link`,
        (anchors) => anchors.map((a) => a.href),
      )

      addJobLinksToExcel(filename, jobLinks)
      // console.log(`📄 Added ${jobLinks.length} job links to Excel.`)

      const nextBtn = await page.$(nextBtnSelector)
      const isDisabled = await page.$(nextDisabledSelector)

      if (isDisabled) break

      await Promise.all([
        page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
        nextBtn.click(),
      ])
    }

    return filename
  } catch (error) {
    console.error('Error scraping job links:', error.message)
  }
}
