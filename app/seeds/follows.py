from app.models import db, Follow, environment, SCHEMA
from sqlalchemy.sql import text

def seed_follows():
    follow1 = Follow(
        follower_id=1,
        followed_id=2
    )
    follow2 = Follow(
        follower_id=2,
        followed_id=1
    )
    follow3 = Follow(
        follower_id=3,
        followed_id=1
    )

    db.session.add(follow1)
    db.session.add(follow2)
    db.session.add(follow3)
    db.session.commit()

def undo_follows():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.follows RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM follows"))
        
    db.session.commit()