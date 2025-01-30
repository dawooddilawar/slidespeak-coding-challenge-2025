export type ConversionStatus = {
    status: 'uploading' | 'converting' | 'completed' | 'error'
    progress: number
    url: string | null
    error: string | null
}

export type FileWithPreview = File & {
    preview?: string
}