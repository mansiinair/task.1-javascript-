const express = require('express');
const app = express();

// Middleware to parse JSON request body
app.use(express.json());

// Sample data: list of students
let students = [
  { id: 1, name: "Mansie", age: 19 },
  { id: 2, name: "Arjit", age: 20 },
  { id: 3, name: "Aishwary", age: 19 }
];

// GET route - return list of students
app.get('/students', (req, res) => {
  res.json(students);
});

// POST route - add a new student
app.post('/students', (req, res) => {
  const newStudent = {
    id: students.length + 1,
    ...req.body
  };
  students.push(newStudent);
  res.status(201).json(newStudent);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
