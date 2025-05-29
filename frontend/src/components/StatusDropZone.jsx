import React, { useEffect, useState } from 'react';

//what does handleStatusDrop do?
  //make a API call to server that sends the tableData object to the backend
  //On the same request, uploads the xcel document 

const StatusDropZone = ({tableData}) => {

  const handleStatusDrop = (e) => {
    const formData = new FormData()
    const droppedFiles = Array.from(e.dataTransfer.files)
    console.log(droppedFiles)
    formData.append('excelData', JSON.stringify(tableData))
    formData.append('file', droppedFiles[0])
    fetch('http://localhost:1337/statusDocDrop', {
      // fetch('https://react-prod-assist.onrender.com/statusDocDrop', {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
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

    return (
        <section 
        className={'fileDropAreaGreen'}
        onDrop={handleStatusDrop}
        onDragOver={handleDragOver}>
       </section>
       )
}

export default StatusDropZone

