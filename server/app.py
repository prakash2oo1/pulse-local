from flask import Flask, request, jsonify
import sqlite3
from sentiment_analysis import analyze_sentiment
from topic_modeling import cluster_topics

app = Flask(__name__)

# Initialize database
def init_database():
    conn = sqlite3.connect('submissions.db', check_same_thread=False)
    c = conn.cursor()
    c.execute('''
    CREATE TABLE IF NOT EXISTS submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        text TEXT,
        latitude REAL,
        longitude REAL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    conn.commit()
    return conn, c

conn, c = init_database()

@app.route('/submissions', methods=['POST'])
def handle_submission():
    """Handle a new submission."""
    data = request.json
    text = data.get('text')
    latitude = data.get('latitude')
    longitude = data.get('longitude')

    if not text or latitude is None or longitude is None:
        return jsonify({'error': 'Invalid submission data'}), 400

    # Save submission
    c.execute('INSERT INTO submissions (text, latitude, longitude) VALUES (?, ?, ?)',
              (text, latitude, longitude))
    conn.commit()

    # Analyze sentiment
    sentiment = analyze_sentiment(text)

    return jsonify({'id': c.lastrowid, 'sentiment': sentiment}), 201

@app.route('/clusters', methods=['GET'])
def get_clusters():
    """Get topic clusters."""
    c.execute('SELECT text FROM submissions')
    submissions = c.fetchall()
    texts = [row[0] for row in submissions]

    # Cluster topics
    clusters = cluster_topics(texts)

    return jsonify(clusters)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
