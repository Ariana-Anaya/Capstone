from app.models import db, Mix, environment, SCHEMA
from sqlalchemy.sql import text

def seed_mixes():
    mix1 = Mix(
        user_id=3,
        title="Forever Favorites",
        description="",
        cover_url="https://images.pexels.com/photos/6621701/pexels-photo-6621701.jpeg"
    )
    mix2 = Mix(
        user_id=2,
        title="Love Songs",
        description="Songs that make me think of you :)",
        cover_url="https://images.pexels.com/photos/3944091/pexels-photo-3944091.jpeg"
    )
    mix3 = Mix(
        user_id=1,
        title="Country songs I pretend I dont like",
        description="if you find this... no you didnt",
        cover_url="https://metro.co.uk/wp-content/uploads/2021/10/PRI_206550394-1.jpg"
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