import { useEffect, useState } from 'react';
import { fetchMixDetails, editMix } from '../../redux/mixes';
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

  useEffect(() => {
    dispatch(fetchMixDetails(mixId));
  }, [dispatch, mixId]);

  if (!mix) {
    return <div>Loading...</div>;
  }

  //const userHasLikes = user && reactions.some(reactions => reactions.userId === user.id);
  const isOwner = user && mix && user.id === mix.userId;
  
  const handleEditSubmit = async (updatedMix) => {
    const result = await dispatch(editMix(mixId, updatedMix));
    if (!result.errors) {
        setIsEditing(false);
    }
    return result
  };

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
                Edit Mix
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
                        </li>
                     ))}
                </ul>
               ) : (
                 <p>No songs in this mix yet</p>

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