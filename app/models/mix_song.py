#mix_song.py
from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class MixSong(db.Model):
    __tablename__ = "mix_songs"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    mix_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("mixes.id")), nullable=False)
    song_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("songs.id")), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    mix = db.relationship("Mix", back_populates="mix_songs")
    song = db.relationship("Song", back_populates="mix_songs")

    def to_dict(self):
        return {
            'id': self.id,
            'mixId': self.mix_id,
            'songId': self.song_id,
            'createdAt': self.created_at,
            'updatedAt': self.updated_at,
        }