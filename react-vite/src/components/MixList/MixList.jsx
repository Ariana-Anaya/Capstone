import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchAllMixes } from '../../redux/mixes';
import './MixList.css';

function MixList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const mixes = useSelector(state => state.mixes.allMixes);
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
        await dispatch(fetchAllMixes());
      } catch (err) {
        setError('Failed to load mixes. Please try again.');
        console.error('Error fetching mixes:', err);
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

  const mixList = Object.values(mixes).filter(mix => {
    const title = mix.name || '';
    const username = mix.username || '';
    return (
      title.includes(filters.title) &&
      username.includes(filters.username)
    );
  });

  return (
    <div className="mix-list-container">
      <div className="filters-section">
        <h2>Filter Mixes</h2>
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

      <div className="mixes-section">
        <h1>Discover User Mixes</h1>
        
        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        )}
        
        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading mixes...</p>
          </div>
        )}
        
        {!loading && !error && (
          <div className="mix-cards">
            {mixList.length > 0 ? (
              mixList.map(mix => (
                <div
                  key={mix.id}
                  className="mix-card"
                  onClick={() => navigate(`/mixes/${mix.id}`)}
                >
                  {mix.coverUrl && (
                    <img 
                      src={mix.coverUrl} 
                      alt={mix.name}
                      className="mix-preview-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                  <div className="mix-info">
                    <h3>{mix.name}</h3>
                    <div className="mix-username-avatar">
                      {mix.avatarUrl && (
                        <img
                        src={mix.avatarUrl}
                        alt={mix.username}
                        className='creator-avatar'
                        />
                      )}
                      <span>{mix.username}</span>
                      </div>
                      {mix.description && <p className='mix-description'>{mix.description}</p>}
                    <div className="mix-reactions">
                    
                      <span className="reactions-container"></span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                <h3>No mixes found</h3>
                <p>Try adjusting your filters or clear them to see all mixes.</p>
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

export default MixList;