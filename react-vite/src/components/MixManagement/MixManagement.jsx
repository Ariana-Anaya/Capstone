//myMixespage
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchMyMixes, removeMix } from '../../redux/mixes';
import './MixManagement.css';

function MixManagement() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userMixes = useSelector(state => state.mixes.userMixes);
  const user = useSelector(state => state.session.user);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const loadUserMixes = async () => {
      try {
        await dispatch(fetchMyMixes());
      } catch (error) {
        console.error('Error loading user mixes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserMixes();
  }, [dispatch, user, navigate]);

  const handleDeleteMix = async (mixId) => {
    try {
      await dispatch(removeMix(mixId));
      setDeleteModal(null);
    } catch (error) {
      console.error('Error deleting mix:', error);
    }
  };

  const mixList = Object.values(userMixes || {});

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="mixes-management-container">
        <div className="loading-container">
          <p>Loading your mixes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mixes-management-container">
      <div className="management-header">
        <h1>My Mixes</h1>
        <p>Manage and view your mixes </p>
        <button 
          className="btn-primary"
          onClick={() => navigate('/mix/new')}
        >
          ➕ Add New Mix
        </button>
      </div>

      {mixList.length === 0 ? (
        <div className="no-mixes">
          <div className="no-mixes-content">
            <h3>No mixes yet</h3>
            <p>Share your music finds with the community by adding your first mix.</p>
            <button 
              className="btn-primary"
              onClick={() => navigate('/mixes/new')}
            >
              Add Your First Mix
            </button>
          </div>
        </div>
      ) : (
        <div className="mixes-grid">
          {mixList.map(mix => (
            <div key={mix.id} className="mix-management-card">
              {mix.coverUrl && (
                <img 
                  src={mix.coverUrl} 
                  alt={mix.name}
                  className="mix-card-image"
                />
              )}
              
              <div className="mix-card-content">
                <h3>{mix.name}</h3>
                                
               

                <div className="mix-actions">
                  <button 
                    className="btn-view"
                    onClick={() => navigate(`/mixes/${mix.id}`)}
                  >
                    View Details
                  </button>
                  
                  <button 
                    className="btn-delete"
                    onClick={() => setDeleteModal(mix)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteModal && (
        <div className="modal-overlay" onClick={() => setDeleteModal(null)}>
          <div className="delete-modal" onClick={e => e.stopPropagation()}>
            <h3>Delete Mix</h3>
            <p>
              Are you sure you want to delete "{deleteModal.name}"? 
              This action cannot be undone.
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
                onClick={() => handleDeleteMix(deleteModal.id)}
              >
                Delete Mix
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MixManagement;