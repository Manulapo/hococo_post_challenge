import { Edit } from "lucide-react"
import type { Post } from "../models"
import PostFooter from "./PostFooter"
import TagPill from "./TagPill"
import { useEffect, useRef, useState } from "react"
import { Modal } from "./Modal"
import PostForm from "./PostForm"

const PostCard = ({ post, onUpdate, onDelete }: {
    post: Post,
    onUpdate: (post: Post) => void,
    onDelete?: (postId: number) => void
}) => {
    const [openModal, setOpenModal] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const textRef = useRef<HTMLParagraphElement>(null);
    const [isClamped, setIsClamped] = useState(false);
    const handleTextClick = (e: React.MouseEvent<HTMLParagraphElement>) => {
        e.stopPropagation();
        setShowMore(!showMore);
    }

    useEffect(() => {
        const el = textRef.current;
        if (el) {
            // content is shorter that it should be
            setIsClamped(el.scrollHeight > el.clientHeight);
        }
    }, [showMore, post.body]);

    return (
        <div className="w-full bg-white p-5 rounded-lg shadow-md/10 border-gray-200 border-1">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold outline-none w-full">{post.title}</h2>
                <Edit className="w-5 h-5 text-gray-500 cursor-pointer hover:text-blue-500 transition-colors" onClick={() => setOpenModal(!openModal)} />
            </div>
            <p
                ref={textRef}
                className={`text-gray-700 ${showMore ? "" : "line-clamp-3"}`}
                onClick={handleTextClick}
            >
                {post.body}
            </p>
            {isClamped && !showMore && <span className="text-xs font-semibold cursor-pointer" onClick={handleTextClick}>Show more</span>}
            <div className="mt-3 text-sm text-gray-500 gap-1 flex flex-wrap">
                {post.tags.map((tag, index) => (
                    <TagPill key={index} tag={tag} />
                ))}
            </div>
            <div className="flex items-center justify-end mt-2">
                {post.reactions && <PostFooter
                    reactions={{ ...post.reactions }}
                    views={post.views}
                />}
            </div>

            <Modal
                isOpen={openModal}
                onClose={() => setOpenModal(false)}
            >
                <PostForm
                    post={post}
                    setOpenModal={setOpenModal}
                    onUpdate={onUpdate}
                    onDelete={onDelete} />
            </Modal>
        </div>
    )
}

export default PostCard