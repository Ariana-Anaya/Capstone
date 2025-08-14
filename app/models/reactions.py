#reactions.oy
from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Reaction(db.Model):
    __tablename__ = "reactions"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    mix_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("mixes.id")), nullable=True)
    review_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("reviews.id")), nullable=True)
    type = db.Column(db.String(20), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = db.relationship("User", back_populates="reactions")
    mix = db.relationship("Mix", back_populates="reactions")
    review = db.relationship("Review", back_populates="reactions")

    def to_dict(self):
        return {
            'id': self.id,
            'userId': self.user_id,
            'mixId': self.mix_id,
            'reviewId': self.review_id,
            'type': self.type,
            'createdAt': self.created_at,
            'updatedAt': self.updated_at
        }
