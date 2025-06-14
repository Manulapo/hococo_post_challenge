import { Trash2Icon } from "lucide-react";
import { useState } from "react";
import type { NewPost, Post } from "../models";
import { addNewPost, deletePost, updatePost } from "../api/post";

const PostForm = ({ post, setOpenModal, onUpdate, onCreate, onDelete }: {
    post?: Post,
    setOpenModal: (open: boolean) => void,
    onUpdate?: (post: Post) => void
    onCreate?: (post: Post) => void
    onDelete?: (postId: number) => void
}) => {
    const [postData, setPostData] = useState<Post | NewPost>({
        id: post?.id,
        title: post?.title || '',
        body: post?.body || '',
        tags: post?.tags || [],
        reactions: post?.reactions || { likes: 0, dislikes: 0 },
        isLocallyAdded: post?.isLocallyAdded || false,
        views: post?.views || 0,
        userId: post?.userId || 1
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (post) {
            const updatedPost = post.isLocallyAdded ? postData : await updatePost(postData as Post);
            onUpdate?.(updatedPost); // state lifter
        } else {
            const newPost = await addNewPost(postData as NewPost);
            onCreate?.(newPost); // state lifter
        }
        setOpenModal(false);
    }

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (post && post.id) {
            const deletedPost = post.isLocallyAdded ? post : await deletePost(post.id);
            
            onDelete?.(deletedPost.id); // state lifter
            setOpenModal(false);
        } else {
            console.error('Post not found or invalid ID');
        }
    }

    return (
        <div className="w-full bg-white p-5">
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="font-bold block text-gray-700 mb-2">Title</label>
                    <input
                        type="text"
                        value={postData.title}
                        onChange={(e) => setPostData({ ...postData, title: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="font-bold block text-gray-700 mb-2">Content</label>
                    <textarea
                        value={postData.body}
                        onChange={(e) => setPostData({ ...postData, body: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-40"
                        rows={4}
                        required
                    />
                </div>
                <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                        <label className="font-bold block text-gray-700">Tags</label> <span className="text-xs text-gray-500">(separated with commas)</span>
                    </div>
                    <input
                        type="text"
                        value={postData.tags.join(', ')}
                        onChange={(e) => setPostData({ ...postData, tags: e.target.value.split(',').map(tag => tag.trim()) })}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex justify-end mt-6">
                    <div className="flex items-center gap-2">
                        {post && <button onClick={handleDelete} className="hover:bg-red-200 hover:text-red-500 text-gray-500 cursor-pointer rounded-full p-2 transition-colors">
                            <Trash2Icon className="size-5" />
                        </button>}

                        <button type="submit" className="text-blue-500 px-4 py-2 rounded cursor-pointer rounded-full hover:bg-blue-100 hover:text-blue-600 transition-colors">
                            {post ? 'Update Post' : 'Create Post'}
                        </button>

                    </div>
                </div>
            </form>
        </div>
    )
}

export default PostForm