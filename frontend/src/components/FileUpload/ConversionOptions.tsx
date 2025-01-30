export function ConversionOptions() {
    return (
        <div className="w-full p-4 rounded-xl border-2 border-blue-200 bg-blue-50 mb-3">
            <label className="flex items-center space-x-2 cursor-pointer">
                <input
                    type="radio"
                    checked={true}
                    readOnly
                    className="w-4 h-4 text-blue-600 border-blue-600 focus:ring-blue-600"
                />
                <span className="text-blue-900 text-sm font-medium leading-5">
          Convert to PDF
        </span>
            </label>
            <p className="mt-0.5 text-blue-700 text-sm leading-5 ml-6">
                Best quality, retains images and other assets.
            </p>
        </div>
    )
}