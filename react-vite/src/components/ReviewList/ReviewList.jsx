import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecentReviews } from '../../redux/reviews';
import { addReviewReaction, removeReactionFromReview } from '../../redux/reactions';
import './ReviewList.css';

function ReviewList() {
  const dispatch = useDispatch();
  const reviews = useSelector(state => state.reviews.allReviews);
  const reactions = useSelector(state => state.reactions.allReactions || {});
  // Object.values(reviews).forEach((review) => {
  //   console.log("Single review object:", review);
  // });

  const [filters, setFilters] = useState({
    title: '',
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
        await dispatch(fetchRecentReviews(filters));
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

 const handleAddReaction = async (reviewId) => {
     const result = await dispatch(addReviewReaction(reviewId, "like"));
     if (result.errors) {
      alert(result.errors.message || "Something went wrong");
  } else if (result.alreadyReacted) {
    alert("You already reacted to this review!");
  }
};

  const reviewList = Object.values(reviews).filter(review => {
    const title = review.song?.title || '';
    const username = review.user.username || '';
    return (
      title.includes(filters.title) &&
      username.includes(filters.username)
    );
  });

  const clearFilters = () => {
    setFilters({
      title: '',
      username: ''
    });
  };

  
  
  return (
    <div className="review-list-container">
      <div className="filters-section">
        <h2>Search Reviews</h2>
        <div className="filters">
          

          <input
            type="text"
            placeholder="Title"
            value={filters.title}
            onChange={(e) => handleFilterChange('title', e.target.value)}
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
                >
                  {review.songId?.imageUrl && (
                    <img 
                      src={review.songId.imageUrl} 
                      alt={review.songId.title}
                      className="review-preview-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                  <div className="review-info">
                    <h3>{review.songId?.title}</h3>
                    <p className="review-artist">{review.songId?.artist}</p>
                      <div className='review-username'>
                      {review.user?.avatarUrl && (
                        <img
                        src={review.user.avatarUrl}
                        alt={review.user.firstName}
                        className='creator-avatar'
                        />
                      )}
                        {review.user?.username}

                      </div>
                      <p className='review-rating'>⭐ {review.rating} / 5</p>
                    <p className='review-text'>{review.review}</p>
                    <div className="review-reactions">
                      <button
                      className='reaction-btn'
                      onClick={() => handleAddReaction(review.id)}
                      >
                        👍 {Object.values(reactions).filter(r => r.reviewId === review.id).length}

                      </button>
                    
                     
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