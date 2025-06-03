const fs = require('fs');
const path = require('path');

const filePathToScripts = './zTEMPLATE/Prelim Scripts';
const filePathToStatus = './zStatus/file0.xlsx';

function clearOldFiles() {
  console.log('running')
  // 1. Delete Word documents in Prelim Scripts
  fs.readdir(filePathToScripts, (err, files) => {
    if (err) {
      console.log('Error reading directory:', err);
    } else {
      files.forEach(file => {
        const filePath = path.join(filePathToScripts, file);
        if (path.extname(filePath).toLowerCase() === '.docx') {
          fs.unlink(filePath, err => {
            if (err) {
              console.log('Error deleting file:', err);
            } else {
              console.log(`Deleted Word doc: ${file}`);
            }
          });
        }
      });
    }
  });

  // 2. Delete or clear the Excel status file
  fs.access(filePathToStatus, fs.constants.F_OK, (err) => {
    if (!err) {
      fs.unlink(filePathToStatus, (err) => {
        if (err) {
          console.log('Error deleting Excel file:', err);
        } else {
          console.log('Deleted status Excel file.');
        }
      });
    } else {
      console.log('Status file does not exist, skipping.');
    }
  });

  return;
}

module.exports = clearOldFiles;
