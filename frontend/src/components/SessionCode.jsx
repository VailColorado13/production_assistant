import React from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import clipboardCopy from 'clipboard-copy';



const SessionCode = ({tableData}) => {
  const [copySuccess, setCopySuccess] = React.useState(false);

  const handleCopyClick = () => {
    clipboardCopy(code);
    setCopySuccess(true);

    // Reset the copy success message after a brief period
    setTimeout(() => {
      setCopySuccess(false)
    }, 1500)
  }

    //create a variable that will be the ISCI values 
    const ISCIs = []
    const titles = []
    const lengths = []

console.log('from SessionCode', tableData)    
for (const ISCI in tableData) {
  let firstISCI = tableData[ISCI].firstISCI
  //check if ISCIs end in H; remove if so
  if (firstISCI[firstISCI.length - 1] === 'H') {
    ISCIs.push(firstISCI.substring(0, firstISCI.length - 1))
  } else {
    ISCIs.push(firstISCI)
  }
  //add titles to the titles array 
  titles.push(tableData[ISCI].title)
  lengths.push(tableData[ISCI].length)
}



const ISCIsStrings = ISCIs.map(isci => `"${isci}"`).join(',')

const titleStrings = titles.map(title => `"${title}"`).join(',')

const lengthsStrings = lengths.map(length => `"${length}"`).join(',')

const code = `
  const ISCIs = [${ISCIsStrings}]
  const titles = [${titleStrings}]
  const lengths = [${lengthsStrings}]

      async function addRows() {
        for (let i = 0; i<= ISCIs.length -2; i++) {
          document.querySelector("#generalView > div.tabPanel > div:nth-child(14) > div:nth-child(2) > a").click()
        }
      }

      function addCreativeData() {
        for (let i = 0; i < ISCIs.length; i++) {
          document.getElementsByName( \`creativeCodes[\${i}].MediaId\`)[0].value =  ISCIs[i]
          
          document.getElementsByName( \`creativeCodes[\${i}].Title\`)[0].value = titles[i]

          document.getElementsByName( \`creativeCodes[\${i}].Length\`)[0].value = lengths[i]

          document.querySelector(\`select[name="creativeCodes[\${i}].CreativeCodeFormat"]\`).value = '20'
        }
      }

      function addMetaData() {
        document.getElementById('commercialReportMediaType').value = '100'
        document.getElementById('union').value = '10'
        document.getElementById('token-input-producerName').value = 'Matt Vail'

         document.getElementById('advertiserId').value = '135799'
      }



      async function execute () {
        await addRows()
        addCreativeData()
        addMetaData()
      }

      execute()
      `
    
    if (!Object.keys(tableData).length) return (<></>)
    else {
    return (
      <div>
        <p>Step one: Navigate to a blank <a href="https://app.extremereach.com/Talent/Report?Type=Session" target="_blank" rel="noopener noreferrer">Session Report.</a></p>
    
        <button onClick={handleCopyClick}>
          {copySuccess ? 'Copied!' : 'Copy Code to Clipboard'}
        </button>
    
        <div className='code-window'>
          {/* Adjust the maxWidth value according to your preference */}
          <SyntaxHighlighter language="javascript" style={docco} customStyle={{ textAlign: 'left' }} className={'syntaxHighligher'}>
            {code}
          </SyntaxHighlighter>
        </div>
      </div>
    )
    }

}

export default SessionCode