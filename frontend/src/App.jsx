import { useState, useEffect } from 'react'
import Axios from 'axios'
import fileDownload from 'js-file-download'
import './App.css'
import parseTitles from '../clientSideJS/parseTitles'
import  Table  from './components/Table'
import  SessionCode  from './components/SessionCode'
import dateMaker from '../clientSideJS/dateMaker'


function App() {
  const [files, setFiles] = useState([])
  const [tableData, setTableData] = useState([])
  const [userSubmittedData, setUserSubmittedData] = useState(false)
  const [responseOK, setResponseOK] = useState(false)



  const download = async () => {
    console.log('clicked');
    try {
//    const response = await fetch('http://localhost:1337/download')
      const response = await fetch('https://react-prod-assist.onrender.com/download')
 
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
  
      const blob = await response.blob();
  
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `jobFiles-${dateMaker(new Date())}.zip`
      link.click()
    } catch (error) {
      console.error('Error downloading file:', error)
    }
  }
  

  const modifyTableData = (editableData) => {
   setTableData(editableData)
   setUserSubmittedData(true)
  }

  useEffect(() => {
    if (userSubmittedData) {
      sendToServer()
    }
  })

  const sendToServer = (e) => {
    const formData = new FormData()
    
    for (let i = 0; i < files.length; i++) {
      formData.append(files[i].name, files[i], files[i].name)
    }

    formData.append('names', JSON.stringify(tableData))

   

 // fetch('http://localhost:1337/test', {
    fetch('https://react-prod-assist.onrender.com/test', {
      method: 'POST',
      // headers: { 'Content-Type': 'multipart/form-data' },
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          setResponseOK(true)
        } else {
          setResponseOK(false)
        }
        return response.json()
      }).catch((error) => {
        console.error('Error sending data to the server:', error)
        setResponseOK(false)
      })
  }

  const handleDrop = (e) => {
    //send request to server to clear out old files:
//   fetch('http://localhost:1337/clear' , {
     fetch('https://react-prod-assist.onrender.com/clear' , {
      method: 'POST',
    }).then((response) => {
      if (!response.ok){
        console.log('error clearing old files from server memory.')
      }
    })
    
    e.preventDefault()
    const droppedFiles = Array.from(e.dataTransfer.files)
    setFiles(droppedFiles)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }
  
  useEffect(() => {
    const rawNames = files.map(file => file.name)
    const titleObject = parseTitles(rawNames)
    setTableData(titleObject)
  },[files])

  
  return (
    <>
      <h1>Production Assistant</h1>
      <section 
       className={'fileDropArea'}
       onDrop={handleDrop}
       onDragOver={handleDragOver}>
      </section>
      <div className="data-window">
       {files.length > 0 && <Table tableData={tableData} modifyTableData={modifyTableData} />}
      {responseOK && <button onClick = {(e) => download(e)}>Download</button>} 
      {userSubmittedData && <SessionCode tableData={tableData}  />}
      </div>
    </>
  )

  
}

export default App
