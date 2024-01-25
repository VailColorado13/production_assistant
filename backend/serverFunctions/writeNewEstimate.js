const excel = require('exceljs')
const { extractRawText } = require('mammoth')
const readDocx = require('./readDocx.js')



async function writeNewEstimate (titleObject) {
   console.log('run')
    const workbook = new excel.Workbook()
    await workbook.xlsx.readFile('../template.xlsx')
    const worksheet = workbook.getWorksheet('Sheet1') 

    const extractedData = await readDocx()
    worksheet.getCell(`C6`).value = extractedData.jobNumber   
    worksheet.getCell(`C8`).value = extractedData.client   

    let currentRow = 15

   for (const script in titleObject) {
      const double = titleObject[script].double
      const firstCode = script
      const secondCode = titleObject[script].secondISCI
      const title = titleObject[script].title
      const length = titleObject[script].length 

      worksheet.getCell(`B${currentRow}`).value = firstCode 
      worksheet.getCell(`C${currentRow}`).value = title
      worksheet.getCell(`J${currentRow}`).value = `${length}`
      currentRow++

      if (double === true) {
         worksheet.getCell(`B${currentRow}`).value = secondCode 
         worksheet.getCell(`C${currentRow}`).value = title
         worksheet.getCell(`J${currentRow}`).value = `:${length === ":30" ? ':27/03' : length === ':15' ? '12/03' : 'undefined' }`
         currentRow++
      }
      
   }

   //await workbook.xlsx.writeFile('../zTEMPLATE/FinanceDocuments/newEstimate.xlsx")

   await workbook.xlsx.writeFile('./zTEMPLATE/Finance\ Documents/newEstimate.xlsx')
 }

 module.exports = writeNewEstimate