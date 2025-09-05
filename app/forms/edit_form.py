from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Email, ValidationError, Optional
from app.models import User
from flask_login import current_user

def email_exists(form, field):
    # Checking if email already in db
    email = field.data
    user = User.query.filter(User.email == email).first()
    if user and user.id != current_user.id:

        raise ValidationError('Email address is already in use.')

def username_exists(form, field):
    # Checking if username is already in use
    username = field.data
    user = User.query.filter(User.username == username).first()
    if user and user.id != current_user.id:

        raise ValidationError('Username is already in use.')

class EditForm(FlaskForm):
    username = StringField(
        'username', validators=[DataRequired(), username_exists])
    email = StringField('email', validators=[DataRequired(), email_exists])
    first_name = StringField('first_name', validators=[Optional()])
    last_name = StringField('last_name', validators=[Optional()])
    avatar_url = StringField('avatar_url', validators=[Optional()])
    bio = StringField('bio', validators=[Optional()])