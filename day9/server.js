const express = require('express');
const app = express();
const PORT = 5000;

const students = [
  { id: 1, name: 'Arjun', age: 21 },
  { id: 2, name: 'Meera', age: 22 },
  { id: 3, name: 'Rahul', age: 23 }
];

app.get('/api/students', (req, res) => {
  res.json(students);
});

app.listen(PORT, () => {
  console.log('Server running on http://localhost:' + PORT);
});
console.log("Hello from Node!");