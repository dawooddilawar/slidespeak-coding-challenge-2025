'use client'

import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { FileDropzone } from '@/components/FileUpload/FileDropzone'
import { FileInfo } from '@/components/FileUpload/FileInfo'
import { ConversionOptions } from '@/components/FileUpload/ConversionOptions'
import { ConversionStatus } from '@/components/FileUpload/ConversionStatus'
import { useFileUpload } from '@/hooks/useFileUpload'
import { useConversion } from '@/hooks/useConversion'
import {LoadingIndicatorIcon} from "@/icons/LoadingIndicatorIcon";
import {PdfIcon} from "@/icons/PdfIcon";
import {CheckIcon} from "@/icons/CheckIcon";
import {ErrorIcon} from "@/icons/ErrorIcon";

export function FileUpload() {
    const { file, error: fileError, handleFileDrop, clearFile } = useFileUpload()
    const {
        isConverting,
        conversionStatus,
        error: conversionError,
        startConversion,
        reset
    } = useConversion()

    const handleConvert = async () => {
        if (!file) return
        try {
            await startConversion(file)
        } catch (err) {
            console.error('Conversion error:', err)
        }
    }

    const handleReset = () => {
        clearFile()
        reset()
    }

    return (
        <Card>
            {!file && <FileDropzone onDrop={handleFileDrop} />}

            {file && !isConverting && !conversionStatus?.url && !conversionError && (
                <div className="w-full h-full p-6 flex flex-col">
                    <FileInfo fileName={file.name} fileSize={file.size} />
                    <ConversionOptions />
                    <div className="flex space-x-2 mt-auto">
                        <Button variant="secondary" onClick={handleReset} className="flex-1">
                            Cancel
                        </Button>
                        <Button onClick={handleConvert} className="flex-1">
                            Convert
                        </Button>
                    </div>
                </div>
            )}

            {(isConverting || conversionStatus?.status === 'converting') && file && (
                <div className="w-full h-full p-6 flex flex-col">
                    <ConversionStatus
                        status={conversionStatus}
                        fileName={file.name}
                        fileSize={file.size}
                    />
                    <div className="flex space-x-2 mt-auto">
                        <Button variant="secondary" disabled className="flex-1">
                            Cancel
                        </Button>
                        <Button disabled className="flex-1 flex items-center justify-center">
                            <span className="mr-2 animate-spin-pretty">
                                <LoadingIndicatorIcon />
                            </span>
                        </Button>
                    </div>
                </div>
            )}

            {conversionStatus?.url && (
                <div className="w-full h-full p-6 flex flex-col">
                    <div className="w-full h-full p-4 rounded-xl border border-gray-300 mb-3 shadow-[0px_4px_8px_-2px_#1018280F] text-center">
                        <div className="flex flex-col items-center justify-center relative">
                            <PdfIcon />
                            <div className="absolute" style={{ bottom: '-12px' }}>
                                <CheckIcon />
                            </div>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mt-3">
                            File converted successfully!
                        </h3>
                    </div>
                    <div className="flex space-x-2 mt-auto">
                        <Button variant="secondary" onClick={handleReset} className="flex-1">
                            Convert another
                        </Button>
                        <Button
                            onClick={() => {
                                if (conversionStatus?.url) {
                                    window.open(conversionStatus.url, '_blank')
                                }
                            }}
                            className="flex-1"
                        >
                            Download file
                        </Button>
                    </div>
                </div>
            )}

            {(fileError || conversionError) && (
                <div className="w-full h-full p-6 flex flex-col">
                    <div className="w-full h-full p-4 rounded-xl border border-gray-300 mb-3 shadow-[0px_4px_8px_-2px_#1018280F] text-center">
                        <div className='flex justify-center'>
                            <ErrorIcon/>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mt-3">
                            Unable to process file
                        </h3>
                        <p className="text-sm text-gray-600 mt-2">
                            {fileError || "We couldn't process your file at the moment. Please try again."}
                        </p>
                    </div>
                    <div className="flex space-x-2 mt-auto">
                        <Button variant="secondary" onClick={handleReset} className="flex-1">
                            Cancel
                        </Button>
                        <Button onClick={handleReset} className="flex-1">
                            Try Again
                        </Button>
                    </div>
                </div>
            )}
        </Card>
    )
}