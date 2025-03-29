const express = require('express');
const path = require('path');
const Database = require('better-sqlite3');

const app = express();
const port = 8000;

// Database setup
const db = new Database('student_records.db');

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    class TEXT NOT NULL,
    contact TEXT
  );
  
  CREATE TABLE IF NOT EXISTS fees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER,
    amount REAL NOT NULL,
    paid BOOLEAN DEFAULT 0,
    due_date TEXT,
    FOREIGN KEY(student_id) REFERENCES students(id)
  );
  
  CREATE TABLE IF NOT EXISTS marks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER,
    subject TEXT NOT NULL,
    score INTEGER NOT NULL,
    FOREIGN KEY(student_id) REFERENCES students(id)
  );
`);

// Middleware
app.use(express.json());
app.use(express.static('public'));

// API Endpoints
// Get all students
app.get('/api/students', (req, res) => {
    try {
        const students = db.prepare('SELECT * FROM students LIMIT 10').all();
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add new student
app.post('/api/students', (req, res) => {
    const { name, class: className, contact } = req.body;
    try {
        const stmt = db.prepare('INSERT INTO students (name, class, contact) VALUES (?, ?, ?)');
        const result = stmt.run(name, className, contact);
        res.json({ 
            id: result.lastInsertRowid,
            message: 'Student added successfully'
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get student fees
app.get('/api/students/:id/fees', (req, res) => {
    const { id } = req.params;
    try {
        const fees = db.prepare(`
            SELECT * FROM fees 
            WHERE student_id = ?
            ORDER BY due_date DESC
        `).all(id);
        res.json(fees);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    console.log(`Access the application at: http://localhost:${port}/index.html`);
});
