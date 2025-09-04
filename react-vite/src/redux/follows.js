const FOLLOW_USER = 'follows/FOLLOW_USER';
const UNFOLLOW_USER = 'follows/UNFOLLOW_USER';
const LOAD_FOLLOWERS = 'follows/LOAD_FOLLOWERS';
const LOAD_FOLLOWING = 'follows/LOAD_FOLLOWING';

const loadFollowers = (followers) => ({
    type: LOAD_FOLLOWERS,
    followers
  });

const loadFollowing = (following) => ({
    type: LOAD_FOLLOWING,
    following
  });

const addFollow = (follow) => ({
    type: FOLLOW_USER,
    follow
  });

const removeFollow = (followId) => ({
    type: UNFOLLOW_USER,
    followId
  });

  export const fetchFollowers = (userId) => async (dispatch) => {
    const response = await fetch(`/api/users/${userId}/followers`);
    if (response.ok) {
        const data = await response.json();
        dispatch(loadFollowers(data.followers || []));
        return data;
    } else {
      const errors = await response.json();
      return { errors };
    }
};

export const fetchFollowing = (userId) => async (dispatch) => {
  const response = await fetch(`/api/users/${userId}/following`);
  if (response.ok) {
      const data = await response.json();
      dispatch(loadFollowing(data.following || []));
      return data;
    } else {
      const errors = await response.json();
      return { errors };
    }
};

export const followUser = (userId) => async (dispatch) => {
    const response = await fetch(`/api/follows/${userId}/follows`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
    });
  
    if (response.ok) {
      const data = await response.json();
      dispatch(addFollow(data));
      return data;
    } else {
      const errors = await response.json();
      return { errors };
    }
  };

export const unfollowUser = (userId) => async (dispatch) => {
    const response = await fetch(`/api/follows/${userId}/unfollow`, {
      method: 'DELETE',
    });
    
    if (response.ok) {
      dispatch(removeFollow(userId));
      return { message: 'User unfollowed' };
    } else {
      const errors = await response.json();
      return errors;
    }
  }; 

  const initialState = {
    allFollowers: {},
    allFollowing: {}
  };

  const followReducer = (state = initialState, action) => {
    switch (action.type) {
      case LOAD_FOLLOWERS:
        const followersMap = {};
        action.followers.forEach(f => { followersMap[f.followerId] = f });
        return { ...state, allFollowers: followersMap };

       case LOAD_FOLLOWING:
        const followingMap = {};
        action.following.forEach(f => { followingMap[f.followedId] = f });
        return { ...state, allFollowing: followingMap };

        case FOLLOW_USER:
          return { 
            ...state,
            allFollowing: { ...state.allFollowing, [action.follow.followedId]: action.follow }

          };

          case UNFOLLOW_USER:
            const newFollowing = { ...state.allFollowing };
            delete newFollowing[action.followId];
            return { ...state, allFollowing: newFollowing };
       
       
       default:
        return state;
    }
  }

  export default followReducer;