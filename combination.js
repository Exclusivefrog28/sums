const combinations = (array, sum) => {
    const result = [];

    const f = (accumulator, indices, combination) => {
        let passedIndices = [...indices];
        for (let index of indices) {
            passedIndices = passedIndices.filter(i => i !== index);
            if (accumulator + array[index] === sum) {
                result.push([...combination, index]);
            } else if (accumulator + array[index] < sum) {
                f(accumulator + array[index], passedIndices, [...combination, index])
            }
        }
    }

    f(0, Array.from(array.keys()), []);

    return result;
}