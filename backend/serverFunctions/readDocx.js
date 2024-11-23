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

            const docxFile0 = files.find(file => /\.(docx|doc)$/i.test(file))

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
                    let clientMatch = text.match(/(?<=CLIENT:)(.*)(?=CAMPAIGN:)/s) 
                    let jobNumberMatch 
                    
                    //add conditional to account for text being written as "Job #:" and "Job:"
                    if (text.match(/(?<=JOB #:)(.*)(?=ISCI)/s)) {
                        jobNumberMatch = text.match(/(?<=JOB #:)(.*)(?=ISCI)/s)
                    } else {
                        jobNumberMatch = text.match(/(?<=JOB:)(.*)(?=ISCI)/s)
                    }


                    extractedData.client = clientMatch ? clientMatch[1].trim() : undefined
                    extractedData.jobNumber = jobNumberMatch ? jobNumberMatch[1].trim() : undefined
                    console.log(extractedData)
                    // Resolve the promise with the extractedData
                    resolve(extractedData)
                })
                .catch(error => {
                    console.error('Error extracting text:', error);
                    //reject(error);
                })
        })
    })
}




module.exports = extractDocxText