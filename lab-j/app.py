from flask import Flask, render_template
from routes.routes import main_bp, book_bp

app = Flask(__name__)

app.register_blueprint(main_bp)
app.register_blueprint(book_bp)

@app.errorhandler(404)
def page_not_found(e):
    return render_template('error.html', message="Strona nie istnieje", error=e), 404

@app.errorhandler(500)
def internal_server_error(e):
    return render_template('error.html', message="Wystąpił błąd serwera", error=e), 500

if __name__ == '__main__':
    app.run(debug=True, port=57845)