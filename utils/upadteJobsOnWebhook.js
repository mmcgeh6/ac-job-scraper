import fetch from 'node-fetch'

export default async function upadteJobsOnWebhook(headers, rowData) {
  const WEBHOOK_UPDATE_URL =
    'https://prod-251.westeurope.logic.azure.com:443/workflows/d71283a0ed26466bb11e467993e746e3/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Ee6Qx1tCxXfQEZt3itm3bdTkszChN2M0ALwcqj4fvMs'

  // Create an object from headers and rowData
  const job = {}
  headers.forEach((header, index) => {
    job[header] = rowData[index]
  })

  try {
    const response = await fetch(WEBHOOK_UPDATE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(job),
    })

    if (!response.ok) {
      throw new Error(
        `Failed to send job data to UPDATE webhook. Status: ${response.status}`,
      )
    }

    console.log('Job data sent to UPDATE webhook successfully!')
  } catch (error) {
    console.error('Error sending job data to UPDATE webhook:', error.message)
  }
}
