from flask import Blueprint, jsonify
from flask_login import login_required, current_user
from app.models import User, Mix, Reaction, Follow, Review, db

user_routes = Blueprint('users', __name__)


@user_routes.route('/')
@login_required
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}


@user_routes.route('/<int:id>')
@login_required
def user(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)
    return user.to_dict()

@user_routes.route('/<int:user_id>')
def get_user_details(user_id):
    """
    Get user details
    """
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({"message": "User couldn't be found"}), 404
    
    return jsonify(user.to_dict())


@user_routes.route('/<int:user_id>/reactions')
@login_required
def get_user_reactions(user_id):
    """
    get all reactions by user
    """
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User couldn't be found"}), 404

    if user_id != current_user.id:
        return jsonify({"message": "Forbidden"}), 403
    
    reactions = Reaction.query.filter(Reaction.user_id == user_id).all()

    return jsonify({
        "Reactions": [reaction.to_dict() for reaction in reactions]
    })

@user_routes.route('/<int:user_id>/followers')
@login_required
def get_user_followers(user_id):
    """
    get all followers by user
    """
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User couldn't be found"}), 404

    
    followers = Follow.query.filter(Follow.followed_id == user_id).all()

    return jsonify({
        "count": len(followers),
        "followers": [f.follower.to_dict() for f in followers]
    })

@user_routes.route('/<int:user_id>/following')
@login_required
def get_user_following(user_id):
    """
    get all followed by user
    """
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User couldn't be found"}), 404

    
    
    following = Follow.query.filter(Follow.follower_id == user_id).all()

    return jsonify({
        "count": len(following),

        "following": [f.followed.to_dict() for f in following]
    })



@user_routes.route('/<int:user_id>/reviews')
def get_user_reviews(user_id):
    """
    get all reviews by user
    """
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User couldn't be found"}), 404

    
    reviews = Review.query.filter(Review.user_id == user_id).all()

    return jsonify({
        "Reviews": [review.to_dict_with_song_details() for review in reviews]
    })
    
@user_routes.route('/<int:user_id>/mixes')

def get_user_mixes(user_id):
    """
    get all mixes by user
    """
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User couldn't be found"}), 404

    
    mixes = Mix.query.filter(Mix.user_id == user_id).all()

    return jsonify({
        "Mixes": [mix.to_dict_user_and_song() for mix in mixes]
    })

@user_routes.route('/<int:user_id>/edit', methods=['PUT'])
@login_required

def edit_user(user_id):

    if user_id != current_user.id:
        return jsonify({"message": "Forbidden"}), 403

    form = EditForm(data=request.json)
    if 'csrf_token' in request.cookies:
        form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate():
            current_user.username = form.username.data
            current_user.email = form.email.data
            current_user.first_name = form.first_name.data
            current_user.last_name = form.last_name.data
            current_user.avatar_url = form.avatar_url.data
            current_user.bio = form.bio.data

            db.session.commit()
            return {'user': current_user.to_dict()}

    return {'errors': form.errors}, 400