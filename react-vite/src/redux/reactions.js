const ADD_REACTION = 'reactions/ADD_REACTION';
const DELETE_REACTION = 'reactions/DELETE_REACTION';
const LOAD_REACTIONS = 'reactions/LOAD_REACTIONS';

const loadReactions = (reactions) => ({
    type: LOAD_REACTIONS,
    reactions
  });

const addReactionAction = (reaction) => ({
    type: ADD_REACTION,
    reaction
  });

const removeReactionAction = (reactionId) => ({
    type: DELETE_REACTION,
    reactionId
  });



export const fetchMixReactions = (mixId) => async (dispatch) => {
    const response = await fetch(`/api/reactions/mix/${mixId}`);
    if (!response.ok) {
        const data = await response.json();
        dispatch(loadReactions(data.reactions || []));
        return data;
    }
};

export const fetchReviewReactions = (reviewId) => async (dispatch) => {
    const response = await fetch(`/api/reactions/review/${reviewId}`);
    if (!response.ok) {
        const data = await response.json();
        dispatch(loadReactions(data.reactions || []));
        return data;
    }
};

export const addReviewReaction = (reviewId, type) => async (dispatch) => {
    const response = await fetch(`/api/reactions/review/${reviewId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type })
    });
  
    if (response.ok) {
      const reaction = await response.json();
      dispatch(addReactionAction(reaction));
      return reaction;
    } else {
      const errors = await response.json();
      return { errors };
    }
  ;}

  export const addMixReaction = (mixId, type) => async (dispatch) => {
    const response = await fetch(`/api/reactions/mix/${mixId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type })
    });
  
    if (response.ok) {
      const reaction = await response.json();
      dispatch(addReactionAction(reaction));
      return reaction;
    } else {
      const errors = await response.json();
      return { errors };
    }
  ;}

export const removeReactionFromMix = (reactionId) => async (dispatch) => {
  const response = await fetch(`/api/reactions/mix/${reactionId}`, {
    method: 'DELETE',
  });
  
  if (response.ok) {
    dispatch(removeReactionAction(reactionId));
    return { message: 'Song removed' };
  } else {
    const errors = await response.json();
    return errors;
  }
}; 

export const removeReactionFromReview = (reactionId) => async (dispatch) => {
    const response = await fetch(`/api/reactions/review/${reactionId}`, {
      method: 'DELETE',
    });
    
    if (response.ok) {
      dispatch(removeReactionAction(reactionId));
      return { message: 'Song removed' };
    } else {
      const errors = await response.json();
      return errors;
    }
  }; 

const initialState = {
    allReactions: {},
};

const reactionReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_REACTIONS: {
            const newState = { ...state, allReactions: {}};
            action.reactions.forEach(reaction => {
                newState.allReactions[reaction.id] = reaction;

            });
            return newState;
        }
        case ADD_REACTION: {
            return {
                ...state,
                allReactions: {
                    ...state.allReactions,
                    [action.reaction.id]: action.reaction
                }
            };
        }
        case DELETE_REACTION: {
            const newReactions = { ...state.allReactions };
            delete newReactions[action.reactionId];
            return {
                ...state,
                allReactions: newReactions
            };
        }
        default:
            return state;
    }
}

export default reactionReducer;