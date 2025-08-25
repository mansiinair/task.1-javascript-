function findMaxFor(arr) {
    let max = arr[0];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }
    return max;
}

let marks = [45, 67, 89, 34, 92, 56];
console.log("Highest (for):", findMaxFor(marks));
function findMaxWhile(arr) {
    let i = 1;
    let max = arr[0];
    while (i < arr.length) {
        if (arr[i] > max) {
            max = arr[i];
        }
        i++;
    }
    return max;
}

console.log("Highest (while):", findMaxWhile(marks));
function findMaxForEach(arr) {
    let max = arr[0];
    arr.forEach(value => {
        if (value > max) {
            max = value;
        }
    });
    return max;
}

console.log("Highest (forEach):", findMaxForEach(marks));