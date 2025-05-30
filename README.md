# Atlas Copco Group Job Scraper

This project is a Node.js script built with Puppeteer to scrape job listings from the [Atlas Copco Group Careers](https://www.atlascopcogroup.com/) site and forward the data to a designated webhook endpoint.

## Features

* Automates job data extraction from Atlas Copco Group’s job board.
* Uses Puppeteer for headless browser automation.
* Sends scraped job data directly to your webhook.

## Prerequisites

* Node.js v14 or later
* npm (Node Package Manager)
* A valid webhook URL to receive the scraped job data

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure the starting link**
   Open `index.js` and replace the `startingLink` variable with the URL of the job search results page you wish to scrape.

3. **Set your webhook**
   Update the `WEBHOOK_DELETE_URL` inside the `deleteJobsFromWebhook` function and `WEBHOOK_UPDATE_URL` inside the `upadteJobsOnWebhook` function with your desired endpoint to receive the job data.

4. **Configure Geocoding API Key**
   Create a `.env` file in the project root and add the following line:
   ```bash
   GEOCODING_API_KEY=YOUR_API_KEY
   ```
   Replace `YOUR_API_KEY` with your actual Google Geocoding API key.

## Usage

After completing the setup:

```bash
node index.js
```

The script will launch a headless browser, navigate to the specified job board, scrape job details, and send them to your configured webhook.