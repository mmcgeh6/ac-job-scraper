import * as XLSX from 'xlsx'
import fs from 'fs'

export default async function fetchLinkFromSheet(excelPath) {
  let workbook
  try {
    const fileBuffer = fs.readFileSync(excelPath)
    workbook = XLSX.read(fileBuffer, { type: 'buffer' })
  } catch (err) {
    throw new Error(`Failed to read Excel file: ${err.message}`)
  }

  const firstSheetName = workbook.SheetNames[0]
  const worksheet = workbook.Sheets[firstSheetName]


  const jobData = XLSX.utils
    .sheet_to_json(worksheet, {
      header: 1,
      defval: null,
      raw: false,
    })
    .flat()
    .filter((link) => typeof link === 'string')
  return jobData
}
