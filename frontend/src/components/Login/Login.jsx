import { Eye, EyeOff, LogIn } from "lucide-react";
// import { useNavigate } from "react-router-dom"; // Thư viện Thẻ link
import { useState } from "react";
import "./LoginPage.css";
import { validatePassword, validateUsername, } from "../../utils/loginValidation";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = async (e) => {
    e.preventDefault();
    const usernameError = validateUsername(username);
    const passwordError = validatePassword(password);
    if (usernameError || passwordError) {
      alert(usernameError || passwordError);
      return;
    }
    try {
      localStorage.setItem("isLoggedIn", "true");
      window.location.href = "/products";
      alert("Login thanh cong");
    } catch (err) {
      alert(err.message);
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  return (
    <>
      <div className="login-container">
        <div className="login-wrapper">
          <div className="login-header">
            <h2 className="login-title">Sign in to your account</h2>
          </div>

          <form action="" className="login-form" onSubmit={handleLogin}>
            <div className="input-group">
              <input
                id="username-input"
                data-testid="username-input"
                type="text"
                placeholder="Username"
                className="input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              {/* Chưa viết error */}
            </div>

            <div className="input-group password-wrapper">
              <input
                id="password-input"
                data-testid="password-input"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {/* Show mật khẩu */}
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="show-password"
              >
                {showPassword ? (
                  <EyeOff className="login-icon-pasword" />
                ) : (
                  <Eye className="login-icon-pasword" />
                )}
              </button>
              {/*  Chưa viết test error */}
            </div>

            <button
              type="submit"
              className="btn-primary"
              id="login-button"
              data-testid="login-button"
            >
              <LogIn className="login-icon-submit" />
              Sign in
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
