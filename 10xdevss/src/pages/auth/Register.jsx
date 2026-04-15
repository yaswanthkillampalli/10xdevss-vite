import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowRight,
  LockKeyhole,
  Mail,
  Zap,
  User,
  Hash,
  Phone,
  CheckCircle2,
} from "lucide-react";
import { registerUser } from "../../authentication/api";
import "../../styles/auth/Register.css";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    emailId: "",
    rollId: "",
    phone: "",
    role: "student",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await registerUser({
        fullName: formData.fullName,
        emailId: formData.emailId,
        rollId: formData.rollId,
        phone: formData.phone,
        role: formData.role,
        password: formData.password,
      });
      navigate("/");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const passwordsMatch =
    formData.password.length > 0 && formData.password === formData.confirmPassword;

  return (
    <main className="register-page">
      <div className="container-fluid g-0 min-vh-100">
        <div className="row g-0 min-vh-100">
          {/* Left Brand Panel */}
          <section className="col-lg-4 d-none d-lg-flex register-brand-panel">
            <div className="register-brand-pattern" />

            <div className="register-brand-content">
              <div className="register-brand-top d-flex align-items-center gap-2">
                <div className="register-brand-icon">
                  <Zap size={20} fill="currentColor" />
                </div>
                <span className="register-brand-name">CORE_UI</span>
              </div>

              <div className="register-brand-middle">
                <span className="register-badge">Join the Standard</span>

                <h2 className="register-brand-title">Join the Standard</h2>

                <p className="register-brand-text">
                  Create your account to start building with the most powerful UI engine in
                  the industry.
                </p>
              </div>

              <div className="register-brand-footer">
                <span>© 2026 Core Systems</span>
              </div>
            </div>
          </section>

          {/* Right Form Panel */}
          <section className="col-12 col-lg-8 register-form-panel">
            <div className="register-form-shell">
              <div className="register-form-card">
                <div className="register-mobile-brand d-lg-none">
                  <div className="register-brand-icon">
                    <Zap size={18} fill="currentColor" />
                  </div>
                  <span>CORE_UI</span>
                </div>

                <div className="register-header">
                  <h1 className="register-title">Create Account</h1>
                  <p className="register-subtitle">
                    Already have an account?{" "}
                    <Link to="/login" className="register-link">
                      Log in
                    </Link>
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="register-form">
                  <div className="row g-4">
                    {/* Full Name */}
                    <div className="col-12 col-md-6">
                      <label htmlFor="fullName" className="form-label register-label">
                        Full Name
                      </label>
                      <div className="input-group register-input-group">
                        <span className="input-group-text register-input-icon">
                          <User size={18} />
                        </span>
                        <input
                          id="fullName"
                          type="text"
                          name="fullName"
                          className="form-control register-input"
                          placeholder="Enter your full name"
                          value={formData.fullName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="col-12 col-md-6">
                      <label htmlFor="emailId" className="form-label register-label">
                        Email Address
                      </label>
                      <div className="input-group register-input-group">
                        <span className="input-group-text register-input-icon">
                          <Mail size={18} />
                        </span>
                        <input
                          id="emailId"
                          type="email"
                          name="emailId"
                          className="form-control register-input"
                          placeholder="Enter your email"
                          value={formData.emailId}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    {/* Roll ID */}
                    <div className="col-12 col-md-6">
                      <label htmlFor="rollId" className="form-label register-label">
                        Roll ID
                      </label>
                      <div className="input-group register-input-group">
                        <span className="input-group-text register-input-icon">
                          <Hash size={18} />
                        </span>
                        <input
                          id="rollId"
                          type="text"
                          name="rollId"
                          className="form-control register-input"
                          placeholder="Enter your roll ID"
                          value={formData.rollId}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="col-12 col-md-6">
                      <label htmlFor="phone" className="form-label register-label">
                        Phone Number
                      </label>
                      <div className="input-group register-input-group">
                        <span className="input-group-text register-input-icon">
                          <Phone size={18} />
                        </span>
                        <input
                          id="phone"
                          type="tel"
                          name="phone"
                          className="form-control register-input"
                          placeholder="Enter your phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    {/* Role */}
                    <div className="col-12 col-md-6">
                      <label htmlFor="role" className="form-label register-label">
                        Role
                      </label>
                      <div className="input-group register-input-group">
                        <span className="input-group-text register-input-icon">
                          <CheckCircle2 size={18} />
                        </span>
                        <select
                          id="role"
                          name="role"
                          className="form-control register-input"
                          value={formData.role}
                          onChange={handleChange}
                        >
                          <option value="student">Student</option>
                          <option value="faculty">Faculty</option>
                        </select>
                      </div>
                    </div>

                    {/* Password */}
                    <div className="col-12 col-md-6">
                      <label htmlFor="password" className="form-label register-label">
                        Password
                      </label>
                      <div className="input-group register-input-group">
                        <span className="input-group-text register-input-icon">
                          <LockKeyhole size={18} />
                        </span>
                        <input
                          id="password"
                          type="password"
                          name="password"
                          className="form-control register-input"
                          placeholder="Enter your password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="col-12 col-md-6">
                      <label htmlFor="confirmPassword" className="form-label register-label mb-2">
                        Confirm Password
                      </label>

                      <div className="input-group register-input-group">
                        <span
                          className={`input-group-text register-input-icon ${
                            passwordsMatch ? "text-danger" : ""
                          }`}
                        >
                          <LockKeyhole size={18} />
                        </span>
                        <input
                          id="confirmPassword"
                          type="password"
                          name="confirmPassword"
                          className="form-control register-input"
                          placeholder="Confirm your password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                        />
                        {passwordsMatch && (
                          <span className="input-group-text register-check-icon">
                            <CheckCircle2 size={16} className="text-danger" />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="register-error-alert" role="alert">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn register-submit-btn w-100"
                  >
                    <span>{loading ? "Creating Account..." : "Create Account"}</span>
                    <ArrowRight size={18} />
                  </button>

                  <p className="register-policy-text">
                    By clicking{" "}
                    <strong>“Create Account”</strong>, you agree to our policies.
                  </p>
                </form>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}