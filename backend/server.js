const express = require('express')
const fs = require('fs')
const path = require('path')
const cors = require('cors')
const multer = require('multer')
const bodyParser = require('body-parser')
const writeNewEstimate = require('./serverFunctions/writeNewEstimate')
const dateMaker = require('./serverFunctions/dateMaker')
const zipper = require('./serverFunctions/zipper')
const clearOldFiles = require('./serverFunctions/clearOldFiles')
const sanitizeFilename = require('sanitize-filename')



const app = express();
const PORT = process.env.PORT || 1337;

// Set up Multer to handle file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './zTEMPLATE/Prelim\ Scripts', 'file0')
    },
    filename: function (req, file, cb) {
      const sanitizedFilename = sanitizeFilename(file.originalname)
      cb(null, sanitizedFilename);
    }
  })
const upload = multer({ storage: storage });

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

    res.status(200).json({ message: 'Data received successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
})



app.get('/download', async (req, res) => {
  const date = dateMaker(new Date())
  const zip = await zipper(date)
  res.download(`./temp/jobFiles-${date}.zip`)
})

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
