import {combinations} from "./combination.js";

const columnSums = [9, 15, 8, 6, 1];
const rowSums = [2, 6, 16, 7, 8];

const matrix = [
    [2, 2, 5, 2, 1],
    [4, 6, 1, 1, 1],
    [7, 8, 8, 9, 3],
    [5, 7, 2, 2, 7],
    [5, 7, 2, 3, 9]
];

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

while (!winCondition()) {
    reduceByRows();
    console.log("Column combinations: ", columnCombinations);

    reduceByColumns();
    console.log("Row combinations: ", rowCombinations);
}

console.log("Win condition achieved");
for (let i = 0; i < matrix.length; ++i) {
    let row = "";
    for (let j = 0; j < matrix[i].length; ++j) {
        if (rowCombinations[i][0].includes(j)) {
            row += matrix[i][j] + " ";
        } else row += "□ "
    }
    console.log(row)
}