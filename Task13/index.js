require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const notesRouter = require('./routes/notes');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/notes', notesRouter);

app.get('/', (req, res) => res.send('Notes API up 🚀'));
console.log("MONGO_URI is:", process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB connected');
  app.listen(port, () => console.log(`Server running on port ${port}`));
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});
