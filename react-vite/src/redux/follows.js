// ProfileManagement.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchMyReviews } from "../../redux/reviews";
import { fetchMyMixes } from "../../redux/mixes";
import { fetchFollowers, fetchFollowing, followUser, unfollowUser } from "../../redux/follows";
import "./ProfileView.css";

function ProfileView() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userId } = useParams(); // for profile routes like /users/:userId
  const sessionUser = useSelector((state) => state.session.user.user); // current logged-in user
  const userReviews = useSelector((state) => state.reviews.userReviews);
  const userMixes = useSelector((state) => state.mixes.userMixes);
  const allFollowers = useSelector((state) => state.follows.allFollowers);
  const allFollowing = useSelector((state) => state.follows.allFollowing);

  const [profileUser, setProfileUser] = useState(null); // the profile being viewed
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (!sessionUser) {
      navigate("/login");
      return;
    }

    const loadProfileData = async () => {
      try {
        setLoading(true);
        setError(null);

        // fetch reviews & mixes
        await dispatch(fetchMyReviews());
        await dispatch(fetchMyMixes());

        // fetch followers/following
        await dispatch(fetchFollowers(userId));
        await dispatch(fetchFollowing(userId));

        // determine profile user
        if (Number(userId) === sessionUser.id) {
          setProfileUser(sessionUser);
        } else {
          // fetch other user data from backend if needed
          setProfileUser({
            id: Number(userId),
            username: "OtherUser", // placeholder
            avatarUrl: "",
            bio: "",
          });
        }

        // determine if current user is following profile
        setIsFollowing(Boolean(allFollowers[sessionUser.id]));
      } catch (err) {
        console.error(err);
        setError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [dispatch, sessionUser, userId, allFollowers, navigate]);

  const handleFollowClick = async () => {
    try {
      if (isFollowing) {
        await dispatch(unfollowUser(userId));
        setIsFollowing(false);
      } else {
        await dispatch(followUser(userId));
        setIsFollowing(true);
      }
    } catch (err) {
      console.error("Error following/unfollowing user:", err);
    }
  };

  if (!profileUser) return null;

  const reviews = Object.values(userReviews || {});
  const mixes = Object.values(userMixes || {});

  const recentActivity = [
    ...reviews.map((r) => ({ type: "review", data: r })),
    ...mixes.map((m) => ({ type: "mix", data: m })),
  ].sort((a, b) => new Date(b.data.createdAt) - new Date(a.data.createdAt));

  return (
    <div className="profile-page-container">
      {loading && <p>Loading profile...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && (
        <>
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

            <div className="profile-stats">
              <span>{Object.keys(allFollowers).length} Followers</span>
              <span>{Object.keys(allFollowing).length} Following</span>
            </div>

            {Number(sessionUser.id) !== Number(profileUser.id) && (
              <button onClick={handleFollowClick} className="btn-primary">
                {isFollowing ? "Unfollow" : "Follow"}
              </button>
            )}

            {Number(sessionUser.id) === Number(profileUser.id) && (
              <button
                onClick={() => navigate("/profile/edit")}
                className="btn-secondary"
              >
                Edit Profile
              </button>
            )}
          </div>

          <div className="recent-activity">
            <h3>My Recent Activity</h3>
            {recentActivity.length === 0 ? (
              <p>No recent activity.</p>
            ) : (
              <div className="activity-grid">
                {recentActivity.map((item) => (
                  <div
                    key={`${item.type}-${item.data.id}`}
                    className="activity-tile"
                    onClick={() =>
                      item.type === "review"
                        ? navigate("/reviews/manage")
                        : navigate("/mixes/manage")
                    }
                  >
                    {item.type === "review" && item.data.songId?.imageUrl && (
                      <img
                        src={item.data.songId.imageUrl}
                        alt={item.data.songId.title}
                        className="activity-image"
                      />
                    )}
                    {item.type === "mix" && item.data.coverUrl && (
                      <img
                        src={item.data.coverUrl}
                        alt={item.data.name}
                        className="activity-image"
                      />
                    )}
                    <div className="activity-info">
                      <h4>
                        {item.type === "review"
                          ? item.data.songId?.title
                          : item.data.name}
                      </h4>
                      <p>{new Date(item.data.createdAt).toLocaleDateString()}</p>
                      <span>{item.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default ProfileView;
