const express = require('express');
const path = require('path');
const app = express();
let db = require('./db.json');
const fs = require('fs');
let id = db.reduce((acc, el) => acc < el.id ? el.id : acc, -1);
console.log(id);

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

const PORT = 5000;

app.use(express.static('assets'));

app.get('/notes', (req,res)=> {
    res.sendFile(path.join(__dirname + '/assets/notes.html'));
});

app.get('/api/notes', (req,res)=> {
    res.send(db);
});

app.post('/api/notes', (req, res)=> {
    const newNote = {...req.body};
    id++;
    newNote.id = id;
    db.push(newNote);
    fs.writeFile('db.json', JSON.stringify(db), function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
    res.send(newNote);
});

app.delete('/api/notes/:id', (req,res)=> {
    let id = parseInt(req.params.id);
    db = db.filter(rec => rec.id !== id);
    fs.writeFile('db.json', JSON.stringify(db), function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
    res.status(200).send();
});

app.listen(PORT, function() {
    console.log(`Server is running on port ${PORT}`);
});
