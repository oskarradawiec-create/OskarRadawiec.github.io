var express = require('express');
var router = express.Router();
var { DatabaseSync } = require('node:sqlite');
var path = require('node:path');

var dbPath = path.resolve(__dirname, '..', 'data.db');
var db = new DatabaseSync(dbPath);

router.get('/', function(req, res, next) {
    try {
        var statement = db.prepare('SELECT * FROM book');
        var books = statement.all();
        res.render('book/index.html.ejs', { books: books });
    } catch (err) {
        next(err);
    }
});

router.get('/create', function(req, res) {
    res.render('book/create.html.ejs', { book: {} });
});

router.post('/create', function(req, res, next) {
    try {
        var title = req.body.title;
        var author = req.body.author;
        var year = req.body.year;
        var statement = db.prepare('INSERT INTO book (title, author, year) VALUES (?, ?, ?)');
        statement.run(title, author, parseInt(year));
        res.redirect('/book');
    } catch (err) {
        next(err);
    }
});

router.get('/:id', function(req, res, next) {
    try {
        var id = parseInt(req.params.id);
        var statement = db.prepare('SELECT * FROM book WHERE id = ?');
        var book = statement.get(id);
        if (!book) {
            return res.status(404).send('Missing book with id ' + id);
        }
        res.render('book/show.html.ejs', { book: book });
    } catch (err) {
        next(err);
    }
});

router.get('/:id/edit', function(req, res, next) {
    try {
        var id = parseInt(req.params.id);
        var statement = db.prepare('SELECT * FROM book WHERE id = ?');
        var book = statement.get(id);
        if (!book) {
            return res.status(404).send('Missing book with id ' + id);
        }
        res.render('book/edit.html.ejs', { book: book });
    } catch (err) {
        next(err);
    }
});

router.post('/:id/edit', function(req, res, next) {
    try {
        var id = parseInt(req.params.id);
        var title = req.body.title;
        var author = req.body.author;
        var year = req.body.year;
        var statement = db.prepare('UPDATE book SET title = ?, author = ?, year = ? WHERE id = ?');
        statement.run(title, author, parseInt(year), id);
        res.redirect('/book');
    } catch (err) {
        next(err);
    }
});

router.post('/:id/delete', function(req, res, next) {
    try {
        var id = parseInt(req.params.id);
        var statement = db.prepare('DELETE FROM book WHERE id = ?');
        statement.run(id);
        res.redirect('/book');
    } catch (err) {
        next(err);
    }
});

module.exports = router;