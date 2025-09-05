import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecentReviews } from '../../redux/reviews';
import { useNavigate } from 'react-router-dom';
import { addReviewReaction, removeReactionFromReview } from '../../redux/reactions';
import './ReviewList.css';

function ReviewList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reviews = useSelector(state => state.reviews.allReviews);
  const reactions = useSelector(state => state.reactions.allReactions || {});
  const user = useSelector(state => state.session.user);

  // Object.values(reviews).forEach((review) => {
  //   console.log("Single review object:", review);
  // });
 
  const [filters, setFilters] = useState({
    title: '',
    username: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reactionTypes =  [
    { type: 'like', emoji: '👍' },
    { type: 'laugh', emoji: '😂' },
    { type: 'hot_take', emoji: '🤔' },
    { type: 'nah', emoji: '🚩' },
  ];

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

  const handleToggleReaction = async (reviewId, type) => {
    if (!user) {
      navigate('/login');
      return;
    }

    const existingReaction = Object.values(reactions).find(
      r => r.reviewId === reviewId && r.type === type && r.userId === user.id
    );

    if (existingReaction) {
      await dispatch(removeReactionFromReview(existingReaction.id));
    } else {
      await dispatch(addReviewReaction(reviewId, type));
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
  
                <div key={review.id} className="reviewfeed-card">
  
                  {review.songId?.imageUrl && (
                    <img
                      src={review.songId.imageUrl} 
                      alt={review.songId?.title}
                      className="reviewfeed-image"
                    />
                  )}
  
                  <div className="reviewfeed-content">
  
                    <div className="reviewfeed-header">
                      <h3 className="reviewfeed-title">{review.songId?.title}</h3>
                      <span className="reviewfeed-artist">{review.songId?.artist}</span>
                    </div>
  
                    <div className="reviewfeed-user">
                      {review.user?.avatarUrl && (
                        <img
                          src={review.user.avatarUrl}
                          alt={review.user.username}
                          className="reviewfeed-avatar"
                          onClick={ (e) => {
                            e.stopPropagation();
                            navigate(`/profile/${review.userId}`);
                          }}
                          style={{ cursor: 'pointer' }}
                        />
                      )}
                      <span className="reviewfeed-username">{review.user?.username}</span>
  
                      <span className="reviewfeed-rating">
                      <span className="star">★</span> {review.rating} / 5
                    </span>                    
                    </div>
  
                      <p className="reviewfeed-text">{review.review}</p>
    
                      <div className="reviewfeed-reactions">
                      {reactionTypes.map(({ type, emoji }) => {
                        const count = Object.values(reactions).filter(
                          r => r.reviewId === review.id && r.type === type
                        ).length;

                        const reacted =  Object.values(reactions).some(r => r.reviewId === review.id && r.type === type && r.userId === user?.id
                        );
                        return (
                        <button
                            key={type}
                            className={`reviewfeed-reaction ${reacted ? 'reacted' : ''}`}
                            onClick={() => handleToggleReaction(review.id, type)}
                          >
                            {emoji} {count}
                    </button>
                      );
                    })}
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