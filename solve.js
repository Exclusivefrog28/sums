// const columnSums = [31,23,21,1,6,17,14,37];
// const rowSums = [21,19,14,28,3,24,15,26];

// const matrix = [
//     [5,4,3,4,7,3,9,6],
//     [8,5,8,3,4,3,7,3],
//     [5,9,5,3,8,9,6,4],
//     [9,2,7,6,5,3,3,6],
//     [7,1,9,1,1,1,1,4],
//     [1,8,9,7,8,7,4,6],
//     [1,4,9,2,8,8,8,3],
//     [3,8,4,2,8,7,3,9]
// ];

const solver = (matrix, rowSums, columnSums) => {
    let iterations = 0;
    const column = (matrix, column) => {
        return matrix.map(row => row[column]);
    }

    let columnCombinations = [];
    for (let i = 0; i < columnSums.length; i++) {
        columnCombinations.push(combinations(column(matrix, i), columnSums[i]));
    }
    console.log("Column combinations: ", columnCombinations);

    let rowCombinations = [];
    for (let i = 0; i < rowSums.length; i++) {
        rowCombinations.push(combinations(matrix[i], rowSums[i]));
    }
    console.log("Row combinations: ", rowCombinations);

    const reduceByColumns = () => {
        for (let i = 0; i < columnCombinations.length; ++i) {
            let correctIndices = Array.from(rowSums.keys());
            let incorrectIndices = Array.from(rowSums.keys());
            for (let combination of columnCombinations[i]) {
                correctIndices = correctIndices.filter((element) => combination.includes(element));
                incorrectIndices = incorrectIndices.filter((element) => !combination.includes(element));
            }
            for (let j = 0; j < rowCombinations.length; ++j) {
                const newCombinations = [];
                for (let combination of rowCombinations[j]) {
                    if (correctIndices.includes(j)) {
                        if (combination.includes(i)) newCombinations.push(combination);
                    } else if (incorrectIndices.includes(j) && combination.includes(i)) continue;
                    else newCombinations.push(combination)
                }
                rowCombinations[j] = newCombinations;
            }
        }
    }

    const reduceByRows = () => {
        for (let i = 0; i < rowCombinations.length; ++i) {
            let correctIndices = Array.from(columnSums.keys());
            let incorrectIndices = Array.from(columnSums.keys());
            for (let combination of rowCombinations[i]) {
                correctIndices = correctIndices.filter((element) => combination.includes(element));
                incorrectIndices = incorrectIndices.filter((element) => !combination.includes(element));
            }
            for (let j = 0; j < columnCombinations.length; ++j) {
                const newCombinations = [];
                for (let combination of columnCombinations[j]) {
                    if (correctIndices.includes(j)) {
                        if (combination.includes(i)) newCombinations.push(combination);
                    } else if (incorrectIndices.includes(j) && combination.includes(i)) continue;
                    else newCombinations.push(combination)
                }
                columnCombinations[j] = newCombinations;
            }
        }
    }

    const winCondition = () => {
        for (let combinations of columnCombinations) {
            if (combinations.length !== 1) return false
        }
        for (let combinations of rowCombinations) {
            if (combinations.length !== 1) return false
        }
        return true;
    }

    while (!winCondition() && iterations < 100) {
        reduceByRows();
        console.log("Column combinations: ", columnCombinations);

        reduceByColumns();
        console.log("Row combinations: ", rowCombinations);
        iterations++;
    }

    const transformMatrix = (matrix, rowCombinations) => {
        // Initialize a new matrix with the same dimensions, filled with zeros
        const newMatrix = matrix.map(row => row.map(cell => 0));
    
        // Iterate over each row and column of the matrix
        for (let i = 0; i < matrix.length; ++i) {
            for (let j = 0; j < matrix[i].length; ++j) {
                // If the current cell is part of the solution, copy the value to the new matrix
                if (rowCombinations[i][0].includes(j)) {
                    newMatrix[i][j] = matrix[i][j];
                }
                // Otherwise, the cell is already initialized to 0, representing '□'
            }
        }
    
        return newMatrix;
    };

    if (iterations >= 100) {
        console.log("No solution found");
        return matrix;
    }
    return transformMatrix(matrix, rowCombinations);
}

// console.log("Win condition achieved");
// fancyPrint(matrix, rowCombinations);