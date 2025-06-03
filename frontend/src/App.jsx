import { useState, useEffect } from 'react'
import Axios from 'axios'
import fileDownload from 'js-file-download'
import './App.css'
import parseTitles from '../clientSideJS/parseTitles'
import Table from './components/Table'
import SessionCode from './components/SessionCode'
import dateMaker from '../clientSideJS/dateMaker'
import StatusDropZone from './components/StatusDropZone'
 
function App() {
  const [files, setFiles] = useState([])
  const [tableData, setTableData] = useState([])
  const [userSubmittedData, setUserSubmittedData] = useState(false)
  const [ScriptResponseOK, setScriptResponseOK] = useState(false)


  const downloadJobFiles = async () => {
    console.log('clicked');
    try {
     // const response = await fetch('http://localhost:1337/downloadJobFiles')
       const response = await fetch('https://react-prod-assist.onrender.com/downloadJobFiles')

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const blob = await response.blob()
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
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
  }, [userSubmittedData])

  const sendToServer = () => {
    const formData = new FormData()

    for (let i = 0; i < files.length; i++) {
      formData.append(files[i].name, files[i], files[i].name)
    }

    formData.append('names', JSON.stringify(tableData))

   

  //fetch('http://localhost:1337/test', {
     fetch('https://react-prod-assist.onrender.com/test', {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          setScriptResponseOK(true)
        } else {
          setScriptResponseOK(false)
        }
        return response.json()
      })
      .catch((error) => {
        console.error('Error sending data to the server:', error)
        setScriptResponseOK(false)
      })
  }

  const handleDrop = (e) => {
    e.preventDefault()
    console.log('dropped')
    //send request to server to clear out old files:
  // fetch('http://localhost:1337/clear' , {
     fetch('https://react-prod-assist.onrender.com/clear' , {
      method: 'POST',
    }).then((response) => {
      if (!response.ok) {
        console.log('error clearing old files from server memory.')
      }
    })

    const droppedFiles = Array.from(e.dataTransfer.files)
    setFiles(droppedFiles)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleStatusDrop = (e) => {
    e.preventDefault()
    console.log('StatusDropZone drop fired!')
    const droppedFiles = Array.from(e.dataTransfer.files)
    setFiles(droppedFiles)
  }

  useEffect(() => {
    const rawNames = files.map((file) => file.name)
    const titleObject = parseTitles(rawNames)
    setTableData(titleObject)
  }, [files])

  return (
    <>
      <h1>Production Assistant</h1>
      <section
        className={'fileDropArea'}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      ></section>
      <div className="data-window">
        {files.length > 0 && (
          <Table tableData={tableData} modifyTableData={modifyTableData} />
        )}
        {ScriptResponseOK && (
          <button onClick={(e) => downloadJobFiles(e)}>Download Job Files</button>
        )}
        {files.length > 0 && (
          <StatusDropZone tableData = {tableData} />
        )}
        {userSubmittedData && <SessionCode tableData={tableData} />}
      </div>
    </>
  )
}

export default App
