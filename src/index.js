
window.loadData = (json) => {


const data = JSON.parse(json);

const tableHeader = document.getElementById('table-header');
const tableBody = document.getElementById('table-body');

// Parse and flatten the data structure for table rendering
function processData(data) {
    let columns = new Set();
    const rows = [];

    data.forEach(record => {
        const row = {};

        // Process fieldData
        Object.entries(record.fieldData).forEach(([key, value]) => {
            if (key !== 'modId' && key !== 'recordId') {
                columns.add(key);
                row[key] = value;
            }
        });

        // Process portalData
        ['Employee.Discipline', 'Employee.EmpCert', 'Employee.Position', 'Employee.EmailPhone'].forEach(portal => {
            if (record.portalData[portal]) {
                record.portalData[portal].forEach((entry, index) => {
                    Object.entries(entry).forEach(([key, value]) => {
                        if (key !== 'modId' && key !== 'recordId') {
                            const columnKey = `${portal.replace('Employee.', '')} ${key} ${index + 1}`;
                            columns.add(columnKey);
                            row[columnKey] = value;
                        }
                    });
                });
            }
        });

        rows.push(row);
    });

    return { columns: Array.from(columns), rows };
}

const { columns, rows } = processData(data);

// Render table header
columns.forEach(column => {
    const th = document.createElement('th');
    th.textContent = column.replace(/.*::/, '');
    tableHeader.appendChild(th);
});

// Render table rows
rows.forEach(row => {
    const tr = document.createElement('tr');
    columns.forEach(column => {
        const td = document.createElement('td');
        td.textContent = row[column] || '';
        tr.appendChild(td);
    });
    tableBody.appendChild(tr);
});

        // Export table data to CSV
        function exportToCSV() {
            const csvRows = [];

            // Add header row
            csvRows.push(columns.map(column => column.replace(/.*::/, '')).join(','));

            // Add data rows
            rows.forEach(row => {
                const values = columns.map(column => {
                    const value = row[column] || '';
                    return `"${value}"`; // Escape values for CSV
                });
                csvRows.push(values.join(','));
            });

            const csvContent = csvRows.join('\n');

            FileMaker.PerformScriptWithOption(
                "ExportCSV",
                csvContent,
                "0"
            );
        }

        document.getElementById('export-button').addEventListener('click', exportToCSV);
};