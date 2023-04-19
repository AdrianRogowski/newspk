import React, { useState, useMemo } from 'react';
import './App.css'; // Import the CSS file
import { useTable, useExpanded } from 'react-table';

const DataMerger = () => {
  const data = useMemo(
    () => [
      {
        id: 1,
        attribute1: 'A1',
        attribute2: 'B1',
        attribute3: 'C1',
        subRows: [
          { id: 6, attribute1: 'A6', attribute2: 'B6', attribute3: 'C6' },
          { id: 7, attribute1: 'A7', attribute2: 'B7', attribute3: 'C7' },
        ],
      },
      { id: 2, attribute1: 'A2', attribute2: 'B2', attribute3: 'C2' },
      { id: 3, attribute1: 'A3', attribute2: 'B3', attribute3: 'C3' },
      { id: 4, attribute1: 'A4', attribute2: 'B4', attribute3: 'C4' },
      { id: 5, attribute1: 'A5', attribute2: 'B5', attribute3: 'C5' },
    ],
    []
  );

  const columns = useMemo(
    () => [
      {
        id: 'expander',
        Header: () => null,
        Cell: ({ row }) => {
          if (row.original.subRows && row.original.subRows.length) {
            return (
              <span {...row.getToggleRowExpandedProps()}>
                {row.isExpanded ? '👇' : '➡️'}
              </span>
            );
          } else {
            return null;
          }
        },
      },
      { Header: 'Attribute 1', accessor: 'attribute1' },
      { Header: 'Attribute 2', accessor: 'attribute2' },
      { Header: 'Attribute 3', accessor: 'attribute3' },
    ],
    []
  );  

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { expanded },
  } = useTable(
    {
      columns,
      data,
      initialState: {
        expanded: {},
      },
    },
    useExpanded
  );

  const [trueRow, setTrueRow] = useState({
    attribute1: null,
    attribute2: null,
    attribute3: null,
  });
  const [masterRow, setMasterRow] = useState({});

  const selectCell = (columnId, value) => {
    setTrueRow((prevTrueRow) => {
      if (prevTrueRow[columnId] === value) {
        // Remove the value from the true row and unhighlight the cell
        return { ...prevTrueRow, [columnId]: null };
      } else {
        // Add the value to the true row and highlight the cell
        return { ...prevTrueRow, [columnId]: value };
      }
    });
  };
  

  const saveTrueRow = () => {
    const updatedMasterRow = { ...masterRow };
  
    Object.keys(trueRow).forEach((key) => {
      if (trueRow[key] !== undefined && trueRow[key] !== null) {
        updatedMasterRow[key] = trueRow[key];
      }
    });
  
    setMasterRow(updatedMasterRow);
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
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            <th></th>
            {headerGroup.headers
              .filter((column) => column.id !== 'expander')
              .map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
          </tr>
        ))}
      </thead>
      <tbody>
        <tr>
          <td></td> {/* Add an empty cell for the expander column */}
          {Object.entries(masterRow).map(([key, value]) => (
            <td key={key}>{value}</td>
          ))}
        </tr>
      </tbody>
    </table>
    <h2>Changes to be applied</h2>
    <table className="table">
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            <th></th>
            {headerGroup.headers
              .filter((column) => column.id !== 'expander')
              .map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
          </tr>
        ))}
      </thead>
      <tbody>
        <tr>
          <td></td> {/* Add an empty cell for the expander column */}
          {columns
            .filter((column) => column.id !== 'expander')
            .map((column) => (
              <td key={column.accessor}>{trueRow[column.accessor]}</td>
            ))}
        </tr>
      </tbody>
    </table>
      <h2>Data Rows</h2>
      <table className="table" {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          const rowProps = row.getRowProps();
          return (
            <React.Fragment key={rowProps.key}>
              <tr {...rowProps}>
                {row.cells.map((cell) => {
                  const isExpander = cell.column.id === 'expander';
                  const isSelected = trueRow[cell.column.id] === cell.value;
                  return (
                    <td
                      {...cell.getCellProps()}
                      onClick={() => {
                        if (!isExpander) {
                          selectCell(cell.column.id, cell.value);
                        }
                      }}
                      className={isSelected && !isExpander ? 'selected' : ''}
                    >
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
      <button onClick={saveTrueRow}>Save</button>
      <button onClick={clearTrueRow}>Clear</button>
    </div>
  );
};

export default DataMerger;