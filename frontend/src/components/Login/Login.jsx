import { Eye, EyeOff, LogIn } from "lucide-react";
import { useState } from "react";
import "./LoginPage.css";
import { validatePassword, validateUsername } from "../../utils/loginValidation";
import { loginUser } from "../../services/authService";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    username: "",
    password: ""
  });
  const [touched, setTouched] = useState({
    username: false,
    password: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Validate real-time khi người dùng nhập
  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);

    if (touched.username) {
      const error = validateUsername(value);
      setErrors(prev => ({ ...prev, username: error }));
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    if (touched.password) {
      const error = validatePassword(value);
      setErrors(prev => ({ ...prev, password: error }));
    }
  };

  // Mark field as touched khi người dùng rời khỏi input
  const handleBlur = (field) => () => {
    setTouched(prev => ({ ...prev, [field]: true }));

    // Validate field khi blur
    if (field === 'username') {
      const error = validateUsername(username);
      setErrors(prev => ({ ...prev, username: error }));
    } else if (field === 'password') {
      const error = validatePassword(password);
      setErrors(prev => ({ ...prev, password: error }));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Mark all fields as touched khi submit
    setTouched({
      username: true,
      password: true
    });

    // Validate tất cả fields
    const usernameError = validateUsername(username);
    const passwordError = validatePassword(password);

    setErrors({
      username: usernameError,
      password: passwordError
    });

    // Nếu có lỗi, dừng lại
    if (usernameError || passwordError) {
      return;
    }

    // Nếu không có lỗi, tiếp tục login
    setIsLoading(true);
    try {
      const res = await loginUser(username, password);
      if (res.success) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("authToken", res.token);
        setUsername(res.username);
        alert("Login thanh cong");
        window.location.href = "/products";
      } else {
        alert(res.message);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function để xác định class cho input
  const getInputClassName = (field) => {
    const baseClass = "input";
    if (!touched[field]) return baseClass;
    return errors[field] ? `${baseClass} input-error` : baseClass;
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-header">
          <h2 className="login-title">Sign in to your account</h2>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          {/* Username Field */}
          <div className="input-group">
            <input
              id="username-input"
              data-testid="username-input"
              type="text"
              placeholder="Username"
              className={getInputClassName('username')}
              value={username}
              onChange={handleUsernameChange}
              onBlur={handleBlur('username')}
            />
            {touched.username && errors.username && (
              <span className="error-text" data-testid="username-error">
                {errors.username}
              </span>
            )}
          </div>

          {/* Password Field */}
          <div className="input-group password-wrapper">
            <input
              id="password-input"
              data-testid="password-input"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className={getInputClassName('password')}
              value={password}
              onChange={handlePasswordChange}
              onBlur={handleBlur('password')}
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
            {touched.password && errors.password && (
              <span className="error-text" data-testid="password-error">
                {errors.password}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="btn-primary"
            id="login-button"
            data-testid="login-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                Signing in...
              </>
            ) : (
              <>
                <LogIn className="login-icon-submit" />
                Sign in
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}