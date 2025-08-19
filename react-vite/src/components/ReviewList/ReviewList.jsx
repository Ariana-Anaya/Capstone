import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchAllReviews } from '../../redux/reviews';
import './ReviewList.css';

function ReviewList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reviews = useSelector(state => state.reviews.allReviews);
  const [filters, setFilters] = useState({
    song_title: '',
    username: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Debounce the API call to avoid too many requests
    const timeoutId = setTimeout(async () => {
      try {
        setLoading(true);
        setError(null);
        await dispatch(fetchAllReviews(filters));
      } catch (err) {
        setError('Failed to load reviews. Please try again.');
        console.error('Error fetching reviews:', err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [dispatch, filters]);

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      title: '',
      username: ''
    });
  };

  const reviewList = Object.values(reviews);

  return (
    <div className="review-list-container">
      <div className="filters-section">
        <h2>Filter Reviews</h2>
        <div className="filters">
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="">All Filters</option>
           
         
          </select>

          <input
            type="text"
            placeholder="Song"
            value={filters.song_title}
            onChange={(e) => handleFilterChange('Song', e.target.value)}
          />

          <input
            type="text"
            placeholder="Username"
            value={filters.username}
            onChange={(e) => handleFilterChange('username', e.target.value)}
          />
           
          

          <button onClick={clearFilters}>Clear Filters</button>
        </div>
      </div>

      <div className="reviews-section">
        <h1>Discover User Reviews</h1>
        
        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        )}
        
        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading reviews...</p>
          </div>
        )}
        
        {!loading && !error && (
          <div className="review-cards">
            {reviewList.length > 0 ? (
              reviewList.map(review => (
                <div
                  key={review.id}
                  className="review-card"
                  onClick={() => navigate(`/reviews/${review.id}`)}
                >
                  {review.previewImage && (
                    <img 
                      src={review.previewImage} 
                      alt={review.name}
                      className="review-preview-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                  <div className="review-info">
                    <h3>{review.song.title}</h3>
                    <p className="review-title">{review.song_title}</p>
                    <p className="review-username">{review.username}</p>
                    <div className="review-reactions">
                    
                      <span className="reactions-text">
                        {review.numReactions ? review.numReactions.toFixed(1) : 'New'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                <h3>No reviews found</h3>
                <p>Try adjusting your filters or clear them to see all reviews.</p>
                <button onClick={clearFilters} className="btn-primary">
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ReviewList;