#mixroutes
from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import Mix, MixSong, Song, User, db


mix_routes = Blueprint('mixes', __name__)


@mix_routes.route('/')
def get_all_mixes():
    """
    Get all mixes with optional query filters
    """
    page = request.args.get('page', 1, type=int)
    size = request.args.get('size', 20, type=int)
    username = request.args.get('username', type=str)
    title = request.args.get('title', type=str)
    

    if page < 1:
        return jsonify({
            "message": "Bad Request",
            "errors": {"page": "Page must be greater than or equal to 1"}
        }), 400
    
    if size < 1 or size > 20:
        return jsonify({
            "message": "Bad Request", 
            "errors": {"size": "Size must be between 1 and 20"}
        }), 400

    
    query = Mix.query.join(User)

    if title:
        query = query.filter(Mix.title.ilike(f'%{title}%'))
    
    if username:
        query = query.filter(User.username.ilike(f'%{username}%'))

    mixes = query.all()

    return jsonify({
        "Mixes": [mix.to_dict_user_and_song() for mix in mixes],
        "page": page,
        "size": size
    })

@mix_routes.route('/mymixes')
@login_required
def get_current_user_mixes():
    """
    Get all mixes of current user
    """
    mixes = Mix.query.filter(Mix.user_id==current_user.id).all()
    
    return jsonify({
        "Mixes": [mix.to_dict_user_and_song()for mix in mixes]
    })

@mix_routes.route('/<int:mix_id>')
def get_mix_details(mix_id):
    """
 Get mix by id
    """
    mix = Mix.query.get(mix_id)
    
    if not mix:
        return jsonify({"message": "Mix couldn't be found"}), 404
    
    return jsonify(mix.to_dict_user_and_song())


@mix_routes.route('/', methods=['POST'])
@login_required
def create_mix():
    """
    Create a new mix
    """
    data = request.get_json()
    
    errors = {}
    
    if not data.get('title'):
        errors['title'] = "title  is required"
   
    
    if errors:
        return jsonify({
            "message": "Bad Request",
            "errors": errors
        }), 400
    
    # Create mix
    mix = Mix(
        user_id=current_user.id,
        title=data['title'],
        description=data.get('description',''),
        cover_image=data.get('cover_image', None)
    )
    
    try:
        db.session.add(mix)
        db.session.commit()

        if data.get('songs'):
            for song_data in data['songs']:
                song = Song.query.filter_by(spotify_uri=song_data['spotify_uri']).first()

                if not song:
                    song = Song(
                         spotify_uri=song_data['spotify_uri'],
                         title=song_data['title'],
                         artist=song_data['artist'],
                         album=song_data['album'],
                         type=song_data['type'],
                         image_url=song_data.get('image_url', None),
                         preview_url=song_data.get('preview_url', None)
                    )
                    db.session.add(song)
                    db.session.commit()
                
                mix_song = MixSong(mix_id=mix.id, song_id=song.id)
                db.session.add(mix_song)

            db.session.commit()
            db.session.refresh(mix)
            
        return jsonify(mix.to_dict_user_and_song()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Internal server error"}), 500


@mix_routes.route('/<int:mix_id>', methods=['PUT'])
@login_required
def edit_mix(mix_id):
    """
    Edit a mix
    """
    mix = Mix.query.get(mix_id)
    
    if not mix:
        return jsonify({"message": "Mix couldn't be found"}), 404
    
    if mix.user_id != current_user.id:
        return jsonify({"message": "Forbidden"}), 403
    
    data = request.get_json()

    errors = {}
    
    if not data.get('title'):
        errors['title'] = "Title is required"
   
    
    if errors:
        return jsonify({
            "message": "Bad Request",
            "errors": errors
        }), 400
    
    # update mix
    
    mix.title = data['title']
    mix.description = data.get('discription', mix.discription)
    
    
    try:
        db.session.add(mix)
        db.session.commit()
        return jsonify(mix.to_dict_user_and_song()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Internal server error"}), 500

@mix_routes.route('/<int:mix_id>', methods=['DELETE'])
@login_required
def delete_mix(mix_id):
    """
    Delete a mix
    """
    mix = Mix.query.get(mix_id)
    
    if not mix:
        return jsonify({"message": "Mix couldn't be found"}), 404
    
    if mix.user_id != current_user.id:
        return jsonify({"message": "Forbidden"}), 403
    
    try:
        db.session.delete(mix)
        db.session.commit()
        return jsonify({"message": "Successfully deleted"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Internal server error"}), 500








@mix_routes.route('/<int:mix_id>/songs', methods=['POST'])
@login_required
def add_song_to_mix(mix_id):
    mix = Mix.query.get(mix_id)

    if not mix:
        return jsonify({"message": "Mix couldn't be found"}), 404
    
    if mix.user_id != current_user.id:
        return jsonify({"message": "Forbidden"}), 403

    data = request.get_json()
    spotify_uri = data.get('spotifyUri')

    if not spotify_uri:
            return jsonify({"message": "SpotifyUri required"}), 404

    song = Song.query.filter(Song.spotify_uri == spotify_uri).first()
    if not song:
        song = Song(
            spotify_uri=spotify_uri,
            title=data.get('title'),
            artist=data.get('artist'),
            album=data.get('album'),
            type=data.get('type'),
            image_url=data.get('image_url'),
            preview=data.get('preview', False)
        )
        db.session.add(song)
        db.session.commit()

    existing_song = MixSong.query.filter(
        MixSong.mix_id == mix.id,
        MixSong.song_id == song.id
    ).first()
    
    if existing_song:
        return jsonify({"message": "This song is already in mix"}), 400

    mix_song = MixSong(mix_id=mix.id, song_id=song.id)
    
    try:
        db.session.add(mix_song)
        db.session.commit()
        db.session.refresh(mix)

        return jsonify(mix.to_dict_user_and_song()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Internal server error"}), 500



@mix_routes.route('/<int:mix_id>/songs/<int:song_id>', methods=['DELETE'])
@login_required
def remove_song_to_mix(mix_id,song_id):
    mix = Mix.query.get(mix_id)
    if not mix:
        return jsonify({"message": "Mix couldn't be found"}), 404
    
    if mix.user_id != current_user.id:
        return jsonify({"message": "Forbidden"}), 403

    mix_song = MixSong.query.filter(
        MixSong.mix_id==mix.id,
        MixSong.song_id==song_id
    ).first()
    if not mix_song:
        return jsonify({"message": "Song couldn't be found in mix"}), 404


    try:
        db.session.delete(mix_song)
        db.session.commit()
        db.session.refresh(mix)

        return jsonify(mix.to_dict_user_and_song())

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Internal server error"}), 500
    
@mix_routes.route('/recent')
def get_recent_mixes():
    mixes = Mix.query.order_by(Mix.created_at.desc()).limit(10).all()

    return jsonify({
        "Mixes": [mix.to_dict_user_and_song() for mix in mixes]
    })

