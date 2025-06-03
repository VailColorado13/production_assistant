const express = require('express')
const fs = require('fs')
const path = require('path')
const cors = require('cors')
const multer = require('multer')
const bodyParser = require('body-parser')
const writeNewEstimate = require('./serverFunctions/writeNewEstimate')
const updateStatus = require('./serverFunctions/updateStatus')
const dateMaker = require('./serverFunctions/dateMaker')
const zipper = require('./serverFunctions/zipper')
const clearOldFiles = require('./serverFunctions/clearOldFiles')
const sanitizeFilename = require('sanitize-filename')




const app = express();
const PORT = process.env.PORT || 1337;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.doc' || ext === '.docx') {
      cb(null, path.join(__dirname, 'zTEMPLATE', 'Prelim Scripts'));
    } else {
      cb(null, path.join(__dirname, 'zStatus'));
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    if (ext === '.doc' || ext === '.docx') {
      cb(null, file.originalname); // Preserves filename and extension
    }
    else {
      cb(null, 'file0.xlsx')
    }
  }
})

const upload = multer({ storage });




app.use(express.json());
app.use(cors());

// Use bodyParser to parse JSON data
app.use(bodyParser.json());

app.post('/clear', (req, res) => {
  clearOldFiles()
})

app.post('/test', upload.any(), (req, res) => {
    try {
    // Access the JSON data
    const scripts = JSON.parse(req.body.names)
    console.log('logging names: ', scripts)
    writeNewEstimate(scripts)
    //updateStatus(scripts)
    res.status(200).json({ message: 'Data received successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

app.post('/statusDocDrop', upload.single('file'), (req, res) => {
  try {
    console.log('Received data:', req.body)
    const excelData = JSON.parse(req.body.excelData)
    updateStatus(excelData)

    console.log('Received file:', req.file)

    res.status(200).json({ message: 'statusDocDrop Called' })
  } catch (error) {
    console.error('Error parsing data:', error);
    res.status(500).json({ error: 'Internal server error' })
  }
})





app.get('/downloadJobFiles', async (req, res) => {
  const date = dateMaker(new Date())
  console.log('clicked download')
  const zip = await zipper(date)
  res.download(`./temp/jobFiles-${date}.zip`)
})

app.get('/downloadStatus', async (req, res) => {
  res.download(`./zStatus/file0.xlsx`)
})

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
