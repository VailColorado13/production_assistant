import React, { useEffect, useState } from 'react';
import dateMaker from '../../clientSideJS/dateMaker';

//what does handleStatusDrop do?
  //make a API call to server that sends the tableData object to the backend
  //On the same request, uploads the xcel document 

const StatusDropZone = ({tableData}) => {

  const [StatusResponse, setStatusResponse] = useState(false)
  const handleStatusDrop = (e) => {
    const formData = new FormData()
    const droppedFiles = Array.from(e.dataTransfer.files)
    console.log(droppedFiles)
    formData.append('excelData', JSON.stringify(tableData))
    formData.append('file', droppedFiles[0])
   // fetch('http://localhost:1337/statusDocDrop', {
       fetch('https://react-prod-assist.onrender.com/statusDocDrop', {
      method: 'POST',
      body: formData,
    })
    .then((response) => {
      if (response.ok) {
        setStatusResponse(true)
      } else {
        setStatusResponse(false)
      }
      return response.json()
    })
      .catch((error) => {
        console.error('Error sending data to the server:', error)
      })
    e.preventDefault()
  }
  
  const handleDragOver = (e) => {
      e.preventDefault()
    }

  const downloadStatus = async (e) => {
    console.log('clicked');
    try {
    //  const response = await fetch('http://localhost:1337/downloadStatus')
       const response = await fetch('https://react-prod-assist.onrender.com/downloadStatus')

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const blob = await response.blob()
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = `status-${dateMaker(new Date())}.xlsx`
      link.click()
    } catch (error) {
      console.error('Error downloading file:', error)
    }
  }


    return (
      <>
        <section 
        className={'fileDropAreaGreen'}
        onDrop={handleStatusDrop}
        onDragOver={handleDragOver}>
       </section>
       {StatusResponse && (<button onClick={(e) => downloadStatus(e)}>Download Status Doc</button>)}
       </>
       )
}

export default StatusDropZone;

