import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchSongReviews } from '../../redux/reviews';
import { addReviewReaction, removeReactionFromReview } from '../../redux/reactions';
import './SongReviews.css';

function SongReviews() {
  const { songId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const reviewsObj = useSelector(state => state.reviews.songReviews[songId] || {});
  const reviews = Object.values(reviewsObj);
  const reactions = useSelector(state => state.reactions.allReactions || {});
  const user = useSelector(state => state.session.user);
  const song = reviews.length > 0 ? reviews[0].songId : null; 

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reactionTypes = [
    { type: 'like', emoji: '👍' },
    { type: 'laugh', emoji: '😂' },
    { type: 'hot_take', emoji: '🤔' },
    { type: 'nah', emoji: '🚩' },
  ];

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);
        await dispatch(fetchSongReviews(songId));
      } catch (err) {
        setError('Failed to load reviews.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [dispatch, songId]);

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

  const calculateAverageRating = () => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  if (loading) return <p>Loading reviews...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="review-songs-container">
      {song && (
        <div className="song-header">
          <img src={song.imageUrl} alt={song.title} className="song-header-image" />
          <div className="song-header-info">
            <h1>{song.title}</h1>
            <h3>{song.artist}</h3>
            <p>Average Rating: ★ {calculateAverageRating()} / 5</p>
          </div>
        </div>
      )}

      <div className="reviews-feed">
        {reviews.length === 0 ? (
          <p>No reviews yet for this song/album.</p>
        ) : (
          reviews.map(review => {
            return (
              <div key={review.id} className="review-card">
                <div className="review-user">
                  {review.user?.avatarUrl && (
                    <img
                      src={review.user.avatarUrl}
                      alt={review.user.username}
                      className="review-avatar"
                      onClick={() => navigate(`/profile/${review.userId}`)}
                      style={{ cursor: 'pointer' }} 
                    />
                  )}
                  <span className="review-username"
                  onClick={() => navigate(`/profile/${review.userId}`)}
                  style={{ cursor: 'pointer' }} 
                  >
                  {review.user?.username}
                  </span>
                </div>

                <div className="review-content">
                  <span className="review-rating">★ {review.rating} / 5</span>
                  <p>{review.review}</p>
                </div>

                <div className="review-reactions">
                  {reactionTypes.map(({ type, emoji }) => {
                    const count = Object.values(reactions).filter(
                      r => r.reviewId === review.id && r.type === type
                    ).length;

                    const reacted = Object.values(reactions).some(
                      r => r.reviewId === review.id && r.type === type && r.userId === user?.id
                    );

                    return (
                      <button
                        key={type}
                        className={`review-reaction-button ${reacted ? 'reacted' : ''}`}
                        onClick={() => handleToggleReaction(review.id, type)}
                      >
                        {emoji} {count}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default SongReviews;
