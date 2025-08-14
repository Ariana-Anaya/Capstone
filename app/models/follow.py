#follow.py
from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Follow(db.Model):
    __tablename__ = "follows"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    follower_id = db.Column(db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    followed_id = db.Column(db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    follower = db.relationship("User",foreign_keys=[follower_id], back_populates='following')
    followed = db.relationship("User",foreign_keys=[followed_id], back_populates='followers')


    def to_dict(self):
        return {
            'id': self.id,
            'followerId': self.follower_id,
            'followedId': self.followed_id,
            'createdAt': self.created_at,
            'updatedAt': self.updated_at
        }