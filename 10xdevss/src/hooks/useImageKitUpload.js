import { useState } from 'react'

import {
  uploadDocument as uploadDocumentFile,
  uploadImage as uploadImageFile,
  uploadPdf as uploadPdfFile,
  uploadToImageKit,
} from '../utils/imagekitUpload'

const DEFAULT_ACCEPT_BY_TYPE = {
  image: 'image/*',
  pdf: 'application/pdf',
  document: '.pdf,.doc,.docx,.txt,.csv',
  any: undefined,
}

const resolveAccept = ({ allowedType = 'any', accept } = {}) => accept || DEFAULT_ACCEPT_BY_TYPE[allowedType]

export const buildImageKitInputProps = ({
  onFile,
  allowedType = 'any',
  accept,
  multiple = false,
  ...uploadOptions
} = {}) => ({
  type: 'file',
  accept: resolveAccept({ allowedType, accept }),
  multiple,
  onChange: async (event) => {
    const file = event.target.files?.[0]
    if (!file) return null
    return onFile
      ? onFile(file, { ...uploadOptions, allowedType })
      : uploadToImageKit({ ...uploadOptions, file, allowedType })
  },
})

export const useImageKitUpload = (defaultOptions = {}) => {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState(null)
  const [uploadError, setUploadError] = useState(null)

  const uploadFile = async (file, options = {}) => {
    if (!file) {
      throw new Error('Please select a file to upload')
    }

    setIsUploading(true)
    setUploadError(null)

    try {
      const result = await uploadToImageKit({
        ...defaultOptions,
        ...options,
        file,
      })
      setUploadResult(result)
      return result
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Upload failed'
      setUploadError(message)
      throw error
    } finally {
      setIsUploading(false)
    }
  }

  const uploadSelectedFile = async (event, options = {}) => {
    const file = event.target.files?.[0]
    if (!file) return null
    return uploadFile(file, options)
  }

  const getInputProps = (options = {}) =>
    buildImageKitInputProps({
      ...defaultOptions,
      ...options,
      onFile: uploadFile,
    })

  const reset = () => {
    setIsUploading(false)
    setUploadResult(null)
    setUploadError(null)
  }

  return {
    uploadFile,
    uploadSelectedFile,
    getInputProps,
    isUploading,
    uploadResult,
    uploadError,
    reset,
    uploadImage: (file, options = {}) => uploadImageFile({ ...defaultOptions, ...options, file }),
    uploadPdf: (file, options = {}) => uploadPdfFile({ ...defaultOptions, ...options, file }),
    uploadDocument: (file, options = {}) => uploadDocumentFile({ ...defaultOptions, ...options, file }),
  }
}

export default useImageKitUpload
