from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from textblob import TextBlob
import os

app = Flask(__name__)
CORS(app)

# -----------------------------
# DB file path inside backend folder
# -----------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "project.db")
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{DB_PATH}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# -----------------------------
# Admin credentials (hardcoded)
# -----------------------------
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "admin123"

# -----------------------------
# Models
# -----------------------------
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20), unique=True, nullable=True)
    password_hash = db.Column(db.String(128), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Feedback(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    comment = db.Column(db.Text, nullable=False)
    star_rating = db.Column(db.Integer, nullable=False)
    satisfied_product = db.Column(db.Boolean, nullable=False)
    satisfied_service = db.Column(db.Boolean, nullable=False)
    sentiment = db.Column(db.String(10), nullable=False)

# -----------------------------
# Initialize DB
# -----------------------------
with app.app_context():
    db.create_all()
    print(f"Database created at {DB_PATH}")

# -----------------------------
# Routes
# -----------------------------
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    phone = data.get('phone')
    password = data.get('password')

    if User.query.filter_by(username=username).first():
        return jsonify({"message": "Username already exists"}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({"message": "Email already registered"}), 400

    new_user = User(username=username, email=email, phone=phone)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": f"User {username} signed up successfully"})


@app.route('/signin', methods=['POST'])
def signin():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if username == ADMIN_USERNAME and password == ADMIN_PASSWORD:
        return jsonify({"message": "Admin logged in", "admin": True})

    user = User.query.filter_by(username=username).first()
    if user and user.check_password(password):
        return jsonify({"message": f"User {username} signed in successfully", "admin": False})
    else:
        return jsonify({"message": "Invalid username or password"}), 401


@app.route('/feedback', methods=['POST'])
def feedback():
    data = request.get_json()
    username = data.get('username')
    comment = data.get('comment')
    star_rating = data.get('star_rating')
    satisfied_product = str(data.get('satisfied_product')).lower() in ['true', 'yes', '1']
    satisfied_service = str(data.get('satisfied_service')).lower() in ['true', 'yes', '1']

    if not username or not comment or star_rating is None:
        return jsonify({"message": "All fields are required"}), 400

    try:
        star_rating = int(star_rating)
        if star_rating < 1 or star_rating > 5:
            return jsonify({"message": "Star rating must be between 1 and 5"}), 400
    except ValueError:
        return jsonify({"message": "Star rating must be an integer"}), 400

    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({"message": "User not found"}), 404

    sentiment = "Positive" if TextBlob(comment).sentiment.polarity > 0 else \
                "Negative" if TextBlob(comment).sentiment.polarity < 0 else "Neutral"

    fb = Feedback(
        user_id=user.id,
        comment=comment,
        star_rating=star_rating,
        satisfied_product=satisfied_product,
        satisfied_service=satisfied_service,
        sentiment=sentiment
    )
    db.session.add(fb)
    db.session.commit()

    return jsonify({"message": "Feedback saved successfully"})


# -----------------------------
# Admin Routes
# -----------------------------
@app.route('/admin/users', methods=['GET'])
def get_users():
    users = User.query.all()
    users_list = [
        {"id": u.id, "username": u.username, "email": u.email, "phone": u.phone}
        for u in users
    ]
    return jsonify(users_list)


@app.route('/admin/feedback', methods=['GET'])
def get_feedback():
    feedbacks = Feedback.query.all()
    feedback_list = [
        {
            "id": f.id,
            "user_id": f.user_id,
            "username": User.query.get(f.user_id).username if User.query.get(f.user_id) else "Unknown",
            "comment": f.comment,
            "star_rating": f.star_rating,
            "satisfied_product": f.satisfied_product,
            "satisfied_service": f.satisfied_service,
            "sentiment": f.sentiment
        }
        for f in feedbacks
    ]
    return jsonify(feedback_list)

@app.route("/admin/summary", methods=["GET"])
def admin_summary():
    # Count total users
    total_users = session.query(User).count()
    
    # Count total feedback
    total_feedback = session.query(Feedback).count()
    
    # Count sentiment distribution
    sentiment_counts = session.query(
        Feedback.sentiment, func.count(Feedback.sentiment)
    ).group_by(Feedback.sentiment).all()
    
    sentiment_summary = {"positive": 0, "negative": 0, "neutral": 0}
    for sentiment, count in sentiment_counts:
        sentiment_summary[sentiment] = count

    return jsonify({
        "total_users": total_users,
        "total_feedback": total_feedback,
        "sentiments": sentiment_summary
    })



# -----------------------------
# Run App
# -----------------------------
if __name__ == "__main__":
    app.run(debug=True)
