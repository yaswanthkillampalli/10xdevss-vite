import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, ArrowRight, Zap, ShieldCheck } from 'lucide-react'
import { forgotPassword } from '../../authentication/api'
import '../../styles/auth/PasswordReset.css'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await forgotPassword(email)
      setSuccess(true)
      setTimeout(() => {
        navigate('/reset-password', { state: { email } })
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.')
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
                  <p className="password-brand-text">
                    Forgot your password? No worries. We&apos;ll send you a secure OTP to reset it in minutes.
                  </p>
                </div>
              </div>
            </section>

            <section className="col-12 col-lg-6 password-form-panel">
              <div className="password-form-shell">
                <div className="password-form-card">
                  <div className="password-success-container">
                    <div className="password-success-icon">✓</div>
                    <h2 className="password-success-title">OTP Sent!</h2>
                    <p className="password-success-text">
                      Check your email for the OTP. Redirecting to reset page...
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
                <p className="password-brand-text">
                  Forgot your password? No worries. We&apos;ll send you a secure OTP to reset it in minutes.
                </p>
              </div>
            </div>
          </section>

          <section className="col-12 col-lg-6 password-form-panel">
            <div className="password-form-shell">
              <div className="password-form-card">
                <div className="password-form-header">
                  <h1 className="password-form-title">Forgot Password?</h1>
                  <p className="password-form-subtitle">
                    Enter your email and we&apos;ll send you an OTP to reset your password.
                  </p>
                </div>

                {error && <div className="password-error-banner">{error}</div>}

                <form onSubmit={handleSubmit} className="password-form">
                  <div className="password-input-group">
                    <label htmlFor="email" className="password-label">
                      Email Address
                    </label>
                    <div className="password-input-wrapper">
                      <Mail size={16} className="password-input-icon" />
                      <input
                        id="email"
                        type="email"
                        className="password-input"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="password-submit-btn"
                    disabled={loading}
                  >
                    {loading ? 'Sending OTP...' : 'Send OTP'}
                    <ArrowRight size={16} />
                  </button>
                </form>

                <div className="password-form-divider">or</div>

                <Link to="/login" className="password-link">
                  Back to Login
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
