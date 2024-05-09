import React, { useState, useEffect, useRef } from 'react';

const JasperReport = ({ title, reportUrl }) => {
  const [reportData, setReportData] = useState(null);
  const jwtToken = localStorage.getItem("jwtToken");
  const patientRID = localStorage.getItem("patientRID");
  const visitRID = localStorage.getItem("visitRID");
  useEffect(() => {
    handleGenerateReport();
  });

  const handleGenerateReport = () => {
    fetch(reportUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Invalid network response.');
        }
        return response.text();
      })
      .then((data) => {
        setReportData(data); 
        localStorage.removeItem('patientRID');
        localStorage.removeItem('visitRID');
        localStorage.removeItem('billRID');
      })
      .catch((error) => {
        console.error('Error :', error);
      });
  };

  useEffect(() => {
    if (reportData !== null) {
      const popup = window.open('', '_blank', 'width=610,height=400,menubar=yes,toolbar=yes,scrollbars=yes,resizable=yes');
      const content = `
        <html>
        <head>
          <title>${title}</title>
        </head>
        <body>
          <div>
            ${reportData}
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
        </html>
      `;
      popup.document.open();
      popup.document.write(content);
      popup.document.close();
    }
  }, [reportData]); 

  return null;
};

export default JasperReport;