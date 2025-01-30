interface FileInfoProps {
    fileName: string
    fileSize: number
}

export function FileInfo({ fileName, fileSize }: FileInfoProps) {
    return (
        <div className="w-full p-4 rounded-xl border border-gray-300 mb-3 shadow-sm">
            <div className="flex items-center justify-center">
                <div className="flex flex-col items-center overflow-hidden">
                    <p className="text-lg font-semibold text-gray-900 leading-7 overflow-hidden whitespace-nowrap text-ellipsis max-w-full">
                        {fileName}
                    </p>
                    <p className="mt-2 text-sm text-gray-600 leading-5">
                        {(fileSize / (1024 * 1024)).toFixed(2)} MB
                    </p>
                </div>
            </div>
        </div>
    )
}