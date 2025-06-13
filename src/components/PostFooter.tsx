import { Eye, ThumbsDownIcon, ThumbsUpIcon } from "lucide-react"
import type { PostReactions } from "../models"

const PostFooter = ({ reactions, views }: { reactions: PostReactions, views: number }) => {
    return (
        <div className="mt-2 text-sm text-gray-500">
            <div className="flex items-center justify-between gap-2 opacity-80 hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center gap-1">
                    {views}
                    <Eye className="size-4 mr-1" />
                </div>
                <div className="flex items-center gap-1">
                    {reactions.likes}
                    <ThumbsUpIcon className="size-4 mr-1" />
                </div>
                <div className="flex items-center gap-1">
                    {reactions.dislikes}
                    <ThumbsDownIcon className="size-4 mr-1" />
                </div>

            </div>
        </div>
    )
}

export default PostFooter