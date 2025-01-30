'use client'

import { useState, useCallback } from 'react'
import { FileWithPreview } from '@/types/conversion'

export function useFileUpload() {
    const [file, setFile] = useState<FileWithPreview | null>(null)
    const [error, setError] = useState<string | null>(null)

    const handleFileDrop = useCallback((acceptedFiles: File[]) => {
        const uploadedFile = acceptedFiles[0]
        if (uploadedFile?.type !== 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
            setError('Please upload a PowerPoint (.pptx) file')
            return
        }
        setFile(uploadedFile)
        setError(null)
    }, [])

    const clearFile = useCallback(() => {
        setFile(null)
        setError(null)
    }, [])

    return {
        file,
        error,
        handleFileDrop,
        clearFile
    }
}