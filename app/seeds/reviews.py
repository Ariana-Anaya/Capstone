from app.models import db, Review, environment, SCHEMA
from sqlalchemy.sql import text

def seed_reviews():
    review1 = Review(
        user_id=1,
        song_id=1,
        review="Its not the tame impala Im used to but I still like it, it definitely grew on me. Minute 3:30-6 is amazing",
        rating=4
    )
    review2 = Review(
        user_id=2,
        song_id=1,
        review="what in the shopping at Zara is this? give me old Tame Impala",
        rating=3
    )
    review3 = Review(
        user_id=3,
        song_id=2,
        review="Sad Disco is so fitting because I really don't know whether to cry or shimmy my shoulders",
        rating=5
    )

    db.session.add(review1)
    db.session.add(review2)
    db.session.add(review3)
    db.session.commit()

def undo_reviews():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.reviews RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM reviews"))
        
    db.session.commit()