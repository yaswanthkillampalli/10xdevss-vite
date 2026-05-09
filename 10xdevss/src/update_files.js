const fs = require('fs');

// Fix ResetPassword.jsx
let resetContent = fs.readFileSync('./pages/auth/ResetPassword.jsx', 'utf8');
resetContent = resetContent.replace(
  "import { Lock, ArrowRight, Mail, Eye, EyeOff } from 'lucide-react'",
  "import { Lock, ArrowRight, Mail, Eye, EyeOff, ShieldCheck, Zap } from 'lucide-react'"
);
resetContent = resetContent.replace(/\nimport { ShieldCheck, Zap } from 'lucide-react'\n$/, '');
fs.writeFileSync('./pages/auth/ResetPassword.jsx', resetContent);
console.log('✓ Fixed ResetPassword.jsx');

// Update App.jsx
let appContent = fs.readFileSync('./App.jsx', 'utf8');
appContent = appContent.replace(
  "import Register from './pages/auth/Register.jsx'",
  "import Register from './pages/auth/Register.jsx'\nimport ForgotPassword from './pages/auth/ForgotPassword.jsx'\nimport ResetPassword from './pages/auth/ResetPassword.jsx'"
);
appContent = appContent.replace(
  '<Route path="register" element={<Register />} />\n            <Route path="profile/:userId"',
  '<Route path="register" element={<Register />} />\n            <Route path="forgot-password" element={<ForgotPassword />} />\n            <Route path="reset-password" element={<ResetPassword />} />\n            <Route path="profile/:userId"'
);
fs.writeFileSync('./App.jsx', appContent);
console.log('✓ Updated App.jsx');

// Update ProfileMenu.jsx
let menuContent = fs.readFileSync('./components/ProfileMenu.jsx', 'utf8');
menuContent = menuContent.replace(
  "import React from 'react';",
  "import React, { useState } from 'react';"
);
menuContent = menuContent.replace(
  "import '../styles/components/ProfileMenu.css';",
  "import ChangePassword from './ChangePassword';\nimport '../styles/components/ProfileMenu.css';"
);
menuContent = menuContent.replace(
  "const initials = (profileName || 'JD')\n    .split(' ')",
  "const [showChangePassword, setShowChangePassword] = useState(false);\n  const [successMessage, setSuccessMessage] = useState('');\n  const initials = (profileName || 'JD')\n    .split(' ')"
);
menuContent = menuContent.replace(
  '        <li><hr className="dropdown-divider" /></li>\n\n        <li>\n          <Link to="/profile"',
  '        <li><hr className="dropdown-divider" /></li>\n\n        <li>\n          <button\n            type="button"\n            className="dropdown-item portfolio-dropdown-item"\n            onClick={() => setShowChangePassword(true)}\n          >\n            🔐 Change Password\n          </button>\n        </li>\n\n        <li><hr className="dropdown-divider" /></li>\n\n        <li>\n          <Link to="/profile"'
);
menuContent = menuContent.replace(
  '        </li>\n      </ul>\n    </div>\n  );\n}',
  '        </li>\n      </ul>\n      {showChangePassword && (\n        <ChangePassword\n          onClose={() => setShowChangePassword(false)}\n          onSuccess={(msg) => {\n            setSuccessMessage(msg);\n            setTimeout(() => setSuccessMessage(\'\'), 3000);\n          }}\n        />\n      )}\n      {successMessage && (\n        <div className="dropdown-success-toast">{successMessage}</div>\n      )}\n    </div>\n  );\n}'
);
fs.writeFileSync('./components/ProfileMenu.jsx', menuContent);
console.log('✓ Updated ProfileMenu.jsx');

// Update api.js
let apiContent = fs.readFileSync('./authentication/api.js', 'utf8');
const passwordFuncs = `
const changePassword = async (payload) => {
  const response = await api.post('/api/auth/change-password', payload)
  saveAuthTokens({
    token: response.data?.token,
    refreshToken: response.data?.refreshToken,
    expiresAt: response.data?.expiresAt,
    refreshExpiresAt: response.data?.refreshExpiresAt,
  })
  return response.data
}

const forgotPassword = async (emailId) => {
  const response = await api.post('/api/auth/forgot-password', { emailId })
  return response.data
}

const resetPassword = async (payload) => {
  const response = await api.post('/api/auth/reset-password', payload)
  saveAuthTokens({
    token: response.data?.token,
    refreshToken: response.data?.refreshToken,
    expiresAt: response.data?.expiresAt,
    refreshExpiresAt: response.data?.refreshExpiresAt,
  })
  return response.data
}
`;

apiContent = apiContent.replace('export {', passwordFuncs + '\nexport {');
apiContent = apiContent.replace(
  'deleteCertification,',
  'deleteCertification,\n  changePassword,\n  forgotPassword,\n  resetPassword,'
);
fs.writeFileSync('./authentication/api.js', apiContent);
console.log('✓ Updated api.js');

console.log('\n✅ All files updated successfully!');
