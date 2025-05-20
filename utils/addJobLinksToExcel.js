import * as XLSX from 'xlsx'
import fs from 'fs'

export default async function addJobLinksToExcel(filePath, links) {
  const sheetName = 'Jobs'

  let workbook, worksheet
  if (fs.existsSync(filePath)) {
    const fileBuffer = fs.readFileSync(filePath)
    workbook = XLSX.read(fileBuffer, { type: 'buffer' })
    worksheet = workbook.Sheets[sheetName]
  } else {
    workbook = XLSX.utils.book_new()
    worksheet = XLSX.utils.aoa_to_sheet([['Job Links']])
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
  }

  const existingData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
  const startRow = existingData.length
  links.forEach((link, index) => {
    const cellAddress = `A${startRow + index + 1}`
    worksheet[cellAddress] = { t: 's', v: link }
  })

  worksheet['!ref'] = XLSX.utils.encode_range({
    s: { r: 0, c: 0 },
    e: { r: existingData.length + links.length - 1, c: 0 },
  })

  XLSX.writeFile(workbook, filePath)
}
