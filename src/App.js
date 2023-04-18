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

  const [trueRow, setTrueRow] = useState({});
  const [masterRow, setMasterRow] = useState({});

  const selectCell = (columnId, value) => {
    setTrueRow({ ...trueRow, [columnId]: value });
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
                {row.isExpanded ? (
                  <tr>
                    <td colSpan={columns.length}>
                      <table className="table">
                        <tbody>
                          {row.original.subRows.map((subRow) => (
                            <tr key={subRow.id}>
                              <td></td>
                              {columns.slice(1).map((column) => (
                                <td
                                  key={column.id}
                                  onClick={() => selectCell(column.accessor, subRow[column.accessor])}
                                  className={trueRow[column.accessor] === subRow[column.accessor] ? 'selected' : ''}
                                >
                                  {subRow[column.accessor]}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                ) : null}
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