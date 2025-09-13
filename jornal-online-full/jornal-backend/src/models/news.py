from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class News(db.Model):
    __tablename__ = 'news'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    author = db.Column(db.String(100), nullable=False)
    image_url = db.Column(db.String(500), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'category': self.category,
            'author': self.author,
            'imageUrl': self.image_url,
            'date': self.created_at.strftime('%Y-%m-%d'),
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
    
    @staticmethod
    def from_dict(data):
        return News(
            title=data.get('title'),
            content=data.get('content'),
            category=data.get('category'),
            author=data.get('author'),
            image_url=data.get('imageUrl', '')
        )

