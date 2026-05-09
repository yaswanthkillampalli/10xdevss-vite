import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Lock, ArrowRight, Mail, Eye, EyeOff, ShieldCheck, Zap } from 'lucide-react'
import { resetPassword } from '../../authentication/api'
import { useAuth } from '../../context/AuthContext.jsx'
import '../../styles/auth/PasswordReset.css'

export default function ResetPassword() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setSessionFromLoginResponse } = useAuth()
  
  const [formData, setFormData] = useState({
    emailId: location.state?.email || '',
    otp: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [showPasswords, setShowPasswords] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const result = await resetPassword(formData)
      const userData = result?.data?.user
      const profileData = result?.data?.profile
      
      setSessionFromLoginResponse(userData, profileData)
      setSuccess(true)
      
      setTimeout(() => {
        navigate('/')
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <main className="password-page">
        <div className="container-fluid g-0 min-vh-100">
          <div className="row g-0 min-vh-100">
            <section className="col-lg-6 d-none d-lg-flex password-brand-panel">
              <div className="password-brand-pattern" />
              <div className="password-brand-content">
                <div className="password-brand-top d-flex align-items-center gap-2">
                  <div className="password-brand-icon">
                    <Zap size={20} fill="currentColor" />
                  </div>
                  <span className="password-brand-name">CORE_UI</span>
                </div>
                <div className="password-brand-middle">
                  <span className="password-badge">
                    <ShieldCheck size={16} />
                    Secure Password Reset
                  </span>
                  <h2 className="password-brand-title">
                    Stay <span>Secure.</span>
                    <br />
                    Reset <span>Easy.</span>
                  </h2>
                </div>
              </div>
            </section>

            <section className="col-12 col-lg-6 password-form-panel">
              <div className="password-form-shell">
                <div className="password-form-card">
                  <div className="password-success-container">
                    <div className="password-success-icon">✓</div>
                    <h2 className="password-success-title">Password Reset!</h2>
                    <p className="password-success-text">
                      Your password has been successfully reset. Redirecting to dashboard...
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="password-page">
      <div className="container-fluid g-0 min-vh-100">
        <div className="row g-0 min-vh-100">
          <section className="col-lg-6 d-none d-lg-flex password-brand-panel">
            <div className="password-brand-pattern" />
            <div className="password-brand-content">
              <div className="password-brand-top d-flex align-items-center gap-2">
                <div className="password-brand-icon">
                  <Zap size={20} fill="currentColor" />
                </div>
                <span className="password-brand-name">CORE_UI</span>
              </div>
              <div className="password-brand-middle">
                <span className="password-badge">
                  <ShieldCheck size={16} />
                  Secure Password Reset
                </span>
                <h2 className="password-brand-title">
                  Stay <span>Secure.</span>
                  <br />
                  Reset <span>Easy.</span>
                </h2>
              </div>
            </div>
          </section>

          <section className="col-12 col-lg-6 password-form-panel">
            <div className="password-form-shell">
              <div className="password-form-card">
                <div className="password-form-header">
                  <h1 className="password-form-title">Reset Password</h1>
                  <p className="password-form-subtitle">
                    Enter the OTP you received and your new password.
                  </p>
                </div>

                {error && <div className="password-error-banner">{error}</div>}

                <form onSubmit={handleSubmit} className="password-form">
                  <div className="password-input-group">
                    <label htmlFor="emailId" className="password-label">
                      Email Address
                    </label>
                    <div className="password-input-wrapper">
                      <Mail size={16} className="password-input-icon" />
                      <input
                        id="emailId"
                        type="email"
                        className="password-input"
                        value={formData.emailId}
                        onChange={handleChange}
                        name="emailId"
                        required
                      />
                    </div>
                  </div>

                  <div className="password-input-group">
                    <label htmlFor="otp" className="password-label">
                      OTP Code
                    </label>
                    <input
                      id="otp"
                      type="text"
                      className="password-input password-otp-input"
                      placeholder="123456"
                      maxLength="6"
                      value={formData.otp}
                      onChange={handleChange}
                      name="otp"
                      required
                    />
                    <small className="password-helper-text">6-digit code from your email</small>
                  </div>

                  <div className="password-input-group">
                    <label htmlFor="newPassword" className="password-label">
                      New Password
                    </label>
                    <div className="password-input-wrapper">
                      <Lock size={16} className="password-input-icon" />
                      <input
                        id="newPassword"
                        type={showPasswords ? 'text' : 'password'}
                        className="password-input"
                        placeholder="••••••••"
                        value={formData.newPassword}
                        onChange={handleChange}
                        name="newPassword"
                        required
                      />
                    </div>
                  </div>

                  <div className="password-input-group">
                    <label htmlFor="confirmPassword" className="password-label">
                      Confirm Password
                    </label>
                    <div className="password-input-wrapper">
                      <Lock size={16} className="password-input-icon" />
                      <input
                        id="confirmPassword"
                        type={showPasswords ? 'text' : 'password'}
                        className="password-input"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        name="confirmPassword"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    className="password-show-toggle"
                    onClick={() => setShowPasswords(!showPasswords)}
                  >
                    {showPasswords ? '👁 Hide' : '👁️ Show'} Password
                  </button>

                  <button
                    type="submit"
                    className="password-submit-btn"
                    disabled={loading}
                  >
                    {loading ? 'Resetting...' : 'Reset Password'}
                    <ArrowRight size={16} />
                  </button>
                </form>

                <Link to="/forgot-password" className="password-link">
                  Didn&apos;t receive OTP? Try again
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
