const LOAD_SONG_REVIEWS = 'reviews/LOAD_SONG_REVIEWS';
const LOAD_USER_REVIEWS = 'reviews/LOAD_USER_REVIEWS';
const LOAD_REVIEW_DETAILS = 'reviews/LOAD_REVIEW_DETAILS';
const ADD_REVIEW = 'reviews/ADD_REVIEW';
const UPDATE_REVIEW = 'reviews/UPDATE_REVIEW';
const DELETE_REVIEW = 'reviews/DELETE_REVIEW';
const CLEAR_REVIEWS = 'reviews/CLEAR_REVIEWS';
const LOAD_MY_REVIEWS = 'reviews/LOAD_MY_REVIEWS';
const LOAD_RECENT_REVIEWS = 'reviews/LOAD_RECENT_REVIEWS';


const loadSongReviews = (songId, reviews) => ({
    type: LOAD_SONG_REVIEWS,
    songId,
    reviews
  });
 
  const loadUserReviews = (reviews) => ({
    type: LOAD_USER_REVIEWS,
    reviews
  });
  
  const loadReviewDetails = (review) => ({
    type: LOAD_REVIEW_DETAILS,
    review
  });
  
  const addReview = (review) => ({
    type: ADD_REVIEW,
    review
  });
  
  const updateReview = (review) => ({
    type: UPDATE_REVIEW,
    review
  });
  
  const deleteReview = (reviewId) => ({
    type: DELETE_REVIEW,
    
    reviewId
  });
  
  export const clearReviews = () => ({
    type: CLEAR_REVIEWS
  });

  const loadMyReviews = (reviews) => ({
    type: LOAD_MY_REVIEWS,
    reviews
  });

  const loadRecentReviews = (reviews) => ({
    type: LOAD_RECENT_REVIEWS,
    reviews
  });
  
  
  export const fetchReviews = (songId) => async (dispatch) => {
    const response = await fetch(`/api/song/${songId}/reviews`);
    
    if (response.ok) {
      const data = await response.json();
      dispatch(loadSongReviews(songId, data.Reviews));
      return data;
    }
  };
  
  export const fetchUserReviews = (userId) => async (dispatch) => {
    const response = await fetch(`/api/users/${userId}/reviews`);
    
    if (response.ok) {
      const data = await response.json();
      dispatch(loadUserReviews(data.Reviews));
      return data;
    }
  };
  
  export const fetchReviewDetails = (reviewId) => async (dispatch) => {
    const response = await fetch(`/api/reviews/${reviewId}`);
    
    if (response.ok) {
      const review = await response.json();
     
      dispatch(loadReviewDetails(review));
      return review;
    }
  };
  
  export const createReview = (reviewData) => async (dispatch) => {
    const response = await fetch(`/api/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData)
    });
    
    if (response.ok) {
      const review = await response.json();
     
      dispatch(addReview(review));
      return review;
    } else {
      const errors = await response.json();
      return { errors };
    }
  };
  
  export const editReview = (reviewId, reviewData) => async (dispatch) => {
    const response = await fetch(`/api/reviews/${reviewId}`, {
      method: 'PUT',
      headers: {
       
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData)
    });
    
    if (response.ok) {
      const review = await response.json();
      dispatch(updateReview(review));
      return review;
    } else {
      const errors = await response.json();
      
      return { errors };
    }
  };
  
  export const removeReview = (reviewId) => async (dispatch) => {
    const response = await fetch(`/api/reviews/${reviewId}`, {
      method: 'DELETE'
    });
    
    if (response.ok) {
      dispatch(deleteReview(reviewId));
      return { message: 'Successfully deleted' };
    }
  };
  
  export const fetchMyReviews = () => async (dispatch) => {
    const response = await fetch('/api/reviews/myreviews');
    
    if (response.ok) {
      const data = await response.json();
      
      dispatch(loadMyReviews(data.Reviews));
      return data;
    }
  };
  
export const fetchRecentReviews = () => async (dispatch) => {
  const response = await fetch('/api/reviews/recent');

  if (response.ok) {
      const data = await response.json();
      
      dispatch(loadRecentReviews(data.Reviews));
      return data;
    }
};  

  const initialState = {
    songReviews: {},
    userReviews: {},
    singleReview: {}
  };
  
  const reviewsReducer = (state = initialState, action) => {
    switch (action.type) {
      case LOAD_SONG_REVIEWS: {
        const songReviews = {};
        action.reviews.forEach(review => {
          songReviews[review.id] = review;
        });
        return {
          ...state,
          songReviews: {

            ...state.songReviews,
            [action.songId]: songReviews
          }
        };
      }
        
      case LOAD_USER_REVIEWS: {
        const userReviews = {};
        action.reviews.forEach(review => {
          userReviews[review.id] = review;
        });
        return {
          ...state,
          userReviews
        };
      }

      case LOAD_MY_REVIEWS: {
        const userReviews = {};
        action.reviews.forEach(review => {
          userReviews[review.id] = review;
        });
        return {
          ...state,
          userReviews
        };
      }
      case LOAD_REVIEW_DETAILS:
        return {
          ...state,
          singleReview: { [action.review.id]: action.review }
        };
        
      case ADD_REVIEW: {
        const songId = action.review.songId;
        return {
          ...state,
          songReviews: {
            ...state.songReviews,
            [songId]: {

              ...(state.songReviews[songId] || {}),
              [action.review.id]: action.review
            }
          },
          userReviews: {
            ...state.userReviews,
            [action.review.id]: action.review
          }
        };
      }
        
      case UPDATE_REVIEW: {
        const updatedSongId = action.review.songId;
        return {
          ...state,
          songReviews: {
            ...state.songReviews,
            [updatedSongId]: {
              ...(state.songReviews[updatedSongId] || {}),
              [action.review.id]: action.review
            }
          },
          userReviews: {
            ...state.userReviews,
            [action.review.id]: action.review
          },
          singleReview: {
            [action.review.id]: action.review
          }
        };
      }
        
      case DELETE_REVIEW: {
        const newSongReviews = { ...state.songReviews };
        const newUserReviews = { ...state.userReviews };
        const newSingleReview = { ...state.singleReview };
        
        Object.keys(newSongReviews).forEach(songId => {
          if (newSongReviews[songId][action.reviewId]) {
            delete newSongReviews[songId][action.reviewId];
          }
        });
        
        delete newUserReviews[action.reviewId];
        delete newSingleReview[action.reviewId];
        
        return {
          ...state,
          songReviews: newSongReviews,
          userReviews: newUserReviews,
          singleReview: newSingleReview
        };
      }
        
      case CLEAR_REVIEWS:
        return initialState;
        
      

      case LOAD_RECENT_REVIEWS:
        const allReviews = {};
      action.reviews.forEach(review => {
        allReviews[review.id] = review;
      });
      return {
        ...state,
        allReviews
      }
      default:
        return state;
    }
  }
  ;


  
  
  export default reviewsReducer;