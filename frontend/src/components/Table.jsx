import React, { useEffect, useState } from 'react';

const Table = ( {tableData, modifyTableData} ) => {
  
  const [editableData, setEditableData] = useState('')

  for (const ISCI in tableData) {
    tableData[ISCI]['ISCI'] = ISCI
  }
  //for some reasons the editable data was rendering as an empty object when I tried to directly set the 
  //value directly with the state declaration above. This use effect is a workaround
  useEffect(() => {
    if (tableData) {
      setEditableData(tableData)
    }
  }, [tableData])

  const handleInputChange = (ISCI, key, value) => {
    setEditableData((prevData) => ({
      ...prevData,
      [ISCI]: {
        ...prevData[ISCI],
        [key]: value,
      },
    }))
  }

  const sendDataToServer = (editableData) => {
    modifyTableData(editableData)
  }
  
  const tableRows = Object.keys(editableData).map((ISCI) => {
    const item = editableData[ISCI]
    if (editableData[ISCI].double) {
      return (
      <>
        <tr key={ISCI}>
        <td>
          <input
            type="text"
            value={item.firstISCI}
            onChange={(e) => handleInputChange(ISCI, 'firstISCI', e.target.value)}
          />
        </td>
        <td>
          <input
            type="text"
            value={item.title}
            onChange={(e) => handleInputChange(ISCI, 'title', e.target.value)}
          />
        </td>
        <td>
          <input
            type="text"
            value={item.length}
            onChange={(e) => handleInputChange(ISCI, 'length', e.target.value)}
          />
        </td>
      </tr>
      <tr key = {item.secondISCI}>
      <td>
        <input
            type="text"
            value={item.secondISCI}
            onChange={(e) => handleInputChange(ISCI, 'secondISCI', e.target.value)}
          />
      </td>
      <td>
          <input
            type="text"
            value={item.title}
            onChange={(e) => handleInputChange(ISCI, 'title', e.target.value)}
          />
      </td>
      <td>
          <input
            type="text"
            value={item.length === ':30' ? ':2703' : item.length === ':15' ? ':1203' : 'unknown'}
            onChange={(e) => handleInputChange(ISCI, 'title', e.target.value)}
          />
      </td>
      </tr>
    </>
    )

  }  else return (
     <>
      <tr key={ISCI}>
        <td>
          <input
            type="text"
            value={item.firstISCI}
            onChange={(e) => handleInputChange(ISCI, 'firstISCI', e.target.value)}
          />
        </td>
        <td>
          <input
            type="text"
            value={item.title}
            onChange={(e) => handleInputChange(ISCI, 'title', e.target.value)}
          />
        </td>
        <td>
          <input
            type="text"
            value={item.length}
            onChange={(e) => handleInputChange(ISCI, 'length', e.target.value)}
          />
        </td>
      </tr>
     </>
    )
  })


  return (
    <>
    <table>
      <thead>
        <tr>
          <th>ISCI</th>
          <th>Title</th>
          <th>Length</th>
        </tr>
      </thead>
      <tbody>{tableRows}</tbody>
    </table>
    <button onClick = {() => sendDataToServer(editableData)}>send data to server</button>
    </>
  )
}

export default Table;

