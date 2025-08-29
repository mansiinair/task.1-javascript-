let marks = [50, 60, 70, 80];
let bonusMarks = marks.map(m => m + 5);
console.log("Bonus Marks:", bonusMarks); 
// [55, 65, 75, 85]
let passed = marks.filter(m => m >= 60);
console.log("Passed Students:", passed); 
// [60, 70, 80]
let total = marks.reduce((sum, m) => sum + m, 0);
let average = total / marks.length;
console.log("Total:", total, "Average:", average); 
// Total: 260 Average: 65
let student = {
    name: "Amit",
    age: 20,
    subjects: {
        math: 85,
        science: 90,
        english: 78
    }
};

console.log("Name:", student.name);
console.log("Math Marks:", student.subjects.math);

function calculateMarks(students) {
    students.forEach(student => {
        let marks = Object.values(student.subjects);
        let total = marks.reduce((sum, m) => sum + m, 0);
        let average = total / marks.length;
        
        console.log(`${student.name} â†’ Total: ${total}, Average: ${average.toFixed(2)}`);
    });
}

// Example data
let studentList = [
    { name: "Aishwary", subjects: { math: 85, science: 90, english: 78 } },
    { name: "Mansi", subjects: { math: 72, science: 65, english: 80 } },
    { name: "Arjit", subjects: { math: 60, science: 70, english: 68 } }
];

// Run calculator
calculateMarks(studentList);