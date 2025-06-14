import { FileX } from "lucide-react"

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center mt-5 text-gray-500">
            <FileX className="size-10 mb-4 text-gray-400" />
            <span>No Post Found</span>
        </div>
    )
}

export default NotFound