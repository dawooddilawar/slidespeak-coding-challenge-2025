import { ConversionStatus as ConversionStatusType } from '@/types/conversion'
import { ProgressCircle } from '../ui/ProgressCircle'
import {FileInfo} from "@/components/FileUpload/FileInfo";

interface ConversionStatusProps {
    status: ConversionStatusType
    fileName: string
    fileSize: number
}

export function ConversionStatus({ status, fileName, fileSize }: ConversionStatusProps) {
    return (
        <div className="w-full">
            <FileInfo fileName={fileName} fileSize={fileSize} />

            <div className="w-full p-[18px] rounded-xl border border-gray-300 mb-3">
                <div className="flex items-center">
                    <ProgressCircle progress={status.progress} />
                    <span className="ml-3 text-sm font-medium text-gray-900">
            Converting your file
          </span>
                </div>
            </div>
        </div>
    )
}