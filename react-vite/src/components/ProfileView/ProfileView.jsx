import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchUserReviews } from "../../redux/reviews";
import { fetchUserMixes } from "../../redux/mixes";
import { fetchFollowers, fetchFollowing, followUser, unfollowUser } from "../../redux/follows";
import EditProfileForm from "../EditProfileForm/EditProfileForm";
import "./ProfileView.css";

function ProfileView() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userId } = useParams(); 
  const sessionUser = useSelector((state) => state.session.user.user);

  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const handleTileClick = (reviewId) => {navigate(`/songs/${reviewId}/reviews`);
  };



  const userReviews = useSelector((state) => state.reviews.userReviews);
  const userMixes = useSelector((state) => state.mixes.profileMixes);
  const allFollowers = useSelector((state) => state.follows.allFollowers);
  const allFollowing = useSelector((state) => state.follows.allFollowing);

  const isOwner = sessionUser?.id.toString() === userId;

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);

        const res = await fetch(`/api/users/${userId}`);
        if (res.ok) {
          const data = await res.json();
          setProfileUser(data);
        }

        await dispatch(fetchUserReviews(userId));
        await dispatch(fetchUserMixes(userId));

        const followersData = await dispatch(fetchFollowers(userId));
        const followingData = await dispatch(fetchFollowing(userId));
       
        setFollowersCount(followersData.count);
        setFollowingCount(followingData.count);

        setIsFollowing(
          followingData.following.some(
            (f) => f.id.toString() === sessionUser.id.toString()
          )
        );
      } catch (err) {
        console.error("Profile load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [dispatch, userId]);

  if (loading) return <p>Loading profile...</p>;
  if (!profileUser) return <p>User not found.</p>;

  const reviews = Object.values(userReviews || {});
  const mixes = Object.values(userMixes || {});

  

  return (
    <div className="profile-page-container">
      <div className="profile-info">
        {profileUser.avatarUrl && (
          <img 
            src={profileUser.avatarUrl}
            alt={profileUser.username}
            className="profile-avatar"
          />
        )}
        <h2>{profileUser.username}</h2>
        {profileUser.bio && <p>{profileUser.bio}</p>}
        {!isOwner && (
    <div className="follow-section">
      <span>{followersCount} Followers</span>
      <span>{followingCount} Following</span>
      <button
        className="btn-primary"
        onClick={async () => {
          if (isFollowing) {
            await dispatch(unfollowUser(userId));
            setFollowersCount(c => c - 1);
            setIsFollowing(false);
          } else {
            await dispatch(followUser(userId));
            setFollowersCount(c => c + 1);
            setIsFollowing(true);
          }
        }}
      >
        {isFollowing ? "Unfollow" : "Follow"}
      </button>
    </div>
  )}

        {isOwner && (
           <button
           className="btn-primary"
           onClick={() => setShowEditModal(true)}
         >
           Edit Profile
         </button>
       )}
     </div>
 
     {showEditModal && (
       <EditProfileForm
         onClose={() => setShowEditModal(false)}
       />
     )}

      <div className="recent-activity">
        <h3>Recent Reviews</h3>
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          <div className="activity-grid">
            {reviews.map((review) => (
              <div
                key={`review-${review.id}`}
                className="activity-tile"
                onClick={() => handleTileClick(review.songId.id)}
              >
                {review.songId?.imageUrl && (
                  <img
                    src={review.songId.imageUrl}
                    alt={review.songId.title}
                    className="activity-image"
                  />
                )}
                <div className="activity-info">
                  <h4>{review.songId?.title}</h4>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="recent-activity">
        <h3>Recent Mixes</h3>
        {mixes.length === 0 ? (
          <p>No mixes yet.</p>
        ) : (
          <div className="activity-grid">
            {mixes.map((mix) => (
              <div
                key={`mix-${mix.id}`}
                className="activity-tile"
                onClick={() => navigate(`/mixes/${mix.id}/view`)}
                >
                {mix.coverUrl && (
                  <img
                    src={mix.coverUrl}
                    alt={mix.name}
                    className="activity-image"
                  />
                )}
                <div className="activity-info">
                  <h4>{mix.name}</h4>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileView;
