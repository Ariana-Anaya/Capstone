const LOAD_MIX = 'mixes/LOAD_MIX';
const LOAD_MIX_DETAILS = 'mixes/LOAD_MIX_DETAILS';
const LOAD_MY_MIXES = 'mixes/LOAD_MY_MIXES';
const ADD_MIX = 'mixes/ADD_MIX';
const UPDATE_MIX = 'mixes/UPDATE_MIX';
const DELETE_MIX = 'mixes/DELETE_MIX';
const CLEAR_MIX = 'mixes/CLEAR_MIX';
const LOAD_RECENT_MIXES = 'mixes/LOAD_RECENT_MIXES';
const ADD_SONG_TO_MIX = 'mixes/ADD_SONG_TO_MIX';
const REMOVE_SONG_FROM_MIX = 'mixes/REMOVE_SONG_FROM_MIX';

 

const loadMixes = (mixes, page, size) => ({
  type: LOAD_MIX,
  mixes,
  page,
  size
});

const loadMixDetails = (mix) => ({
  type: LOAD_MIX_DETAILS,
  mix
});

const loadMyMixes = (mixes) => ({
  type: LOAD_MY_MIXES,
  mixes
});



const addMix = (mix) => ({
  type: ADD_MIX,
  mix
});

const updateMix = (mix) => ({
  type: UPDATE_MIX,
  mix
});


const deleteMix = (mixId) => ({
  type: DELETE_MIX,
  mixId
});

const loadRecentMixes = (mixes) => ({
  type: LOAD_RECENT_MIXES,
  mixes
});

const addSongUpdate = (mixId, song) => ({
  type: ADD_SONG_TO_MIX,
  mixId,
  song
});

const removeSongUpdate = (mixId, songId) => ({
  type: REMOVE_SONG_FROM_MIX,
  mixId,
  songId
});

export const clearMix = () => ({
  type: CLEAR_MIX,
});


export const fetchAllMixes = (filters = {}) => async (dispatch) => {
  const { page = 1, size = 20 } = filters;
  
  let url = `/api/mixes?page=${page}&size=${size}`;


  const response = await fetch(url);
  
 
  if (response.ok) {
    const data = await response.json();
    dispatch(loadMixes(data.Mixes, data.page, data.size));
    return data;
  }
};

export const fetchMixDetails = (mixId) => async (dispatch) => {
  const response = await fetch(`/api/mixes/${mixId}`);
  

  if (response.ok) {
    const mix = await response.json();
    dispatch(loadMixDetails(mix));
    return mix;
  }
};

export const fetchMyMixes = () => async (dispatch) => {
  const response = await fetch('/api/mixes/mymixes');
  
  if (response.ok) {
    const data = await response.json();
    dispatch(loadMyMixes(data.Mixes));
    return data;
  }
};

export const createMix = (mixData) => async (dispatch) => {
  const response = await fetch('/api/mixes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(mixData)
  });
 
  
  if (response.ok) {
    const mix = await response.json();
    dispatch(addMix(mix));
    return mix;
  } else {
    const errors = await response.json();
    return { errors };
  }
};

export const editMix = (mixId, mixData) => async (dispatch) => {
 
    const response = await fetch(`/api/mixes/${mixId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(mixData)
  });
  
  if (response.ok) {
    
    const mix = await response.json();
    dispatch(updateMix(mix));
    return mix;
  } else {
    const errors = await response.json();
    return { errors };
  }
};

export const removeMix = (mixId) => async (dispatch) => {
  const response = await fetch(`/api/mixes/${mixId}`, {
    method: 'DELETE'
  });
  
  if (response.ok) {
    dispatch(deleteMix(mixId));
    return { message: 'Successfully deleted' };
  }
};

export const fetchRecentMixes = () => async (dispatch) => {
  const response = await fetch('/api/mixes/recent');

  if (response.ok) {
      const data = await response.json();
      
      dispatch(loadRecentMixes(data.Mixes));
      return data;
    }
}; 

export const addSongToMix = (mixId, song) => async (dispatch) => {
  const response = await fetch(`/api/mixes/${mixId}/songs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(song)
  });

  if (response.ok) {
    const addedSong = await response.json();
    dispatch(addSongUpdate(mixId, addedSong));
    return addedSong;
  } else {
    const errors = await response.json();
    return { errors };
  }
;}

export const removeSongFromMix = (mixId, songId) => async (dispatch) => {
  const response = await fetch(`/api/mixes/${mixId}/songs/${songId}`, {
    method: 'DELETE',
  });
  
  if (response.ok) {
    dispatch(removeSongUpdate(mixId, songId));
    return { message: 'Song removed' };
  } else {
    const errors = await response.json();
    return errors;
  }
};


const initialState = {
  allMixes: {},
  singleMix: {},
  userMixes: {},
  recentMixes: {},
  page: 1,
  size: 20
};




const mixReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_MIX: {

      const allMixes = {};

      action.mixes.forEach(mix => {
        allMixes[mix.id] = mix;
      });

      return {
        ...state,
        allMixes,
        page: action.page,
        size: action.size
      };
    }
      
    case LOAD_MIX_DETAILS:
      return {
        ...state,

        singleMix: { ...state.singleMix, [action.mix.id]: action.mix }
      };
      


    case LOAD_MY_MIXES: {
      const userMixes = {};
      action.mixes.forEach(mix => {
        userMixes[mix.id] = mix;
      });
      return {
        ...state,

        userMixes
      };
    }


      
    case ADD_MIX:
      return {
        ...state,

        allMixes: {
          ...state.allMixes,
          [action.mix.id]: action.mix
        },
        userMixes: {
          ...state.userMixes,
          
          [action.mix.id]: action.mix
        }
      };
      

    case UPDATE_MIX:
      return {
        ...state,
        allMixes: {
          ...state.allMixes,
          [action.mix.id]: action.mix

        },
        userMixes: {
          ...state.userMixes,
          [action.mix.id]: action.mix

        },
        singleMix: {
          [action.mix.id]: action.mix
        }
      };
      
    case DELETE_MIX: {

      const newAllMixes = { ...state.allMixes };
      const newUserMixes = { ...state.userMixes };
      const newSingleMix = { ...state.singleMix };
      delete newAllMixes[action.mixId];
      delete newUserMixes[action.mixId];
      delete newSingleMix[action.mixId];
      
      return {
        ...state,
        allMixes: newAllMixes,
        userMixes: newUserMixes,
        singleMix: newSingleMix
      };
    }
     
    
    case CLEAR_MIX:
      return initialState;
    
      
    

    case LOAD_RECENT_MIXES:
      const recentMixes = {};
      action.mixes.forEach(mix => {
      recentMixes[mix.id] = mix;
      });
      return {
        ...state,
        recentMixes
    }

    

    case ADD_SONG_TO_MIX: {
    const mix = state.singleMix[action.mixId];
    return {
      ...state,
      singleMix: {
        ...state.singleMix,
        [action.mixId]: {
          ...mix,
          mixsongs: [...(mix.mixsongs || []), action.song]
        }
      }
    }
  }

  case REMOVE_SONG_FROM_MIX: {
    const mix = state.singleMix[action.mixId];
    return {
      ...state,
      singleMix: {
        ...state.singleMix,
        [action.mixId]: {
          ...mix,
          mixsongs: mix.mixsongs.filter(song => song.id !== action.songId)
        }
      }
    };
  }

  default:
      return state;
  }
};

export default mixReducer;