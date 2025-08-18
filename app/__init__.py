import os
import requests
from flask import Flask, render_template, request, session, redirect, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from flask_wtf.csrf import CSRFProtect, generate_csrf
from flask_login import LoginManager
from .models import db, User, Song
from .api.user_routes import user_routes
from .api.auth_routes import auth_routes
from .api.follow_routes import follow_routes
from .api.mix_routes import mix_routes
from .api.reaction_routes import reaction_routes
from .api.review_routes import review_routes
from .seeds import seed_commands
from .config import Config

app = Flask(__name__, static_folder='../react-vite/dist', static_url_path='/')

# Setup login manager
login = LoginManager(app)
login.login_view = 'auth.unauthorized'


@login.user_loader
def load_user(id):
    return User.query.get(int(id))


# Tell flask about our seed commands
app.cli.add_command(seed_commands)

app.config.from_object(Config)
app.register_blueprint(user_routes, url_prefix='/api/users')
app.register_blueprint(auth_routes, url_prefix='/api/auth')
app.register_blueprint(follow_routes, url_prefix='/api/follows')
app.register_blueprint(mix_routes, url_prefix='/api/mixes')
app.register_blueprint(reaction_routes, url_prefix='/api/reactions')
app.register_blueprint(review_routes, url_prefix='/api/reviews')

db.init_app(app)
Migrate(app, db)

# Application Security
CORS(app)


spotify_access_token = None
   
def get_spotify_access_token():
    global spotify_access_token
    if spotify_access_token:
        return spotify_access_token
    auth_url = 'https://accounts.spotify.com/api/token'
    auth_response = requests.post(auth_url, {
        'grant_type': 'client_credentials',
        'client_id' : app.config.get('SPOTIFY_CLIENT_ID'),
        'client_secret' : app.config.get('SPOTIFY_CLIENT_SECRET')
    })

    auth_response.raise_for_status()
    spotify_access_token = auth_response.json()['access_token']
    return spotify_access_token

@app.route('/api/spotify/search')
def spotify_search():
    query = request.args.get('q')
    if not query:
        return jsonify({"error": "Query parameter required"}), 400
        
    access_token = get_spotify_access_token()
    search_url = 'https://api.spotify.com/v1/search'
    headers = {
        'Authorization': f'Bearer {access_token}'
    }
    params = {
        'q': query,
        'type': 'track,album,artist',
        'limit': 6
    }
    search_response = requests.get(search_url, headers=headers, params=params)
    search_response.raise_for_status()

    results = search_response.json()
    return jsonify(results)

        
        



# Since we are deploying with Docker and Flask,
# we won't be using a buildpack when we deploy to Heroku.
# Therefore, we need to make sure that in production any
# request made over http is redirected to https.
# Well.........
@app.before_request
def https_redirect():
    if os.environ.get('FLASK_ENV') == 'production':
        if request.headers.get('X-Forwarded-Proto') == 'http':
            url = request.url.replace('http://', 'https://', 1)
            code = 301
            return redirect(url, code=code)


@app.after_request
def inject_csrf_token(response):
    response.set_cookie(
        'csrf_token',
        generate_csrf(),
        secure=True if os.environ.get('FLASK_ENV') == 'production' else False,
        samesite='Strict' if os.environ.get(
            'FLASK_ENV') == 'production' else None,
        httponly=True)
    return response


@app.route("/api/docs")
def api_help():
    """
    Returns all API routes and their doc strings
    """
    acceptable_methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
    route_list = { rule.rule: [[ method for method in rule.methods if method in acceptable_methods ],
                    app.view_functions[rule.endpoint].__doc__ ]
                    for rule in app.url_map.iter_rules() if rule.endpoint != 'static' }
    return route_list


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def react_root(path):
    """
    This route will direct to the public directory in our
    react builds in the production environment for favicon
    or index.html requests
    """
    if path == 'favicon.ico':
        return app.send_from_directory('public', 'favicon.ico')
    return app.send_static_file('index.html')


@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')
