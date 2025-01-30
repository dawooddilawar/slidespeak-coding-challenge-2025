interface ProgressCircleProps {
    progress: number
}

export function ProgressCircle({ progress }: ProgressCircleProps) {
    const circumference = 2 * Math.PI * 12
    return (
        <div className="w-7 h-7 relative">
            <svg className="transform -rotate-90 w-7 h-7" viewBox="0 0 28 28">
                <circle
                    className="text-gray-200"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="transparent"
                    r="12"
                    cx="14"
                    cy="14"
                />
                <circle
                    className="text-blue-600"
                    strokeWidth="4"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - (progress / 100) * circumference}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="12"
                    cx="14"
                    cy="14"
                />
            </svg>
        </div>
    )
}