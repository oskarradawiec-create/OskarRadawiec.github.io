from flask import Blueprint, render_template, request, redirect, url_for
import sqlite3

main_bp = Blueprint('main', __name__)
book_bp = Blueprint('book', __name__)

@main_bp.route('/')
def index():
    return render_template('index.html', title='My Book Application')

@main_bp.route('/users')
def users():
    return 'respond with a resource'

def get_db():
    conn = sqlite3.connect('data.db')
    conn.row_factory = sqlite3.Row
    return conn

@book_bp.route('/book')
def book_index():
    conn = get_db()
    books = conn.execute('SELECT * FROM book').fetchall()
    conn.close()
    return render_template('book/index.html', books=books)

@book_bp.route('/book/create', methods=['GET', 'POST'])
def create_book():
    if request.method == 'POST':
        conn = get_db()
        conn.execute('INSERT INTO book (title, author, year) VALUES (?, ?, ?)',
                     (request.form['title'], request.form['author'], request.form['year']))
        conn.commit()
        conn.close()
        return redirect(url_for('book.book_index'))
    return render_template('book/create.html', book={})

@book_bp.route('/book/<int:id>')
def show_book(id):
    conn = get_db()
    book = conn.execute('SELECT * FROM book WHERE id = ?', (id,)).fetchone()
    conn.close()
    return render_template('book/show.html', book=book)

@book_bp.route('/book/<int:id>/edit', methods=['GET', 'POST'])
def edit_book(id):
    conn = get_db()
    if request.method == 'POST':
        conn.execute('UPDATE book SET title = ?, author = ?, year = ? WHERE id = ?',
                     (request.form['title'], request.form['author'], request.form['year'], id))
        conn.commit()
        conn.close()
        return redirect(url_for('book.book_index'))
    book = conn.execute('SELECT * FROM book WHERE id = ?', (id,)).fetchone()
    conn.close()
    return render_template('book/edit.html', book=book)

@book_bp.route('/book/<int:id>/delete', methods=['POST'])
def delete_book(id):
    conn = get_db()
    conn.execute('DELETE FROM book WHERE id = ?', (id,))
    conn.commit()
    conn.close()
    return redirect(url_for('book.book_index'))