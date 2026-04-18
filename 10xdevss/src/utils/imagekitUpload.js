import { getAccessToken } from '../authentication/api'

const DEFAULT_MAX_FILE_SIZE_MB = 20

// Frontend env vars (safe in browser)
const IMAGEKIT_PUBLIC_KEY = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY
const IMAGEKIT_URL_ENDPOINT = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT
const IMAGEKIT_AUTH_ENDPOINT = import.meta.env.VITE_IMAGEKIT_AUTH_ENDPOINT

// API keys/env required for upload setup:
// Frontend (.env):
// - VITE_IMAGEKIT_PUBLIC_KEY
// - VITE_IMAGEKIT_URL_ENDPOINT
// - VITE_IMAGEKIT_AUTH_ENDPOINT (your backend endpoint that returns signature/expire/token)
// Backend (.env):
// - IMAGEKIT_PUBLIC_KEY
// - IMAGEKIT_PRIVATE_KEY  (NEVER expose this in frontend)
// - IMAGEKIT_URL_ENDPOINT
export const IMAGEKIT_REQUIRED_KEYS = {
  frontend: [
    'VITE_IMAGEKIT_PUBLIC_KEY',
    'VITE_IMAGEKIT_URL_ENDPOINT',
    'VITE_IMAGEKIT_AUTH_ENDPOINT',
  ],
  backend: ['IMAGEKIT_PUBLIC_KEY', 'IMAGEKIT_PRIVATE_KEY', 'IMAGEKIT_URL_ENDPOINT'],
}

export const IMAGEKIT_FILE_TYPES = {
  image: /^image\//i,
  pdf: /^application\/pdf$/i,
  document:
    /^(application\/(pdf|msword|vnd\.openxmlformats-officedocument\.wordprocessingml\.document)|text\/(plain|csv))$/i,
  any: /.+/,
}

const toBytes = (sizeInMb) => sizeInMb * 1024 * 1024

const sanitizeFolderSegment = (value, fallback = 'unknown') => {
  const normalized = String(value || '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  return normalized || fallback
}

const buildUploadFolder = ({ role, rollnumber, uploadType = 'misc' } = {}) => {
  const safeRole = sanitizeFolderSegment(role, 'unknown-role').toLowerCase()
  const safeRollNumber = sanitizeFolderSegment(rollnumber, 'unknown-roll')
  const safeUploadType = sanitizeFolderSegment(uploadType, 'misc').toLowerCase()

  return `/uploads/${safeRole}/${safeRollNumber}/${safeUploadType}`
}

const assertImageKitClientConfig = () => {
  const missing = []

  if (!IMAGEKIT_PUBLIC_KEY) missing.push('VITE_IMAGEKIT_PUBLIC_KEY')
  if (!IMAGEKIT_URL_ENDPOINT) missing.push('VITE_IMAGEKIT_URL_ENDPOINT')
  if (!IMAGEKIT_AUTH_ENDPOINT) missing.push('VITE_IMAGEKIT_AUTH_ENDPOINT')

  if (missing.length) {
    throw new Error(`Missing ImageKit env values: ${missing.join(', ')}`)
  }
}

export const validateUploadFile = ({
  file,
  allowedType = 'any',
  maxFileSizeMb = DEFAULT_MAX_FILE_SIZE_MB,
}) => {
  if (!(file instanceof File)) {
    throw new Error('Please provide a valid File object')
  }

  if (file.size > toBytes(maxFileSizeMb)) {
    throw new Error(`File is too large. Max allowed size is ${maxFileSizeMb}MB`)
  }

  const mimePattern = IMAGEKIT_FILE_TYPES[allowedType] || IMAGEKIT_FILE_TYPES.any
  if (!mimePattern.test(file.type || '')) {
    throw new Error(`Invalid file type for "${allowedType}" upload`)
  }
}

const getAuthParams = async ({ authEndpoint = IMAGEKIT_AUTH_ENDPOINT, authToken }) => {
  const response = await fetch(authEndpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch ImageKit authentication params from backend')
  }

  const data = await response.json()
  const authData = data?.data || data

  if (!authData?.signature || !authData?.expire || !authData?.token) {
    throw new Error('Invalid ImageKit auth response. Expected signature, expire and token')
  }

  return {
    signature: authData.signature,
    expire: authData.expire,
    token: authData.token,
    role: authData.role,
    rollnumber: authData.rollnumber || authData.rollId || authData.rollNumber,
  }
}

export const uploadToImageKit = async ({
  file,
  fileName,
  folder,
  uploadType = 'misc',
  tags = [],
  customMetadata,
  useUniqueFileName = true,
  isPrivateFile = false,
  allowedType = 'any',
  maxFileSizeMb = DEFAULT_MAX_FILE_SIZE_MB,
  authEndpoint,
  authToken,
  signal,
}) => {
  assertImageKitClientConfig()
  validateUploadFile({ file, allowedType, maxFileSizeMb })

  const resolvedAuthToken = authToken || getAccessToken()
  const { signature, expire, token, role, rollnumber } = await getAuthParams({
    authEndpoint,
    authToken: resolvedAuthToken,
  })

  const resolvedFolder = folder || buildUploadFolder({ role, rollnumber, uploadType })

  const formData = new FormData()
  formData.append('file', file)
  formData.append('fileName', fileName || file.name)
  formData.append('publicKey', IMAGEKIT_PUBLIC_KEY)
  formData.append('signature', signature)
  formData.append('expire', String(expire))
  formData.append('token', token)
  formData.append('folder', resolvedFolder)
  formData.append('useUniqueFileName', String(useUniqueFileName))
  formData.append('isPrivateFile', String(isPrivateFile))

  if (tags.length) {
    formData.append('tags', tags.join(','))
  }

  if (customMetadata && typeof customMetadata === 'object') {
    formData.append('customMetadata', JSON.stringify(customMetadata))
  }

  const uploadResponse = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
    method: 'POST',
    body: formData,
    signal,
  })

  if (!uploadResponse.ok) {
    const errorText = await uploadResponse.text()
    throw new Error(`ImageKit upload failed: ${errorText || 'Unknown error'}`)
  }

  const data = await uploadResponse.json()

  return {
    ...data,
    cdnUrl: data.url,
    filePath: data.filePath,
    folder: resolvedFolder,
    role,
    rollnumber,
    thumbnailUrl: data.thumbnailUrl,
    imagekitUrlEndpoint: IMAGEKIT_URL_ENDPOINT,
  }
}

export const uploadImage = async (options) =>
  uploadToImageKit({ ...options, allowedType: 'image' })

export const uploadPdf = async (options) =>
  uploadToImageKit({ ...options, allowedType: 'pdf' })

export const uploadDocument = async (options) =>
  uploadToImageKit({ ...options, allowedType: 'document' })

export default uploadToImageKit
