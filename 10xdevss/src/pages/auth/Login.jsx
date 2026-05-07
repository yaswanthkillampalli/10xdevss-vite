import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowRight, LockKeyhole, Mail, ShieldCheck, Zap } from 'lucide-react'
import { loginUser } from '../../authentication/api'
import '../../styles/auth/Login.css'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await loginUser({ email, password })
      const role = result?.data?.role || result?.data?.data?.role
      if (role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/')
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-page">
      <div className="container-fluid g-0 min-vh-100">
        <div className="row g-0 min-vh-100">
          <section className="col-lg-6 d-none d-lg-flex login-brand-panel">
            <div className="login-brand-pattern" />

            <div className="login-brand-content">
              <div className="login-brand-top d-flex align-items-center gap-2">
                <div className="login-brand-icon">
                  <Zap size={20} fill="currentColor" />
                </div>
                <span className="login-brand-name">CORE_UI</span>
              </div>

              <div className="login-brand-middle">
                <span className="login-badge">
                  <ShieldCheck size={16} />
                  Trusted Access Platform
                </span>

                <h2 className="login-brand-title">
                  Design <span>Faster.</span>
                  <br />
                  Scale Higher.
                </h2>

                <p className="login-brand-text">
                  The world&apos;s most advanced dashboard for creative engineers.
                  Secure, fast, and built with a sharp red-black-white identity.
                </p>

                <div className="login-feature-list">
                  <div className="login-feature-card">
                    <h6>Secure by default</h6>
                    <p>Protected sign in flow with clean authentication experience.</p>
                  </div>

                  <div className="login-feature-card">
                    <h6>Fast workflow</h6>
                    <p>Designed for teams who want speed, clarity, and control.</p>
                  </div>
                </div>
              </div>

              <div className="login-brand-footer">
                <span>© 2026 Core Systems</span>
                <a href="/">Privacy</a>
                <a href="/">Terms</a>
              </div>
            </div>
          </section>

          <section className="col-12 col-lg-6 login-form-panel">
            <div className="login-form-shell">
              <div className="login-form-card">
                <div className="login-mobile-brand d-lg-none">
                  <div className="login-brand-icon">
                    <Zap size={18} fill="currentColor" />
                  </div>
                  <span>CORE_UI</span>
                </div>

                <div className="login-header">
                  <h1 className="login-title">Sign In</h1>
                  <p className="login-subtitle">
                    New here?{' '}
                    <Link to="/register" className="login-link">
                      Create an account
                    </Link>
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                  <div className="mb-4">
                    <label htmlFor="email" className="form-label login-label">
                      Email Address
                    </label>
                    <div className="input-group login-input-group">
                      <span className="input-group-text login-input-icon">
                        <Mail size={18} />
                      </span>
                      <input
                        id="email"
                        type="email"
                        className="form-control login-input"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <label htmlFor="password" className="form-label login-label mb-0">
                        Password
                      </label>
                      <button type="button" className="login-forgot-btn">
                        Forgot Password?
                      </button>
                    </div>

                    <div className="input-group login-input-group">
                      <span className="input-group-text login-input-icon">
                        <LockKeyhole size={18} />
                      </span>
                      <input
                        id="password"
                        type="password"
                        className="form-control login-input"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="login-error-alert" role="alert">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn login-submit-btn w-100"
                  >
                    <span>{loading ? 'Signing In...' : 'Access Account'}</span>
                    <ArrowRight size={18} />
                  </button>

                  <div className="login-security-note">
                    <ShieldCheck size={16} className="text-danger" />
                    <span>End-to-end encrypted authentication.</span>
                  </div>
                </form>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}