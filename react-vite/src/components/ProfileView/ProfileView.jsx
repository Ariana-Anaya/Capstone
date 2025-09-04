import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchUserReviews } from "../../redux/reviews";
import { fetchUserMixes } from "../../redux/mixes";
import "./ProfileView.css";

function ProfileView() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userId } = useParams(); 
  const sessionUser = useSelector((state) => state.session.user.user);

  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const userReviews = useSelector((state) => state.reviews.userReviews);
  const userMixes = useSelector((state) => state.mixes.profileMixes);

  const isOwner = sessionUser?.id.toString() === userId;

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);

        // Fetch user info
        const res = await fetch(`/api/users/${userId}`);
        if (res.ok) {
          const data = await res.json();
          setProfileUser(data);
        }

        // Fetch reviews and mixes
        await dispatch(fetchUserReviews(userId));
        await dispatch(fetchUserMixes(userId));
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

  const handleTileClick = (type) => {
    if (type === "review") navigate("/reviews/manage");
    if (type === "mix") navigate("/mixes/manage");
  };

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

        {isOwner && (
          <button
            className="btn-primary"
            onClick={() => navigate("/profile/edit")}
          >
            Edit Profile
          </button>
        )}
      </div>

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
                onClick={() => handleTileClick("review")}
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
                onClick={() => handleTileClick("mix")}
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
