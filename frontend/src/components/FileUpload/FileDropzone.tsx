'use client'

import { useDropzone } from 'react-dropzone'
import { Button } from '../ui/Button'
import UploadIcon from "@/icons/UploadIcon";

interface FileDropzoneProps {
    onDrop: (files: File[]) => void
}

export function FileDropzone({ onDrop }: FileDropzoneProps) {
    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx']
        },
        maxFiles: 1
    })

    return (
        <div
            {...getRootProps()}
            className="w-full h-full border-2 border-dashed rounded-xl p-6 text-center cursor-pointer border-gray-300 hover:border-gray-400 flex flex-col items-center justify-center"
        >
            <input {...getInputProps()} />
            <div className="mb-4">
                <UploadIcon />
            </div>
            <p className="text-sm text-gray-600 mb-2">
                Drag and drop a PowerPoint file to convert to PDF.
            </p>
            <Button
                variant="custom"
                customStyles={{
                    backgroundColor: '#EFF8FF',
                    textColor: '#175CD3',
                    padding: '10px 16px',
                    width: 'fit-content'
                }}
                onClick={(e) => {
                    e.stopPropagation()
                    const input = document.querySelector('input[type="file"]') as HTMLInputElement
                    if (input) input.click()
                }}
            >
                Choose file
            </Button>
        </div>
    )
}