import React, { useState } from "react";
import Papa from "papaparse";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Index = () => {
  const [csvData, setCsvData] = useState([]);
  const [headers, setHeaders] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          setHeaders(Object.keys(result.data[0]));
          setCsvData(result.data);
        },
      });
    }
  };

  const handleCellChange = (rowIndex, column, value) => {
    const updatedData = [...csvData];
    updatedData[rowIndex][column] = value;
    setCsvData(updatedData);
  };

  const handleAddRow = () => {
    const newRow = headers.reduce((acc, header) => {
      acc[header] = "";
      return acc;
    }, {});
    setCsvData([...csvData, newRow]);
  };

  const handleDeleteRow = (rowIndex) => {
    const updatedData = csvData.filter((_, index) => index !== rowIndex);
    setCsvData(updatedData);
  };

  const handleDownloadCsv = () => {
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "edited_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">CSV Management Tool</h1>
      <div className="mb-4">
        <Input type="file" accept=".csv" onChange={handleFileUpload} />
        <Button onClick={handleDownloadCsv} className="ml-2">
          Download CSV
        </Button>
      </div>
      <table className="table-auto w-full mb-4">
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-4 py-2 border">
                {header}
              </th>
            ))}
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {csvData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {headers.map((header) => (
                <td key={header} className="px-4 py-2 border">
                  <Input
                    type="text"
                    value={row[header]}
                    onChange={(e) =>
                      handleCellChange(rowIndex, header, e.target.value)
                    }
                  />
                </td>
              ))}
              <td className="px-4 py-2 border">
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteRow(rowIndex)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Button onClick={handleAddRow}>Add Row</Button>
    </div>
  );
};

export default Index;