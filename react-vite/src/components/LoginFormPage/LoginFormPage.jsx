import { useState } from "react";
import { thunkLogin } from "../../redux/session";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import "./LoginForm.css";

function LoginFormPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  if (sessionUser) return <Navigate to="/" replace={true} />;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const serverResponse = await dispatch(
      thunkLogin({
        email,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      navigate("/");
    }
  };

  const handleDemoLogin = async (e) => {
    e.preventDefault();
    const serverResponse = await dispatch(
      thunkLogin({
        email: "demo@aa.io",
        password: "password",
      })
    );

    if (!serverResponse) {
      navigate("/");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Welcome Back</h1>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          {errors.length > 0 && (
            <div className="form-group">
              {errors.map((message, idx) => (
                <p key={idx} className="error">{message}</p>
              ))}
            </div>
          )}

          <button type="submit" className="login-button">
            Log In
          </button>
          
          <button type="button" onClick={handleDemoLogin} className="demo-login">
            Demo User Login
          </button>
        </form>

        <div className="auth-links">
          <p>
            Don&apos;t have an account?{' '}
            <a href="/signup">Sign up here</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginFormPage;
