const AdmZip = require('adm-zip');
const fs = require('fs');
const path = require('path');
const dateMaker = require('./dateMaker')


async function zipper(date) {
  
  const currentDate = new Date();

  const dateString = date
  const folderPath = './zTEMPLATE'
  const zipFilePath = `./temp/jobFiles-${dateString}.zip`

  // Function to zip a folder
  function zipFolder(folderPath, zipFilePath) {
    // Initialize the zip object
    const zip = new AdmZip();

    // Get the list of files and subdirectories in the folder
    const items = fs.readdirSync(folderPath);

    // Add each file and folder to the zip
    items.forEach(item => {
      const itemPath = path.join(folderPath, item)
      const isDirectory = fs.statSync(itemPath).isDirectory()
      
      if (isDirectory) {
        // Add the folder
        zip.addLocalFolder(itemPath, path.relative(folderPath, itemPath))
        
        // Recursively add the contents of the folder
        zipFolder(itemPath, zipFilePath)
      } else {
        // Add files to the zip
        zip.addLocalFile(itemPath)
      }
    })


    // Write the zip file to the specified path
    zip.writeZip(zipFilePath);

    console.log(`Folder "${folderPath}" successfully zipped to "${zipFilePath}"`)
  }
  zipFolder(folderPath, zipFilePath)

}
  

// export the above function

module.exports = zipper

