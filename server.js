const express = require('express');
const path = require('path');
const fs = require('fs');
const notes = require('./db/db.json');
const uuid = require('./db/db.json');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            res.json(JSON.parse(data));
        }
    })
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
});

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add note`);


const { title, text } = req.body;

  if (title && text) {
    
    const newNote = {
      title,
      text,
      note_id: uuid(),
    };

        fs.readFile('./db/db.json', (err, data) => {
            if (err) {
            console.log(err);
            } else {
                const parsedNotes = JSON.parse(data);
                parsedNotes.push(newNote)
                fs.writeFile(
                    './db/db.json', 
                    JSON.stringify(parsedNotes, null, 4), 
                    (writeErr) => {
                    writeErr 
                    ? console.log(writeErr) 
                    : console.log('successfully added note')
                })
            }
        })

        const response = {
            status: 'success',
            body: newNote,
        }

        console.log(response);
        res.status(201).json(response);
        } else {
        res.status(500).json('Error in posting note');
    }
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);