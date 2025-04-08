import React, { useContext } from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import * as XLSX from 'xlsx';
import AuthContext from 'views/pages/authentication/auth-forms/AuthContext';

const Input = styled('input')({
  display: 'none'
});

function FileUpload({ onUploadComplete }) {
  // Import the requestWithToken helper from AuthContext
  const { requestWithToken } = useContext(AuthContext);

  const convertExcelDate = (excelDate) => {
    if (!excelDate || isNaN(excelDate)) return null;
    const jsDate = new Date((excelDate - 25569) * 86400 * 1000); // Excel date to JS
    return jsDate.toISOString(); // Or format as needed
  };
  
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (evt) => {
        const binaryStr = evt.target.result;
        const workbook = XLSX.read(binaryStr, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

        const expectedHeaders = ['Scrip/Contract', 'Buy/Sell', 'Buy Price', 'Sell Price', 'Quantity', 'Order ID', 'Trade ID', 'Date'];

        let headerRowIndex = -1;
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          let count = 0;
          expectedHeaders.forEach((header) => {
            if (row.indexOf(header) !== -1) count++;
          });
          if (count >= 3) {
            headerRowIndex = i;
            break;
          }
        }

        if (headerRowIndex === -1) {
          alert('Could not detect the header row. Please ensure the file has valid column names.');
          return;
        }

        const headerRow = rows[headerRowIndex];
        const dataRows = rows.slice(headerRowIndex + 1);

        const jsonData = dataRows.map((row) => {
          let obj = {};
          for (let j = 0; j < headerRow.length; j++) {
            const key = headerRow[j].trim();
            obj[key] = row[j] || '';
          }
          return obj;
        });

        // console.log('Parsed JSON Data:', jsonData);

        // Send to backend
        const username = localStorage.getItem('username');
        if (!username) {
          alert('Username not found in localStorage.');
          return;
        }

        const trades = jsonData.map((row) => ({
          scrip_contract: row['Scrip/Contract'],
          buy_sell: row['Buy/Sell'],
          buy_price: parseFloat(row['Buy Price']) || 0,
          sell_price: parseFloat(row['Sell Price']) || 0,
          quantity: parseInt(row['Quantity']) || 0,
          brokerage: parseFloat(row['Brokerage']) || 0,
          gst: parseFloat(row['GST']) || 0,
          sst: parseFloat(row['SST']) || 0,
          sebi_tax: parseFloat(row['SEBI Tax']) || 0,
          exchange_turnover_charges: parseFloat(row['Exchange Turnover Charges']) || 0,
          stamp_duty: parseFloat(row['Stamp Duty']) || 0,
          other_charges: parseFloat(row['Other Charges']) || 0,
          ipft_charges: parseFloat(row['IPFT Charges']) || 0,
          order_type: row['Order Type'],
          segment: row['Segment'],
          exchange: row['Exchange'],
          order_id: row['Order ID'],
          trade_id: row['Trade ID'],
          date: convertExcelDate(row['Date'])
        }));

        try {
          const res = await requestWithToken(`${import.meta.env.VITE_API_URL}/api/service/process-trade-data/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, trades })
          });

          if (!res.ok) throw new Error('Upload failed');
          // console.log("res",res.json());
          onUploadComplete(); //Tell parent to refresh the table
        } catch (error) {
          console.error('Error uploading file:', error);
          alert('Something went wrong while uploading.');
        }
      };

      reader.readAsBinaryString(file);
    }
  };

  return (
    <div>
      <label htmlFor="contained-button-file">
        <Input accept=".xlsx, .xls" id="contained-button-file" type="file" onChange={handleFileUpload} />
        <Button
          variant="contained"
          component="span"
          sx={{
            fontFamily: 'Figtree',
            width: '7rem',
            height: '2.5rem',
            border: '1px solid',
            fontSize: '14px',
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
