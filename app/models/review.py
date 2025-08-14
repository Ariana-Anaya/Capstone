from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime


class Review(db.Model):
    __tablename__ = 'reviews'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    song_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("songs.id")), nullable=False)
    review = db.Column(db.Text, nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = db.relationship("User", back_populates="reviews")
    song = db.relationship("Song", back_populates="reviews")
    reactions = db.relationship("Reaction", back_populates="review", cascade="all, delete-orphan")

    def to_dict(self):
        return{
            'id': self.id,
            'userId': self.user_id,
            'songId': self.song_id,
            'review': self.review,
            'rating': self.rating,
            'createdAt': self.created_at,
            'updatedAt': self.updated_at,
        }



