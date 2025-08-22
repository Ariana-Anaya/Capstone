from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import Reaction, User, Mix, Review, db

reaction_routes = Blueprint('reactions', __name__)

@reaction_routes.route('/review/<int:review_id>', methods=["POST"])
@login_required
def add_reaction_to_review(review_id):
    """
    add a reaction to review
    """
    data = request.get_json()
    reaction_type = data.get('type')
    review = Review.query.get(review_id)
    
    if not review:
        return jsonify({"message": "Review couldn't be found"}), 404
    
    
    existing_reaction = Reaction.query.filter_by(
        user_id=current_user.id,
        review_id=review_id
    ).first()
    
    if existing_reaction:
        return jsonify({"message": "User already has a reaction for this review"}), 400

    reaction = Reaction(
        user_id=current_user.id,
        review_id=review_id,
        type=data.get('type')
    )


    try:
        db.session.add(reaction)
        db.session.commit()
        return jsonify(reaction.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Internal server error"}), 500
    

@reaction_routes.route('/mix/<int:mix_id>', methods=["POST"])
@login_required
def add_reaction_to_mix(mix_id):
    """
    add a reaction to mix
    """
    data = request.get_json()
    reaction_type = data.get('type')

    mix = Mix.query.get(mix_id)
    
    if not mix:
        return jsonify({"message": "Mix couldn't be found"}), 404
    
    
    existing_reaction = Reaction.query.filter(
        Reaction.user_id == current_user.id,
        Reaction.mix_id == mix_id
    ).first()
    
    if existing_reaction:
        return jsonify({"message": "User already has a reaction for this mix"}), 400

    reaction = Reaction(
        user_id=current_user.id,
        mix_id=mix_id,
        type=data.get('type')
    )


    try:
        db.session.add(reaction)
        db.session.commit()
        return jsonify(reaction.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Internal server error"}), 500

@reaction_routes.route('/review/<int:reaction_id>', methods=["DELETE"])
@login_required
def remove_reaction_to_review(reaction_id):
    """
    remove a reaction to review
    """
    reaction = Reaction.query.get(reaction_id)
    
    if not reaction:
        return jsonify({"message": "Reaction couldn't be found"}), 404
    
    if reaction.user_id != current_user.id:
        return jsonify({"message": "Forbidden"}), 403
    
    try:
        db.session.delete(reaction)
        db.session.commit()
        return jsonify({"message": "Successfully deleted"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Internal server error"}), 500


@reaction_routes.route('/mix/<int:reaction_id>', methods=["DELETE"])
@login_required
def remove_like_from_mix(reaction_id):
    """
    remove like from mix
    """
    reaction = Reaction.query.get(reaction_id)
    
    if not reaction:
        return jsonify({"message": "Like not found"}), 404
    
    if reaction.user_id != current_user.id:
        return jsonify({"message": "Forbidden"}), 403
    
    try:
        db.session.delete(reaction)
        db.session.commit()
        return jsonify({"message": "Successfully removed"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Internal server error"}), 500