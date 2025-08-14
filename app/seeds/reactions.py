from app.models import db, Reaction, environment, SCHEMA
from sqlalchemy.sql import text

def seed_reactions():
    reaction1 = Reaction(
            user_id=1,
            mix_id=1,
            type="like"
    )
    reaction2 = Reaction(
            user_id=2,
            mix_id=2,
            type="dislike"
    )
    reaction3 = Reaction(
            user_id=3,
            review_id=1,
            type="hot take"
    )
    reaction4 = Reaction(
            user_id=3,
            review_id=2,
            type="laugh"
    )
    reaction5 = Reaction(
            user_id=2,
            review_id=3,
            type="like"
    )


   
    db.session.add(reaction1)
    db.session.add(reaction2)
    db.session.add(reaction3)
    db.session.add(reaction4)
    db.session.add(reaction5)
    db.session.commit()

def undo_reactions():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.reactions RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM reactions"))
        
    db.session.commit()