from app.models import db, Mix, environment, SCHEMA
from sqlalchemy.sql import text

def seed_mixes():
    mix1 = Mix(
        user_id=3,
        title="Demo Mix",
        description="Basic Songs for Basic Taste"
    )
    mix2 = Mix(
        user_id=1,
        title="Songs for Katie",
        description="Songs that make me think of you :)"
    )
    mix3 = Mix(
        user_id=2,
        title="Country songs I pretend I dont like",
        description="if you find this... no you didnt"
    )

    db.session.add(mix1)
    db.session.add(mix2)
    db.session.add(mix3)
    db.session.commit()

def undo_mixes():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.mixes RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM mixes"))
        
    db.session.commit()