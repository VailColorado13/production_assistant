//function takes as argument an array of strings. 
//returns array of objects. 

export default function parseTitles(titles) {
  const splitTitles = titles.map((title) => {
      // Replace quotes and double quotes with spaces
      title = title.replace(/["']/g, ' ')
    
      // Remove underscores
      title = title.split('_').join(' ')
    
      // Remove extra spaces
      title = title.replace(/\s\s+/g, ' ')
    
      // Remove .docx suffix
      title = title.split(/\.d/i)[0]    
      
      // Split into single words and remove single pieces of punctuation
      const regex = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?\s]+$/
      return title
        .split(' ')
        .filter((word) => !regex.test(word))
    })
  
    const tableDataObject = {}
   
    splitTitles.forEach(title => tableDataObject[title[0]] = {
      double: undefined, 
      title: title,
      firstISCI: title[0],
      secondISCI: undefined, 
      length: undefined
      })

  for (const ISCI in tableDataObject) {
     let title = tableDataObject[ISCI].title
     //remove the lengths in parentheses 
     let newTitle = []
     
     for (let i = 0; i < title.length; i++) {
          if (!title[i].includes('(') && !title[i].includes(')')) {
              newTitle.push(title[i])
          }
          //determine if any of the elements in the title array strictly equal '30' or '15'. If so, assign the length property of the object to that number 
          if (title[i] === '30') {
              tableDataObject[ISCI].length = ':30'
          }
          if (title[i] === '15') {
              tableDataObject[ISCI].length = ':15'
          }   
     }
     //exit the loop and check if tableDataObject[ISCI].length is assigned a value. If not, assign it to 'unknown'. This is to keep React from yelling at you for changing an undefined value to a defined value when we go on and build the editableData object 

     if (!tableDataObject[ISCI].length) {
        tableDataObject[ISCI].length = 'unknown'
     }


      //determine if there are more than two elements of the array that match the isciRegex
      const ISCIRegex = /[A-Z]{4}\d{4}/
      //if so, set tableDataObject[ISCI].title to true 
      //if not, set tableDataObject[ISCI].title to false
      let ISCIs = newTitle.filter(word => word.match(ISCIRegex))
      //remove the iscis themselves from the title:
      newTitle = newTitle.filter(word => !word.match(ISCIRegex))
      //if the ISCIs array has more than one element...
      if (ISCIs.length > 1) {
          //set double to true 
          tableDataObject[ISCI].double = true 
          //set second ISCI to the second element of the ISCIs array
          tableDataObject[ISCI].secondISCI = ISCIs[1]
      }
      else if (ISCIs.length === 1) tableDataObject[ISCI].double = false

     tableDataObject[ISCI].title = newTitle.join(' ')  
  }
  return tableDataObject
}
