import React, { useState, useMemo } from 'react';

const DataMerger = () => {
  const data = useMemo(
    () => [
      { id: 1, attribute1: 'A1', attribute2: 'B1', attribute3: 'C1' },
      { id: 2, attribute1: 'A2', attribute2: 'B2', attribute3: 'C2' },
      { id: 3, attribute1: 'A3', attribute2: 'B3', attribute3: 'C3' },
      { id: 4, attribute1: 'A4', attribute2: 'B4', attribute3: 'C4' },
      { id: 5, attribute1: 'A5', attribute2: 'B5', attribute3: 'C5' },
    ],
    []
  );

  const columns = useMemo(
    () => [
      { header: 'Attribute 1', accessor: 'attribute1' },
      { header: 'Attribute 2', accessor: 'attribute2' },
      { header: 'Attribute 3', accessor: 'attribute3' },
    ],
    []
  );

  const [trueRow, setTrueRow] = useState({});
  const [masterRow, setMasterRow] = useState({});

  const selectCell = (columnId, value) => {
    setTrueRow({ ...trueRow, [columnId]: value });
  };

  const saveTrueRow = () => {
    setMasterRow(trueRow);
    setTrueRow({});
  };

  const clearTrueRow = () => {
    setTrueRow({});
  };

  return (
    <div>
      <h2>Master</h2>
      <table className="table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.accessor}>{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {columns.map((column) => (
              <td key={column.accessor}>{masterRow[column.accessor]}</td>
            ))}
          </tr>
        </tbody>
      </table>
      <h2>Changes to be applied</h2>
      <table className="table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.accessor}>{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {columns.map((column) => (
              <td key={column.accessor}>{trueRow[column.accessor]}</td>
            ))}
          </tr>
        </tbody>
      </table>
      <button onClick={saveTrueRow}>Save</button>
      <button onClick={clearTrueRow}>Clear</button>
      <h2>Data Rows</h2>
      <table className="table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.accessor}>{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              {columns.map((column) => (
                <td
                  key={column.accessor}
                  onClick={() => selectCell(column.accessor, row[column.accessor])}
                  style={{
                    cursor: 'pointer',
                    backgroundColor: trueRow[column.accessor] === row[column.accessor] ? 'lightblue' : 'white',
                  }}
                >
                  {row[column.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataMerger;