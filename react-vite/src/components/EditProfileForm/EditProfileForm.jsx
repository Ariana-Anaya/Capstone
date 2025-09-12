import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { thunkUpdateUser } from "../../redux/session"; 
import "./EditProfileForm.css";

function EditProfileForm({ onClose }) {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.session.user.user);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bio, setBio] = useState("");
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.username || "");
      setEmail(currentUser.email || "");
      setFirstName(currentUser.firstName || "");
      setLastName(currentUser.lastName || "");
      setAvatarUrl(currentUser.avatarUrl || "");
      setBio(currentUser.bio || "");
    }
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    if (typeof onClose !== "function") {
      console.error("onClose is not a function!");
      return;
    }

    try {
      const result = await dispatch(
        thunkUpdateUser(currentUser.id, {
          username,
          email,
          first_name: firstName,
          last_name: lastName,
          avatar_url: avatarUrl,
          bio,
        })
      );

      if (result.errors) {
        setErrors(result.errors);
      } else {
        onClose(); // Close modal only if no errors
      }
    } catch (err) {
      setErrors([err.message || "Something went wrong"]);
    }
  };

  return (
    <div className="editprofile-overlay" onClick={onClose}>
      <div className="editprofile-container" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h1>Edit Profile</h1>

        {errors.length > 0 && (
          <ul className="errors">
            {errors.map((err, idx) => (
              <li className="error" key={idx}>{err}</li>
            ))}
          </ul>
        )}

        <form className="editprofile-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>

            <div className="form-group">
              <label>Last Name</label>
              <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label>Avatar URL</label>
            <input type="text" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
          </div>

          <button className="save-button" type="submit">Save Changes</button>
        </form>

        {avatarUrl && (
          <div className="avatar-preview">
            <h4>Avatar Preview:</h4>
            <img src={avatarUrl} alt="Avatar Preview" width="100" style={{ borderRadius: "8px" }} />
          </div>
        )}
      </div>
    </div>
  );
}

export default EditProfileForm;
