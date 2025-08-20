//mixform.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { createMix } from '../../redux/mixes';


import './MixForm.css';

function MixForm({ onClose, mix = null, onSubmit = null }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchSong, setSearchSong] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [coverUrl, setCoverUrl] = useState(mix ? mix.coverUrl : '');
  const [selectedSongs, setSelectedSongs] = useState( mix ? mix.songs || [] : []);
  const [description, setDescription] = useState(mix ? mix.description : '');
  const [name, setName] = useState(mix ? mix.name : '');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);


  const isEdit = !!mix;

  

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

  const addSong = (song) => {
    if (!selectedSongs.find((s) => s.id === song.id)) {
        setSelectedSongs([...selectedSongs, song]);
    }
  };

  const removeSong = (songId) => {
    setSelectedSongs(selectedSongs.filter((s) => s.id !== songId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

   
  
    if (!name.trim()) {
      setErrors({ name: 'Mix title is required' });
      setIsSubmitting(false);
      return;
    }

    



    const mixData = {
      title: name,  
      description,
      cover_url: coverUrl || null,
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

    try {
      let result;
      if (isEdit && onSubmit) {
        result = await onSubmit(mixData);
      } else {
        result = await dispatch(createMix(mixData));
      }

      if (result.errors) {
        setErrors(result.errors);
      } else {
        navigate('/mixes/manage')
      }
    } catch (error) {
      setErrors({ general: 'Something went wrong. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };




  return (
    <div className="mix-form-overlay">
      <div className="mix-form-container">
        <div className="mix-form-header">
          <h2>{isEdit ? 'Edit Mix' : 'Create a Mix'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
       <form onSubmit={handleSubmit} className='mix-form'>
        <div className="form-group">
            <label htmlFor="title">Mix Name *</label>
            <input
              type="text"
              id="title"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your mix title"
              maxLength={50}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>


          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your playlist..."
              rows="6"
              maxLength="2000"
            />
            <div className="character-count">
              {description.length}/2000 characters
            </div>
            {errors.description && <p className="error">{errors.description}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="cover_url">Cover Image</label>
            <input
              type="text"
              id="cover_url"
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              placeholder="Enter url for cover image"
              maxLength={255}
            />
            {errors.cover_url && <span className="error-text">{errors.cover_url}</span>}
          </div>

          {errors.general && <p className="error">{errors.general}</p>}
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
            <select
            value=''
            onChange={(e) => {
              const song = searchResults.find((s) => s.id === e.target.value);
              if (song) {
                addSong(song);
                setSearchSong('');
                setSearchResults([]);
              }
            }}
            className="form-select"
          >
              <option value="">Add Songs</option>
              {searchResults.map((song) => (
                <option key={song.id} value={song.id}>
                  {song.name} - {song.artists[0]?.name}
                  </option>
              ))}
            </select>
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
                onClick={() => removeSong(song.id)}
                >
                ×
                </button>
                </div>

            ))}
            </div>
          )}


          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="submit-btn">
              {isSubmitting ? 'Submitting...' : (isEdit ? 'Update Mix' : 'Post Mix')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MixForm;