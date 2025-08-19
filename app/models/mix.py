from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime


class Mix(db.Model):
    __tablename__ = 'mixes'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    title = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text, nullable=True)
    cover_url = db.Column(db.String(255), nullable=True)
    preview = db.Column(db.Boolean, nullable=False, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = db.relationship("User", back_populates="mixes")
    mix_songs = db.relationship("MixSong", back_populates="mix", cascade="all, delete-orphan")
    reactions = db.relationship("Reaction", back_populates="mix", cascade="all, delete-orphan")


    def to_dict(self):
        return {
            'id': self.id,
            'userId': self.user_id,
            'title': self.title,
            'description': self.description,
            'coverUrl': self.cover_url,
            'createdAt': self.created_at,
            'updatedAt': self.updated_at,
            'numReactions': len(self.reactions) if self.reactions else 0
        }

    def to_dict_user_and_song(self):
        reaction_counts = {}
        for reaction in self.reactions:
            reaction_counts[reaction.type] = reaction_counts.get(reaction.type, 0) + 1

        return {
            'id': self.id,
            'name': self.title,
            'description': self.description,
            'previewImage': self.cover_url,
            'username': self.user.username,
            'numReactions': reaction_counts,
            'createdAt': self.created_at,
            'updatedAt': self.updated_at,
             'mixsongs': [
                {
                    'id': mix_song.song.id,
                    'title': mix_song.song.title,
                    'artist': mix_song.song.artist,
                    'album': mix_song.song.album,
                    'type': mix_song.song.type,
                    "imageUrl": mix_song.song.image_url
                }
                for mix_song in self.mix_songs
            ]
        }
          