//reviewform.jsx

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createReview } from '../../redux/reviews';
import { useNavigate } from 'react-router-dom';

import './ReviewForm.css';

function ReviewForm({ onClose, review = null, onSubmit = null }) {
  const dispatch = useDispatch();
  const [searchSong, setSearchSong] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [reviewText, setReviewText] = useState(review ? review.review : '');
  const [rating, setRating] = useState(review ? review.rating : 0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();



  const isEdit = !!review;


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

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate('/reviews/manage')
    }
  }; 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);  

    if (!isEdit && !selectedSong) {
      setErrors({ song: 'Song/ Album selection is required' });
      setIsSubmitting(false);
      return;
    }
  
    if (!reviewText.trim()) {
      setErrors({ review: 'Review text is required' });
      setIsSubmitting(false);
      return;
    }

    if (rating < 1 || rating > 5) {
      setErrors({ rating: 'Please select a rating' });
      setIsSubmitting(false);
      return;
    }

  let reviewData;

  if (isEdit) {
    reviewData = {
      review: reviewText,
      rating: rating,
    };
  } else {

    reviewData = {
      spotify_uri: selectedSong.uri,
      title: selectedSong.name,
      artist: selectedSong.artists[0]?.name,
      album: selectedSong.album?.name,
      image_url: selectedSong.album?.images[0]?.url,
      review: reviewText,
      rating: rating
    };
  }

    try {
      let result;
      if (isEdit && onSubmit) {
        result = await onSubmit(reviewData);
      } else {
        result = await dispatch(createReview(reviewData));
      }

      if (result.errors) {
        setErrors(result.errors);
      } else {
        navigate('/reviews/manage')
      }
    } catch (error) {
      setErrors({ general: 'Something went wrong. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStarClick = (rating) => {
    setRating(rating);
  };

  const handleStarHover = (rating) => {
    setHoveredStar(rating);
  };

  const handleStarLeave = () => {
    setHoveredStar(0);
  };

  return (
    <div className="review-form-overlay">
      <div className="review-form-container" onClick={e => e.stopPropagation()}>
        <div className="review-form-header">
          <h2>{isEdit ? 'Edit Review' : 'Write a Review'}</h2>
        </div>

        <form onSubmit={handleSubmit} className="review-form">
        {!isEdit ? ( 
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
            value={selectedSong?.id || ''}
            onChange={(e) => 
              setSelectedSong(searchResults.find((s) => s.id === e.target.value))
            }
            className="form-select"
          >
              <option value="">Select a Song</option>
              {searchResults.map((song) => (
                <option key={song.id} value={song.id}>
                  {song.name} - {song.artists[0].name}
                  </option>
              ))}
            </select>
          )}
            {errors.song && <p className="error">{errors.song}</p>}
          </div>
          </div>
        ) : (
          <div className='form-group song-selected-song-display'>
            <label>Editing Review For:</label>
            <div className='song-spotify'>
              
                <img
                src={review.songId.imageUrl}
                alt={review.songId.title}
                className='song-cover'
                />
              
            </div>
            <p>{review.songId.title}</p>
            <p>{review.songId.artist }</p>
          </div>
          
            )}

          <div className="form-group">
            <label>Rating</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((value) => (
                <span
                  key={value}
                  className={`star ${value <= (hoveredStar || rating) ? 'active' : ''}`}
                  onClick={() => handleStarClick(value)}
                  onMouseEnter={() => handleStarHover(value)}
                  onMouseLeave={handleStarLeave}
                >
                  ★
                </span>
              ))}
            </div>
            {errors.rating && <p className="error">{errors.rating}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="review-text">Review</label>
            <textarea
              id="review-text"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your thoughts..."
              rows="6"
              maxLength="2000"
            />
            <div className="character-count">
              {reviewText.length}/2000 characters
            </div>
            {errors.review && <p className="error">{errors.review}</p>}
          </div>

          {errors.general && <p className="error">{errors.general}</p>}

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="submit-btn">
              {isSubmitting ? 'Submitting...' : (isEdit ? 'Update Review' : 'Post Review')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReviewForm;