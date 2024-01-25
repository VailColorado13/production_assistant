const fs = require('fs')
const path = require('path')
const mammoth = require('mammoth')

async function extractDocxText() {
    const tempFolder = './zTEMPLATE/Prelim\ Scripts'
    const extractedData = {}

    return new Promise((resolve, reject) => {
        fs.readdir(tempFolder, 'utf8', (err, files) => {
            if (err) {
                console.error('Error reading file:', err);
                reject(err);
                return;
            }

            const docxFile0 = files.find(file => /\.(docx|doc)$/.test(file))

            if (!docxFile0) {
                // If no matching file is found, reject with an error
                const errorMessage = 'No .docx or .doc file found in the temp folder'
                console.error(errorMessage)
                reject(new Error(errorMessage))
                return
            }

            const filePath = path.join(tempFolder, docxFile0)


            mammoth.extractRawText({ path: filePath })
                .then(result => {
                    const text = result.value
                    const clientMatch = text.match(/(?<=CLIENT:)(.*)(?=CAMPAIGN:)/s)[1].trim()
                    const jobNumberMatch = text.match(/(?<=JOB #:)(.*)(?=ISCI)/s)[1].trim()
                    extractedData.client = clientMatch
                    extractedData.jobNumber = jobNumberMatch
                    console.log(extractedData)
                
                    // Resolve the promise with the extractedData
                    resolve(extractedData)
                })
                .catch(error => {
                    console.error('Error extracting text:', error);
                    reject(error);
                })
        })
    })
}




module.exports = extractDocxText