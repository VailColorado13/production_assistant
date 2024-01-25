const fs = require('fs')
const path = require('path')

const filePathToScripts = './zTEMPLATE/Prelim\ Scripts'

function clearOldFiles() {
  //read the docs in the folder
  fs.readdir(filePathToScripts, (err, files) => {
    if (err) console.log('error reading directory: ' ,err)
    else { 
        
        files.forEach(file => { 
          const filePath = path.join(filePathToScripts, file)
          // Check if the file is a Word document (assuming ".docx" or ".doc" extension)
          if (path.extname(filePath).toLowerCase() === '.docx') {
            fs.unlink(filePath, err => {
              if (err) {
                console.log('Error deleting file: ', err);
              } else {
                console.log(`Deleted: ${file}`);
              }
            })
          }
        })  
    }
})
  return
}

module.exports = clearOldFiles
