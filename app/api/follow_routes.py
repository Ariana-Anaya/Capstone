from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import Follow, User, db


follow_routes = Blueprint('follows', __name__)


@follow_routes.route('/<int:user_id>/follows', methods=['POST'])
@login_required
def follow_user(user_id):
    """
    follow other user
    """
    if user_id == current_user.id:
        return jsonify({"message": "You cannot follow yourself"}), 400
        
    user_exist = User.query.get(user_id)
    
    if not user_exist:
        return jsonify({"message": "User couldn't be found"}), 404

    existing_follow = Follow.query.filter(
        Follow.follower_id == current_user.id,
        Follow.followed_id == user_id
    ).first()


    if existing_follow:
        return jsonify({"message": "Already following user"}), 400

    follow = Follow(follower_id=current_user.id, followed_id=user_id)

    try:
        db.session.add(follow)
        db.session.commit()
        return jsonify(follow.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Internal server error"}), 500



@follow_routes.route('/<int:user_id>/unfollow', methods=['DELETE'])
@login_required
def unfollow_user(user_id):
    """
    unfollow other user
    """
    follow = Follow.query.filter(
        Follow.follower_id == current_user.id,
        Follow.followed_id == user_id
    ).first()

    if not follow:
        return jsonify({"message": "Follow not found"}), 404

    
    try:
        db.session.delete(follow)
        db.session.commit()
        return jsonify({"message": "Successfully unfollowed"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Internal server error"}), 500
