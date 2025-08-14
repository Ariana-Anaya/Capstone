from flask.cli import AppGroup
from .users import seed_users, undo_users
from .songs import seed_songs, undo_songs
from .mixes import seed_mixes, undo_mixes
from .reviews import seed_reviews, undo_reviews
from .mix_songs import seed_mix_songs, undo_mix_songs
from .reactions import seed_reactions, undo_reactions
from .follows import seed_follows, undo_follows

from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, you want to run the seed undo 
        # command, which will  truncate all tables prefixed with 
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        undo_users()
        undo_songs()
        undo_mixes()
        undo_reviews()
        undo_mix_songs()
        undo_reactions()
        undo_follows()
    seed_users()
    seed_songs()
    seed_mixes()
    seed_reviews()
    seed_mix_songs()
    seed_reactions()
    seed_follows()
    # Add other seed functions here


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_follows()
    undo_reactions()
    undo_mix_songs()
    undo_reviews()
    undo_mixes()
    undo_songs()
    undo_users()
    # Add other undo functions here
