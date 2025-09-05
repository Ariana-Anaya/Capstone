import { useEffect, useState } from 'react';
import { fetchMixDetails } from '../../redux/mixes';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { addMixReaction, removeReactionFromMix } from '../../redux/reactions';
import './MixSongs.css';

function MixSongs() {
  const { mixId } = useParams();
  const dispatch = useDispatch();
  const mix = useSelector(state => state.mixes.singleMix[mixId]);
  const reactions = useSelector(state => state.reactions.allReactions || {});

  const mixReactionsCount = Object.values(reactions).filter(r => r.mixId === mix.id).length;

  const user = useSelector(state => state.session.user);


 const isOwner = user && mix && user.id === mix.userId;

  useEffect(() => {
    dispatch(fetchMixDetails(mixId));
  }, [dispatch, mixId]);


if (!mix) {
  return <div>Loading...</div>;
} 

const existingReaction = Object.values(reactions).find(
  r => r.mixId === mix.id && r.userId === user?.id
);

const handleToggleReaction = async () => {
  if (!user) {
    navigate('/login');
    return;
  }

  if (existingReaction) {
    await dispatch(removeReactionFromMix(existingReaction.id));
  } else {
    await dispatch(addMixReaction(mix.id, 'like'));
  }
};





  return (
    <div className="mix-details-container">
      <div className="mix-header">
          {mix.coverUrl && ( < img
            src={mix.coverUrl}
            alt={`${mix.name} Cover`}
            className="mix-cover-image"
            />
          )}
          <div className="mix-info">
            <h1>{mix.name}</h1>
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
            <button
            className={`reaction-button ${existingReaction ? 'reacted' : ''}`}
            onClick={handleToggleReaction}
          >
            👍 {mixReactionsCount}
          </button>
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
                        </div>
                      
                );
              }
                
            
export default MixSongs;