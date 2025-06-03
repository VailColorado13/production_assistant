const excel = require('exceljs')
const readDocx = require('./readDocx.js')

//worksheet.mergeCells(10,11,12,13); // top,left,bottom,right


async function updateStatus(titleObject) {
   const workbook = new excel.Workbook()
   await workbook.xlsx.readFile('./zStatus/file0.xlsx')
   const worksheet = workbook.getWorksheet('Sheet1')
   const extractedText = await readDocx()
   client = extractedText.client
   
 
   let startingRow = 1
   const testColumn = worksheet.getColumn(5)
 
   testColumn.eachCell((cell, rowNumber) => {
     if (cell.value !== null && cell.value !== undefined) {
       startingRow = rowNumber + 1
     }
   })
 
   let nextRow = startingRow
 
   for (const script in titleObject) {
     const double = titleObject[script].double
     const firstCode = script
     const secondCode = titleObject[script].secondISCI
     const title = titleObject[script].title
     const length = titleObject[script].length

     worksheet.getCell(`E${nextRow}`).value = client
     worksheet.getCell(`F${nextRow}`).value = firstCode
     worksheet.getCell(`G${nextRow}`).value = title
     worksheet.getCell(`H${nextRow}`).value = `${length}`
     nextRow++
 
     if (double === true) {
       worksheet.getCell(`F${nextRow}`).value = secondCode
       worksheet.getCell(`G${nextRow}`).value = title
       worksheet.getCell(`H${nextRow}`).value = length === ":30" ? ':27/03' : length === ':15' ? '12/03' : 'undefined'
       nextRow++
     }
   }
   worksheet.mergeCells(startingRow,9,nextRow-1,9); // top,left,bottom,right
   worksheet.getCell(startingRow, 9).alignment = { vertical: 'top', horizontal: 'left', wrapText: true };

   
   await workbook.xlsx.writeFile('./zStatus/file0.xlsx')
 }
 


    module.exports = updateStatus