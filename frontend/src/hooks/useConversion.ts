'use client'

import { useState, useEffect } from 'react'
import { ConversionStatus } from '@/types/conversion'
import { api } from '@/services/api'

export function useConversion() {
    const [isConverting, setIsConverting] = useState(false)
    const [conversionId, setConversionId] = useState<string | null>(null)
    const [conversionStatus, setConversionStatus] = useState<ConversionStatus>({
        status: 'uploading',
        progress: 0,
        url: null,
        error: null
    })
    const [error, setError] = useState<string | null>(null)

    const startConversion = async (file: File) => {
        try {
            setIsConverting(true)
            setError(null)
            setConversionStatus({
                status: 'uploading',
                progress: 0,
                url: null,
                error: null
            })

            // Set to 25% as soon as upload starts
            setConversionStatus(prev => ({
                ...prev,
                progress: 25
            }))

            const { data } = await api.convertFile(file)
            setConversionId(data.id)

            // After successful upload, move to converting stage
            setConversionStatus(prev => ({
                ...prev,
                status: 'converting',
                progress: 50
            }))
        } catch (err) {
            setError('We couldn\'t process your file at the moment. Please try again.')
            setIsConverting(false)
            setConversionStatus(prev => ({
                ...prev,
                status: 'error',
                error: 'We couldn\'t process your file at the moment. Please try again.'
            }))
        }
    }

    useEffect(() => {
        if (!conversionId || !isConverting) return

        const pollStatus = async () => {
            try {
                const { data: status } = await api.getConversionStatus(conversionId)
                setConversionStatus(status)

                if (status.status === 'completed') {
                    setIsConverting(false)
                } else if (status.status === 'error') {
                    setError('We couldn\'t process your file at the moment. Please try again.')
                    setIsConverting(false)
                }
            } catch (err) {
                setError('We couldn\'t process your file at the moment. Please try again.')
                setIsConverting(false)
                setConversionStatus(prev => ({
                    ...prev,
                    status: 'error',
                    error: 'We couldn\'t process your file at the moment. Please try again.'
                }))
            }
        }

        const interval = setInterval(pollStatus, 2000)
        return () => clearInterval(interval)
    }, [conversionId, isConverting])

    const reset = () => {
        setIsConverting(false)
        setConversionId(null)
        setConversionStatus({
            status: 'uploading',
            progress: 0,
            url: null,
            error: null
        })
        setError(null)
    }

    return {
        isConverting,
        conversionStatus,
        error,
        startConversion,
        reset
    }
}