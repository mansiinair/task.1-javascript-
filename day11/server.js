// server.js

// 1. Import all modules and initialize variables
const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// 2. Middleware to parse JSON request bodies and serve static files
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 3. In-memory data store for students
let students = [
  { id: 1, name: 'Alice', age: 20 },
  { id: 2, name: 'Bob', age: 22 },
  { id: 3, name: 'Charlie', age: 21 }
];
let nextId = 4;

// 4. Define all your routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// GET all students (Read)
app.get('/students', (req, res) => {
  res.status(200).json(students);
});

// GET a single student by ID (Read)
app.get('/students/:id', (req, res) => {
  const student = students.find(s => s.id === parseInt(req.params.id));
  if (!student) {
    return res.status(404).send('Student not found.');
  }
  res.status(200).json(student);
});

// POST a new student (Create)
app.post('/students', (req, res) => {
  const { name, age } = req.body;
  if (!name || !age) {
    return res.status(400).send('Name and age are required.');
  }
  const newStudent = {
    id: nextId++,
    name,
    age
  };
  students.push(newStudent);
  res.status(201).json(newStudent);
});

// PUT to update an existing student (Update)
app.put('/students/:id', (req, res) => {
  const student = students.find(s => s.id === parseInt(req.params.id));
  if (!student) {
    return res.status(404).send('Student not found.');
  }
  const { name, age } = req.body;
  if (name) student.name = name;
  if (age) student.age = age;
  res.status(200).json(student);
});

// DELETE a student (Delete)
app.delete('/students/:id', (req, res) => {
  const studentIndex = students.findIndex(s => s.id === parseInt(req.params.id));
  if (studentIndex === -1) {
    return res.status(404).send('Student not found.');
  }
  const deletedStudent = students.splice(studentIndex, 1);
  res.status(200).json(deletedStudent[0]);
});

// 5. Start the server
app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT + "/students");
});