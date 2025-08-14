from app.models import db, Song, environment, SCHEMA
from sqlalchemy.sql import text

def seed_songs():
    song1 = Song(
        spotify_uri="spotify:track:1Iw5iLfAwDvS6frI82gMoV",
        title="End of Summer",
        artist="Tame Impala",
        album="",
        type="song",
        image_url="https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_Green.png",
        preview=True
    )
    song2 = Song(
        spotify_uri="spotify:track:0BU7UCDxV2AxK11swhJ9aJ",
        title="Sad Disco",
        artist="flipturn",
        album="Shadowglow",
        type="song",
        image_url="https://f4.bcbits.com/img/a1152060589_16.jpg",
        preview=True
    )
    song3 = Song(
        spotify_uri="spotify:track:71V89tJj9CboDyzncO6ZN2",
        title="Stars Are Blind",
        artist="Paris Hilton",
        album="Paris",
        type="song",
        image_url="https://images.eil.com/large_image/PARIS%5FHILTON_STARS%2BARE%2BBLIND-367014b.jpg",
        preview=True
    )
    song4 = Song(
        spotify_uri="spotify:track:1ZBqJilDGBVYktvlCEo9jC",
        title="Obstacle 1",
        artist="Interpol",
        album="Turn On The Bright Lights",
        type="song",
        image_url="https://upload.wikimedia.org/wikipedia/en/6/68/Interpol_-_Turn_On_The_Bright_Lights.jpg",
        preview=True
    )
    song5 = Song(
        spotify_uri="spotify:track:0WebpqjAhluHB2WREW9x4R",
        title="Hold In, Hold On",
        artist="Kid Bloom",
        album="",
        type="song",
        image_url="https://f4.bcbits.com/img/a0751458764_16.jpg",
        preview=True
    )
    album1 = Song(
        spotify_uri="spotify:album:7dJPDPUi94jA91VxG4vZb3",
        title="Equus Caballus",
        artist="Men I Trust",
        album="",
        type="album",
        image_url="https://f4.bcbits.com/img/a0128806043_16.jpg",
        preview=True
    )

    db.session.add(song1)
    db.session.add(song2)
    db.session.add(song3)
    db.session.add(song4)
    db.session.add(song5)
    db.session.add(album1)
    db.session.commit()
  

def undo_songs():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.songs RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM songs"))
        
    db.session.commit()