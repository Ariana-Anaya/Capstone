from app.models import db, MixSong, environment, SCHEMA
from sqlalchemy.sql import text

def seed_mix_songs():
    mix_song1 = MixSong(
            mix_id=2,
            song_id=2
    )
    mix_song2 = MixSong(
            mix_id=2,
            song_id=3
    )
    mix_song3 = MixSong(
            mix_id=2,
            song_id=5
    )
    mix_song4 = MixSong(
            mix_id=1,
            song_id=3
    )

   
    db.session.add(mix_song1)
    db.session.add(mix_song2)
    db.session.add(mix_song3)
    db.session.add(mix_song4)
    db.session.commit()

def undo_mix_songs():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.mix_songs RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM mix_songs"))
        
    db.session.commit()