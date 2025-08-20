import { useEffect, useState } from 'react';
import { fetchMixDetails, editMix, addSongToMix, removeSongFromMix } from '../../redux/mixes';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import MixForm from '../MixForm';
import './MixDetails.css';

function MixDetails() {
  const { mixId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const mix = useSelector(state => state.mixes.singleMix[mixId]);
 
  const user = useSelector(state => state.session.user);

const [isEditing, setIsEditing] = useState(false);
const [searchSong, setSearchSong] = useState('');
const [searchResults, setSearchResults] = useState([]);
const [selectedSongs, setSelectedSongs] = useState( mix ? mix.songs || [] : []);
const [loading, setLoading] = useState(false);
const [errors, setErrors] = useState({});


 //const userHasLikes = user && reactions.some(reactions => reactions.userId === user.id);
 const isOwner = user && mix && user.id === mix.userId;

  useEffect(() => {
    dispatch(fetchMixDetails(mixId));
  }, [dispatch, mixId]);



const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchSong(query);
    
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/spotify/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) {
        setErrors({ search: 'Spotify search failed' });
        setSearchResults([]);
        return;

      }
      const data = await res.json();
      setSearchResults(data.tracks.items || []);
    } catch (err) {
      setErrors({ search: 'Spotify search failed' });

    } finally {
      setLoading(false)
    }
  };


  const handleAddSong = async (song) => {
    const payload = {
        spotifyUri: song.uri,
        title: song.name,
        artist: song.artists[0]?.name,
        album: song.album?.name,
        type: song.type || 'song',
        image_url: song.album?.images[0]?.url || null,
      };

    const result = await dispatch(addSongToMix(mixId, payload));
   
    if (!result.errors) {
      dispatch(fetchMixDetails(mixId));
      setSearchSong('');
      setSearchResults([]);
    } else {
      setErrors({ songs: result.errors });
    }
    };

  

  const handleRemoveSong = async (songId) => {
    const result = await dispatch(removeSongFromMix(mixId, songId));
    if (!result.errors) {
      dispatch(fetchMixDetails(mixId));
    } else {
      setErrors({ songs: result.errors });
    }
    };


  const handleEditSubmit = async (updatedMix) => {
    const result = await dispatch(editMix(mixId, updatedMix));
    if (!result.errors) {
        setIsEditing(false);
    }
    return result
  };

 


if (!mix) {
  return <div>Loading...</div>;
} 



const mixData = {

  songs: selectedSongs.map((s) => ({
    spotify_uri: s.uri,
    title: s.name,
    artist: s.artists[0]?.name,
    album: s.album?.name,
    type: s.type || 'song',
    image_url: s.album?.images[0]?.url || null,
  })),
  
};

if(mixData.songs.length === 0) delete mixData.songs;


  return (
    <div className="mix-details-container">
      <div className="mix-header">
          {mix.coverUrl && ( < img
            src={mix.coverUrl}
            alt={`${mix.title} Cover`}
            className="mix-cover-image"
            />
          )}
          <div className="mix-info">
            <h1>{mix.title}</h1>
            <p>{mix.description}</p>
            {mix.username && (
             <div className="mix-creator">
              {mix.avatarUrl && (
              <img
                src={mix.avatarUrl}
                alt={`${mix.username} avatar`}
                className="creator-avatar"
               />
               )}
               <span>{mix.username}</span>
               </div>
            )}
            {isOwner && (
                <button
                className='edit-mix-btn'
                onClick={() => setIsEditing(true)}
               >
                Edit Mix Details
               </button>
            )}
            </div>
           </div>

          <div className='song-list-container'>
            <h3>Songs</h3>
            {mix.mixsongs && mix.mixsongs.length > 0 ? (
                <ul className='song-list'>
                {mix.mixsongs.map((song) => (
                    <li key={song.id} className='song-object'>
                        {song.imageUrl && (
                            <img
                            src={song.imageUrl}
                            alt={song.title}
                            className='song-cover'
                            />
                        )}
                        <div className='song-info'>
                            <span className='song-title'>{song.title}</span>
                            <span className='song-artist'>{song.artist}</span>
                        </div>
                        {isOwner && ( 
                          <button
                          className='remove-song-btn'
                          onClick={() => handleRemoveSong(song.id)}
                          >
                            ×
                            </button>
                        )}
                        </li>
                     ))}
                </ul>
               ) : (
                 <p>No songs in this mix yet</p>

                        )}

<div className="form-group">
            <label>Search 🔍</label>
            <div className="song-search">
                <input
                  id="spotifySearch"
                  type="text"
                  value={searchSong}
                  onChange={handleSearchChange}
                  placeholder='Search Song/Album'
                />
                       
             

          {searchResults.length > 0 && (
            <ul className='search-results'>
              {searchResults.map((song) => (
                <li key={song.id}>
                  {song.name} - {song.artists[0]?.name}
                  <button
                  type='button'
                  onClick={() => handleAddSong(song)}
                  >Add</button>
                </li>
              ))}
            </ul>
          )}
            {errors.songs && <p className="error">{errors.songs}</p>}
          </div>
          </div>
          
          {selectedSongs.length > 0 && (
            <div className="selected-song-list">
            {selectedSongs.map((song) => (
                <div key={song.id} className="selected-song-item">
                {song.name} - {song.artists[0]?.name}
                <button
                type="button"
                className="remove"
                onClick={() => handleRemoveSong(song.id)}
                >
                ×
                </button>
                </div>

            ))}
            </div>
          )}
                        </div>
                        {isEditing && (
                            <MixForm
                            mix={mix}
                            onClose={() => setIsEditing(false)}
                            onSubmit={handleEditSubmit}
                            />
                        )}
                        </div>
                );
            }        
            
export default MixDetails;