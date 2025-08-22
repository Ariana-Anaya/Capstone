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
            'numReactions': len(self.reactions) if self.reactions else 0

        }

    def to_dict_with_song_details(self):
        reaction_counts = {}
        for reaction in self.reactions:
            reaction_counts[reaction.type] = reaction_counts.get(reaction.type, 0) + 1

        return{
            'id': self.id,
            'userId': self.user_id,
            'songId': {
                'id': self.song.id,
                'title': self.song.title,
                'artist': self.song.artist,
                'album': self.song.album,
                'type': self.song.type,
                'imageUrl': self.song.image_url
            },
            'review': self.review,
            'rating': self.rating,
            'numReactions': reaction_counts,
            'createdAt': self.created_at,
            'updatedAt': self.updated_at,
            'user': {
                'id': self.user.id,
                'username': self.user.username,
                'avatarUrl': self.user.avatar_url,
            }
        }

