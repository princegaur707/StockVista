import React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import * as XLSX from 'xlsx';

// Style the hidden file input so our MUI Button can trigger it.
const Input = styled('input')({
  display: 'none',
});

function FileUpload({ onDataLoaded }) {
  /**
   * handleFileUpload:
   * 1. Reads the Excel file as a binary string.
   * 2. Converts the sheet into an array of arrays (header: 1) so every row is preserved.
   * 3. Dynamically finds the header row by checking for expected column names.
   * 4. Constructs JSON objects using that header row.
   * 5. Calls onDataLoaded(jsonData) to pass the data to the parent.
   */
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const binaryStr = evt.target.result;
        const workbook = XLSX.read(binaryStr, { type: 'binary' });
        
        // Select the first sheet (adjust if needed)
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        
        // Convert the entire sheet into an array of arrays.
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
        // console.log("All rows:", rows);

        // Define a list of expected header names (at least a few must be present).
        const expectedHeaders = [
          "Scrip/Contract", 
          "Buy/Sell", 
          "Buy Price", 
          "Sell Price", 
          "Quantity", 
          "Order ID", 
          "Trade ID", 
          "Date"
        ];
        
        // Dynamically detect the header row index:
        let headerRowIndex = -1;
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          // Count how many expected headers appear in this row.
          let count = 0;
          expectedHeaders.forEach((header) => {
            if (row.indexOf(header) !== -1) {
              count++;
            }
          });
          // If at least 3 expected header names are found, consider this row the header.
          if (count >= 3) {
            headerRowIndex = i;
            break;
          }
        }
        
        // If headerRowIndex is not found, alert the user.
        if (headerRowIndex === -1) {
          alert("Could not detect the header row. Please ensure the file has valid column names.");
          return;
        }
        
        // console.log("Detected header row index:", headerRowIndex);
        const headerRow = rows[headerRowIndex];
        // console.log("Header row:", headerRow);
        
        // Build JSON objects for all rows after the header row.
        const dataRows = rows.slice(headerRowIndex + 1);
        const jsonData = dataRows.map((row) => {
          let obj = {};
          // For each cell in the header, assign the corresponding value from this row.
          for (let j = 0; j < headerRow.length; j++) {
            // Trim header text to remove accidental spaces.
            const key = headerRow[j].trim();
            obj[key] = row[j] || '';
          }
          return obj;
        });
        
        console.log("Parsed JSON Data:", jsonData);
        onDataLoaded(jsonData);
      };
      reader.readAsBinaryString(file);
    }
  };

  return (
    <div>
      <label htmlFor="contained-button-file">
        <Input
          accept=".xlsx, .xls"
          id="contained-button-file"
          type="file"
          onChange={handleFileUpload}
        />
        <Button
          variant="contained"
          component="span"
          sx={{
            fontFamily: 'Figtree',
            width: '7rem',
            height: '2.5rem',
            border: '1px solid',
            fontSize: '14px',
            // marginRight: '0px',
            borderImage: 'linear-gradient(93.4deg, #FFC42B 0%, #FFD567 50%, #FFC42B 100%)',
            borderImageSlice: 1,
            color: '#FFC42B',
            backgroundColor: '#231E13',
            '&:hover': {
              backgroundColor: 'rgba(255, 196, 43, 0.1)',
              borderImage: 'linear-gradient(93.4deg, #FFC42B 100%, #FFD567 100%, #FFC42B 100%)',
              border: 'none'
            }
          }}
        >
          Upload File
        </Button>
      </label>
    </div>
  );
}

export default FileUpload;


// // File: src/components/FileUpload.js
// import React, { useState } from 'react';
// import { Button } from '@mui/material';
// import * as XLSX from 'xlsx';

// const FileUpload = ({ onDataExtracted }) => {
//   const [fileName, setFileName] = useState('');

//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;
//     setFileName(file.name);

//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const binaryStr = e.target.result;
//       const workbook = XLSX.read(binaryStr, { type: 'binary' });
//       const sheetName = workbook.SheetNames[0];
//       const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
//       onDataExtracted(data);
//     };
//     reader.readAsBinaryString(file);
//   };

//   return (
//     <div>
//       <input 
//         type="file" 
//         accept=".xlsx, .csv" 
//         onChange={handleFileUpload} 
//         style={{ display: 'none' }} 
//         id="file-input" 
//       />
//       <label htmlFor="file-input">
//         <Button
//           variant="contained"
//           component="span"
//           sx={{
//             fontFamily: 'Figtree',
//             width: '7rem',
//             height: '3rem',
//             border: '1px solid',
//             fontSize: '14px',
//             marginRight: '10px',
//             borderImage: 'linear-gradient(93.4deg, #FFC42B 0%, #FFD567 50%, #FFC42B 100%)',
//             borderImageSlice: 1,
//             color: '#FFC42B',
//             backgroundColor: '#231E13',
//             '&:hover': {
//               backgroundColor: 'rgba(255, 196, 43, 0.1)',
//               borderImage: 'linear-gradient(93.4deg, #FFC42B 100%, #FFD567 100%, #FFC42B 100%)',
//               border: 'none'
//             }
//           }}
//         >
//           Upload File
//         </Button>
//       </label>
//       {fileName && <p>Uploaded: {fileName}</p>}
//     </div>
//   );
// };

// export default FileUpload;
