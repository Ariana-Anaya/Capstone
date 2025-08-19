from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import Review, Song, User, db



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


@review_routes.route('', methods=['POST'])
@login_required
def create_review():
    """
    Create a review 
    """
    data = request.get_json()

    spotify_uri = data.get('spotify_uri')
    title = data.get('title')
    artist = data.get('artist')
    album = data.get('album')
    image_url = data.get('image_url')

    song = Song.query.filter_by(spotify_uri=spotify_uri).first()

    
    if not song:
        if not all([spotify_uri, title, artist, album, image_url]):
            return jsonify({"message": "Missing song information"}), 400
    
        song = Song(
            spotify_uri=spotify_uri,
            title=title,
            artist=artist,
            album=album,
            type="track",
            image_url=image_url
        )
        db.session.add(song)
        
        db.session.commit()
       
       
          
    existing_review = Review.query.filter(
        Review.user_id == current_user.id,
        Review.song_id == song.id
    ).first()
    
    if existing_review:
        return jsonify({"message": "User already has a review for this song"}), 400
    
    
    
    errors = {}
    
    if not data.get('review'):
        errors['review'] = "Review text is required"
    if not data.get('rating') or not isinstance(data.get('rating'), int) or data.get('rating') < 1 or data.get('rating') > 5:
        errors['rating'] = "Rating must be an integer from 1 to 5"
    
    if errors:
        return jsonify({
            "message": "Bad Request",
            "errors": errors
        }), 400
    
    review = Review(
        user_id=current_user.id,
        song_id=song.id,
        review=data['review'],
        rating=data['rating']
    )
    
    try:
        db.session.add(review)
        db.session.commit()
        return jsonify(review.to_dict_with_song_details()), 201
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
    if not data.get('rating') or not isinstance(data.get('rating'), int) or data.get('rating') < 1 or data.get('rating') > 5:
        errors['rating'] = "Rating must be an integer from 1 to 5"
    
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



@review_routes.route('/recent')
def get_recent_reviews():
    reviews = Review.query.order_by(Review.created_at.desc()).limit(10).all()

    return jsonify({
        "Reviews": [review.to_dict_with_song_details() for review in reviews]
    })


    