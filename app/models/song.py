#song.py
from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Song(db.Model):
    __tablename__ = "songs"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    spotify_uri = db.Column(db.String(255), nullable=False, unique=True)
    title = db.Column(db.String(50), nullable=False)
    artist = db.Column(db.String(50), nullable=False)
    album = db.Column(db.String(50))
    type = db.Column(db.String(20),nullable=False)
    image_url = db.Column(db.String(255))
    preview = db.Column(db.Boolean, nullable=False, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


    mix_songs = db.relationship("MixSong", back_populates="song")
    reviews = db.relationship("Review", back_populates="song", cascade="all, delete-orphan")


    def to_dict(self):
        return {
            'id': self.id,
            'spotifyUri': self.spotify_uri,
            'title': self. title,
            'artist': self.artist,
            'album': self.album,
            'imageUrl': self.image_url,
            'type': self.type,
            'createdAt': self.created_at,
            'updatedAt': self.updated_at
        }        