import React, { useState, useMemo } from 'react';
import './App.css'; // Import the CSS file
import { useTable, useExpanded } from 'react-table';

const DataMerger = () => {
  const data = useMemo(
    () => [
      {
      id: 1,
      saleDate: '2023-04-01',
      salePrice: 350000,
      address: '123 Main St',
      buyer: 'John Doe',
      seller: 'Jane Smith',
      trueBuyer: 'John Doe',
      trueSeller: 'Jane Smith',
      submitter: 'Agent A',
      subRows: [
        {
          id: 6,
          saleDate: '2023-03-15',
          salePrice: 340000,
          address: '123 Main St',
          buyer: 'Jack Brown',
          seller: 'Jane Smith',
          trueBuyer: 'Jack Brown',
          trueSeller: 'Jane Smith',
          submitter: 'Agent B',
        },
        {
          id: 7,
          saleDate: '2023-02-28',
          salePrice: 360000,
          address: '123 Main St',
          buyer: 'John Doe',
          seller: 'Jane Smith',
          trueBuyer: 'John Doe',
          trueSeller: 'Jane Smith',
          submitter: 'Agent A',
        },
      ],
    },
    {
      id: 2,
      saleDate: '2023-03-20',
      salePrice: 450000,
      address: '456 Oak St',
      buyer: 'Tom Jackson',
      seller: 'Sarah Williams',
      trueBuyer: 'Tom Jackson',
      trueSeller: 'Sarah Williams',
      submitter: 'Agent C',
    },
    {
      id: 3,
      saleDate: '2023-03-10',
      salePrice: 500000,
      address: '789 Maple Ave',
      buyer: 'Linda Johnson',
      seller: 'Michael Taylor',
      trueBuyer: 'Linda Johnson',
      trueSeller: 'Michael Taylor',
      submitter: 'Agent D',
    },
    {
      id: 4,
      saleDate: '2023-04-05',
      salePrice: 420000,
      address: '111 Pine St',
      buyer: 'Bob Lee',
      seller: 'Alice Thompson',
      trueBuyer: 'Bob Lee',
      trueSeller: 'Alice Thompson',
      submitter: 'Agent E',
    },
    {
      id: 5,
      saleDate: '2023-03-25',
      salePrice: 390000,
      address: '222 Elm St',
      buyer: 'Alex White',
      seller: 'Elizabeth Moore',
      trueBuyer: 'Alex White',
      trueSeller: 'Elizabeth Moore',
      submitter: 'Agent F',
    },
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
      { Header: 'Sale Date', accessor: 'saleDate' },
      { Header: 'Sale Price', accessor: 'salePrice' },
      { Header: 'Address', accessor: 'address' },
      { Header: 'Buyer', accessor: 'buyer' },
      { Header: 'Seller', accessor: 'seller' },
      { Header: 'True Buyer', accessor: 'trueBuyer' },
      { Header: 'True Seller', accessor: 'trueSeller' },
      { Header: 'Submitter', accessor: 'submitter' },
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
    saleDate: null,
    salePrice: null,
    address: null,
    buyer: null,
    seller: null,
    trueBuyer: null,
    trueSeller: null,
    submitter: null,
  });

  const [masterRow, setMasterRow] = useState({
    saleDate: '2023-03-20',
    salePrice: 450000,
    address: '456 Oak St',
    buyer: 'Tom Jackson',
    seller: 'Sarah Williams',
    trueBuyer: 'Tom Jackson',
    trueSeller: 'Sarah Williams',
    submitter: 'Agent C',
  });

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