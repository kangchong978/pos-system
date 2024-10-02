import React, { useState } from 'react';

interface TableRow {
    [key: string]: string; // Allows for dynamic column keys (e.g., S, M, L, XL, etc.)
}


interface EditableTableProps {
    defaultColumns: string[]
    defaultData: TableRow[]
}



const EditableTable: React.FC<EditableTableProps> = ({ defaultColumns, defaultData }) => {
    const [columns, setColumns] = useState<string[]>(defaultColumns);
    const [rows, setRows] = useState<TableRow[]>(
        defaultData
        // [{ column: 'Price', S: '+10', M: '+20', L: '+30', XL: '+40' }]
    );

    const handleInputChange = (e: React.FocusEvent<HTMLTableCellElement>, rowIndex: number, columnName: string) => {
        const newRows = [...rows];
        newRows[rowIndex][columnName] = e.target.innerText;
        setRows(newRows);
    };

    const handleHeaderChange = (e: React.FocusEvent<HTMLTableCellElement>, colIndex: number) => {
        const newColumns = [...columns];
        newColumns[colIndex] = e.target.innerText;
        setColumns(newColumns);
    };

    const addColumn = () => {
        const newColumn = `Column ${columns.length + 1}`;
        setColumns([...columns, newColumn]);
        setRows(rows.map(row => ({ ...row, [newColumn]: '' })));
    };

    const removeColumn = (colIndex: number) => {
        const newColumns = columns.filter((_, index) => index !== colIndex);
        const newRows = rows.map(row => {
            const newRow = { ...row };
            delete newRow[columns[colIndex]];
            return newRow;
        });
        setColumns(newColumns);
        setRows(newRows);
    };

    const addRow = () => {
        const newRow: TableRow = { column: `Row ${rows.length + 1}` };
        columns.forEach(column => {
            newRow[column] = '';
        });
        setRows([...rows, newRow]);
    };

    const removeRow = (rowIndex: number) => {
        const newRows = rows.filter((_, index) => index !== rowIndex);
        setRows(newRows);
    };

    return (
        <div>
            <button onClick={addRow}>Add Row</button>
            <button onClick={addColumn}>Add Column</button>

            <div style={{ overflowX: 'auto' }}>
                <table className="border-collapse border border-black">
                    <thead>
                        <tr>
                            <th className="border border-black"> </th>
                            {columns.map((col, colIndex) => (
                                <th
                                    key={colIndex}
                                    className="border border-black"
                                    contentEditable={true}
                                    onBlur={(e) => handleHeaderChange(e, colIndex)}
                                >
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                <th className="border border-black">
                                    {row.column}
                                    {/* <button onClick={() => removeRow(rowIndex)}>❌</button> */}
                                </th>
                                {columns.map((col, colIndex) => (
                                    <td
                                        key={colIndex}
                                        className="border border-black"
                                        contentEditable={true}
                                        onBlur={(e) => handleInputChange(e, rowIndex, col)}
                                    >
                                        {row[col]}
                                    </td>

                                ))}

                            </tr>

                        ))}

                        <td></td>
                        {columns.map((col, colIndex) => (
                            <td>
                                <button onClick={() => { removeColumn(colIndex) }}>x</button>
                            </td>
                        ))}


                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EditableTable;
