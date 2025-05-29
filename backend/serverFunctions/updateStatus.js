const excel = require('exceljs')

//update status  - needs to take the titleObect (created in ???) as well as the user-uploaded current status document and 
    //read the status doc and determine where to start writing new entries (at what row does our loop start?)
    //use the data from the titleObject to write in the new entries

    //where does titleObject come from?
    //is titleObject stored anywhere or does it come straight from the upload and go directly to the server
    
 
    
    

    async function updateStatus (titleObject) {
       const workbook = new excel.Workbook()
       await workbook.xlsx.readFile('./zTEMPLATE/statusUpdate/file0.xlsx')
       const worksheet = workbook.getWorksheet('Sheet1') 
       
       let startingRow = []

       worksheet.eachRow((row) => {
        console.log(row.getCell(5).value)
        if (row.getCell(5).value) {startingRow++}
       })


    }


    module.exports = updateStatus