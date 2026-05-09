import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Lock, Eye, EyeOff, AlertCircle, X, CheckCircle } from 'lucide-react'
import { changePassword } from '../authentication/api'
import '../styles/auth/ChangePassword.css'

function getStrength(password) {
  if (!password) return null
  let score = 0
  if (password.length >= 6) score++
  if (password.length >= 10) score++
  if (/[A-Z]/.test(password) && /[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  const levels = [
    { label: 'Weak', className: 'weak', width: '25%' },
    { label: 'Fair', className: 'fair', width: '50%' },
    { label: 'Good', className: 'good', width: '75%' },
    { label: 'Strong', className: 'strong', width: '100%' },
  ]
  return levels[Math.min(score, 3)]
}

export default function ChangePassword({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const strength = getStrength(formData.newPassword)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setError('All fields are required')
      return
    }

    if (formData.newPassword.length < 6) {
      setError('New password must be at least 6 characters')
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match')
      return
    }

    if (formData.currentPassword === formData.newPassword) {
      setError('New password must be different from current password')
      return
    }

    setLoading(true)

    try {
      await changePassword(formData)
      onSuccess?.('Password changed successfully!')
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const fields = [
    {
      id: 'currentPassword',
      name: 'currentPassword',
      label: 'Current password',
      placeholder: 'Enter current password',
      showKey: 'current',
      value: formData.currentPassword,
    },
    {
      id: 'newPassword',
      name: 'newPassword',
      label: 'New password',
      placeholder: 'At least 6 characters',
      showKey: 'new',
      value: formData.newPassword,
      showStrength: true,
    },
    {
      id: 'confirmPassword',
      name: 'confirmPassword',
      label: 'Confirm new password',
      placeholder: 'Repeat new password',
      showKey: 'confirm',
      value: formData.confirmPassword,
    },
  ]

  return createPortal(
    <div className="cp-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label="Change Password">
      <div className="cp-modal" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="cp-header">
          <div className="cp-header-left">
            <div className="cp-icon-badge">
              <Lock size={15} />
            </div>
            <h2 className="cp-title">Change password</h2>
          </div>
          <button
            type="button"
            className="cp-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={14} />
          </button>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="cp-error" role="alert">
            <AlertCircle size={15} className="cp-error-icon" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="cp-form">
          {fields.map((field) => (
            <div key={field.id} className="cp-field">
              <label htmlFor={field.id} className="cp-label">
                {field.label}
              </label>
              <div className="cp-input-row">
                <Lock size={15} className="cp-input-icon" aria-hidden="true" />
                <input
                  id={field.id}
                  type={showPasswords[field.showKey] ? 'text' : 'password'}
                  className="cp-input"
                  placeholder={field.placeholder}
                  name={field.name}
                  value={field.value}
                  onChange={handleChange}
                  required
                  autoComplete={field.name === 'currentPassword' ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  className="cp-toggle"
                  onClick={() => togglePasswordVisibility(field.showKey)}
                  aria-label={showPasswords[field.showKey] ? 'Hide password' : 'Show password'}
                  tabIndex="-1"
                >
                  {showPasswords[field.showKey]
                    ? <EyeOff size={15} />
                    : <Eye size={15} />
                  }
                </button>
              </div>

              {/* Strength indicator for new password */}
              {field.showStrength && formData.newPassword && strength && (
                <div className="cp-strength">
                  <div className="cp-strength-bar">
                    <div
                      className={`cp-strength-fill ${strength.className}`}
                      style={{ width: strength.width }}
                    />
                  </div>
                  <span className={`cp-strength-label ${strength.className}`}>
                    {strength.label}
                  </span>
                </div>
              )}
            </div>
          ))}

          {/* Actions */}
          <div className="cp-actions">
            <a href="/forgot-password" className="cp-forgot-link">
              Forgot password?
            </a>
            <div className="cp-buttons">
              <button
                type="button"
                className="cp-btn-cancel"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="cp-btn-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="cp-spinner" aria-hidden="true" />
                    Saving...
                  </>
                ) : (
                  'Change password'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}