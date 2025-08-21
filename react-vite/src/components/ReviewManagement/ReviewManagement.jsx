//myreviewsPage
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchMyReviews, removeReview } from '../../redux/reviews';
import './ReviewManagement.css';

function ReviewManagement() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(state => state.session.user);
  const userReviews = useSelector(state => state.reviews.userReviews);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const loadReviews = async () => {
      try {
        await dispatch(fetchMyReviews());
      } catch (error) {
        console.error('Error loading reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [dispatch, user, navigate]);

  const handleDeleteReview = async (reviewId) => {
    try {
      await dispatch(removeReview(reviewId));
      setDeleteModal(null);
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const reviews = Object.values(userReviews || {});

  if (!user) return null;

  if (loading) {
    return (
      <div className="review-management-container">
        <p>Loading your reviews...</p>
      </div>
    );
  }

  return (
    <div className="review-management-container">
      <div className="management-header">
        <h1>My Reviews</h1>
        <p>Manage and edit your posted reviews</p>
      </div>

      {reviews.length === 0 ? (
        <div className="no-reviews">
          <h3>You haven't written any reviews yet</h3>
          <p>Find a song/album to review and share your opinions.</p>
          <button className="btn-primary" onClick={() => navigate('/review/new')}>
            Explore ...
          </button>
        </div>
      ) : (
        <div className="reviews-grid">
          {reviews.map(review => (
            <div key={review.id} className="review-card">
              {review.songId?.imageUrl && (
                <div className="review-image">
                <img
                src={review.songId.imageUrl}
                alt={review.songId.title}
                className='song-cover'
                />
              </div>
              )}
              
              <div className="review-header">
                <h3>{review.songId?.title}</h3>
                {review.songId?.artist && <p className='review-artist'>{review.songId.artist}</p>}
                
                <span className="review-date">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="review-rating">
                ⭐ {review.rating} / 5
              </div>

              <p className="review-body">
                {review.review}
              </p>

              <div className="review-actions">
                <button 
                  className="btn-edit"
                  onClick={() => navigate(`/reviews/${review.id}/edit`)}
                >
                  Edit
                </button>
                <button 
                  className="btn-delete"
                  onClick={() => setDeleteModal(review)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteModal && (
        <div className="modal-overlay" onClick={() => setDeleteModal(null)}>
          <div className="delete-modal" onClick={e => e.stopPropagation()}>
            <h3>Delete Review</h3>
            <p>
              Are you sure you want to delete your review for 
              "{deleteModal.songTitle || deleteModal.title}"? This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button 
                className="btn-secondary"
                onClick={() => setDeleteModal(null)}
              >
                Cancel
              </button>
              <button 
                className="btn-delete"
                onClick={() => handleDeleteReview(deleteModal.id)}
              >
                Delete Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReviewManagement;
