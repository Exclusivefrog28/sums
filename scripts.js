function generateMatrix() {
    const n = parseInt(document.getElementById('matrix-size').value);
    const container = document.getElementById('matrix-container');
    container.innerHTML = ''; // Clear previous matrix

    const table = document.createElement('table');
    for (let i = 0; i <= n-1; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j <= n-1; j++) {
            const cell = document.createElement('td');
            if (i === 0 && j === 0) {
                cell.innerHTML = ''; // Top-left corner empty
            } else {
                const input = document.createElement('input');
                input.type = 'number';
                cell.appendChild(input);
            }
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    container.appendChild(table);
}

function submitMatrix() {
    const table = document.querySelector('#matrix-container table');
    const rows = table.rows;
    const n = rows.length;
    
    let firstRow = [];
    let firstColumn = [];
    let matrix = [];

    for (let i = 1; i < n; i++) {
        const row = [];
        for (let j = 1; j < n; j++) {
            row.push(parseInt(rows[i].cells[j].querySelector('input').value));
        }
        matrix.push(row);
        firstColumn.push(parseInt(rows[i].cells[0].querySelector('input').value));
    }

    for (let j = 1; j < n; j++) {
        firstRow.push(parseInt(rows[0].cells[j].querySelector('input').value));
    }

    // Here you would send the data to your JavaScript function to process
    // firstRow = [9, 15, 8, 6, 1];
    // firstColumn = [2, 6, 16, 7, 8];
    // matrix = [
    //     [2, 2, 5, 2, 1],
    //     [4, 6, 1, 1, 1],
    //     [7, 8, 8, 9, 3],
    //     [5, 7, 2, 2, 7],
    //     [5, 7, 2, 3, 9]
    // ];
    console.log('First Row:', firstRow);
    console.log('First Column:', firstColumn);
    console.log('Matrix:', matrix);

    // Dummy function call
    let resultMatrix = solver(matrix, firstColumn, firstRow);
    displayResultMatrix(resultMatrix);
}

function displayResultMatrix(matrix) {
    const table = document.getElementById('result-matrix');
    table.innerHTML = ''; // Clear previous results
    matrix.forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(cell => {
            const td = document.createElement('td');
            td.innerText = cell;
            if (cell === 0)
                td.setAttribute('data-bad', true);
            else
                td.setAttribute('data-good', true);
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });
}

function processTextFile() {
    const file = document.getElementById('upload-image').files[0]; // Consider renaming the ID to 'upload-file' for clarity
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const text = e.target.result;
            populateMatrixFromText(text);
        };
        reader.readAsText(file);
    }
}

function populateMatrixFromText(text) {
    // Assuming the text format is as provided, with rows delimited by newlines and values by spaces
    const rows = text.trim().split('\n');
    const matrixSize = rows.length;
    document.getElementById('matrix-size').value = matrixSize;
    generateMatrix();
    const table = document.querySelector('#matrix-container table');
    
    rows.forEach((row, i) => {
        const values = row.trim().split(/\s+/); // Split on one or more spaces
        values.forEach((value, j) => {
            if (i < table.rows.length && j < table.rows[i].cells.length) {
                const cell = table.rows[i].cells[j].querySelector('input');
                if (cell) {
                    cell.value = value;
                }
            }
        });
    });
}