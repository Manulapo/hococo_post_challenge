import { Flag } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getPosts, updatePost } from "./api/post";
import { Modal } from "./components/Modal";
import PostCard from "./components/PostCard";
import PostForm from "./components/PostForm";
import type { Post } from "./models";

const PAGE_SIZE = 20;

function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const loader = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    getPosts(page, PAGE_SIZE, (page - 1) * PAGE_SIZE).then(posts => {
      setPosts(prev => [...prev, ...posts]);
      setHasMorePosts(posts.length === PAGE_SIZE);
      console.log(posts)
    });
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      if (!loader.current) return;
      const { top } = loader.current.getBoundingClientRect();
      if (top < window.innerHeight && hasMorePosts) {
        setPage(prev => prev + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMorePosts]);

  // create post
  const handleCreatePost = (newPost: Post) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  // update post
  const handleUpdatePost = async (updatedPost: Post) => {
    const result = await updatePost(updatedPost);
    setPosts((prev) =>
      prev.map((p) => (p.id === result.id ? result : p))
    );
  };

  // filter post deleted
  const handleDeletedPost = (postId: number) => {
    setPosts((prev) => prev.filter((post) => post.id !== postId));
  };

  return (
    <div className="w lg:w-xl w-sm mx-auto my-4">
      <div className="flex items-center justify-between mb-4 px-2">
        <h1 className="text-3xl font-bold">Posts</h1>
        <button onClick={() => setOpenModal(true)} className="text-blue-500 px-4 py-2 rounded cursor-pointer rounded-full hover:bg-blue-100 transition-colors">
          Add Post
        </button>
      </div>

      <div className="flex flex-col gap-4 items-center">
        {posts.map((post: Post) => (
          <PostCard key={post.id}
            post={post}
            onUpdate={handleUpdatePost}
            onDelete={handleDeletedPost} />
        ))}
        {/* handle infinite scroll */}
        <div ref={loader} />
        {!hasMorePosts && (<div className="flex items-center justify-center gap-2 text-gray-400 my-2">
          <Flag className="w-5 h-5" />
          <span>You've reach the page's end</span>
        </div>)}
      </div>

      <Modal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
      >
        <PostForm
          setOpenModal={setOpenModal}
          onCreate={handleCreatePost} />
      </Modal>

    </div>
  );
}

export default App;
