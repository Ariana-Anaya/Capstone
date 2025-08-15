from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import Review, Song, User, db
from sqlalchemy.exc import IntegrityError



review_routes = Blueprint('reviews', __name__)

@review_routes.route('/myreviews')
@login_required
def get_current_user_reviews():
    """
    Get all reviews of current user
    """
    reviews = Review.query.filter(Review.user_id==current_user.id).all()
    
    return jsonify({
        "Reviews": [review.to_dict_with_song_details()for review in reviews]
    })


@review_routes.route('/<int:review_id>')
def get_review_details(review_id):
   """
 Get review by id
    """
    review = Review.query.get(review_id)
    
    if not review:
        return jsonify({"message": "Review couldn't be found"}), 404
    
    return jsonify(review.to_dict_with_song_details())


@review_routes.route('/reviews', methods=['POST'])
@login_required
def create_review():
    """
    Create a review 
    """
    data = request.get_json()
    song_id = data.get('song_id')
    song = Song.query.get(song_id)
    
    if not song:
        return jsonify({"message": "Song couldn't be found"}), 404
    
    
    existing_review = Review.query.filter(
        Review.user_id == current_user.id,
        Review.song_id == song_id
    ).first()
    
    if existing_review:
        return jsonify({"message": "User already has a review for this song"}), 400
    
    
    
    errors = {}
    
    if not data.get('review'):
        errors['review'] = "Review text is required"
    if not data.get('rating') or not isinstance(data.get('rating'), int) or data.get('rating') < 1 or data.get('rating') > 10:
        errors['rating'] = "Rating must be an integer from 1 to 10"
    
    if errors:
        return jsonify({
            "message": "Bad Request",
            "errors": errors
        }), 400
    
    review = Review(
        user_id=current_user.id,
        song_id=song_id,
        review=data['review'],
        rating=data['rating']
    )
    
    try:
        db.session.add(review)
        db.session.commit()
        return jsonify(review.to_dict_with_song_details()), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({"message": "User already has a review for this song"}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Internal server error"}), 500


@review_routes.route('/<int:review_id>', methods=['PUT'])
@login_required
def edit_review(review_id):
    """
    Edit a review
    """
    review = Review.query.get(review_id)
    
    if not review:
        return jsonify({"message": "Review couldn't be found"}), 404
    
    if review.user_id != current_user.id:
        return jsonify({"message": "Forbidden"}), 403
    
    data = request.get_json()
    
    # Validation
    errors = {}
    
    if not data.get('review'):
        errors['review'] = "Review text is required"
    if not data.get('rating') or not isinstance(data.get('rating'), int) or data.get('rating') < 1 or data.get('rating') > 10:
        errors['rating'] = "Rating must be an integer from 1 to 10"
    
    if errors:
        return jsonify({
            "message": "Bad Request",
            "errors": errors
        }), 400
    
    # update rveview
    review.review = data['review']
    review.rating = data['rating']
    
    try:
        db.session.commit()
        return jsonify(review.to_dict_with_song_details())
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Internal server error"}), 500


@review_routes.route('/<int:review_id>', methods=['DELETE'])
@login_required
def delete_review(review_id):
    """
    Delete a review
    """
    review = Review.query.get(review_id)
    
    if not review:
        return jsonify({"message": "Review couldn't be found"}), 404
    
    if review.user_id != current_user.id:
        return jsonify({"message": "Forbidden"}), 403
    
    try:
        db.session.delete(review)
        db.session.commit()
        return jsonify({"message": "Successfully deleted"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Internal server error"}), 500



    