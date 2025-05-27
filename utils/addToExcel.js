import { log } from 'console'
import fs from 'fs'
import * as XLSX from 'xlsx'

export default async function addToExcel(filePath, headers, rowData) {
  let workbook, worksheet

  if (fs.existsSync(filePath)) {
    const fileBuffer = fs.readFileSync(filePath)
    workbook = XLSX.read(fileBuffer, { type: 'buffer' })
    worksheet = workbook.Sheets[workbook.SheetNames[0]]
  } else {
    workbook = XLSX.utils.book_new()
    worksheet = XLSX.utils.aoa_to_sheet([headers])
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Jobs')
  }

  const existingData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
  existingData.push(rowData)

  const newSheet = XLSX.utils.aoa_to_sheet(existingData)
  workbook.Sheets[workbook.SheetNames[0]] = newSheet
  XLSX.writeFile(workbook, filePath)
  console.log('Job added to', filePath)
}
