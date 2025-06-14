import { Flag, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getPosts } from "../api/post";
import { Modal } from "../components/Modal";
import NotFound from "../components/NotFound";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import SearchPosts from "../components/SearchPosts";
import type { Post } from "../models";

const PAGE_SIZE = 20;

function Home() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMorePosts, setHasMorePosts] = useState(true);
    const loader = useRef<HTMLDivElement | null>(null);

    // fetch posts
    useEffect(() => {
        getPosts(page, PAGE_SIZE, (page - 1) * PAGE_SIZE).then(posts => {
            setPosts(prev => [...prev, ...posts]);
            setHasMorePosts(posts.length === PAGE_SIZE);
        });
    }, [page]);

    // handle infinite scroll
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
        const locallyAddedPost: Post = {
            ...newPost,
            isLocallyAdded: true,
        }
        setPosts((prev) => [locallyAddedPost, ...prev]);
    };

    // update post
    const handleUpdatePost = async (updatedPost: Post) => {
        setPosts((prev) =>
            prev.map((p) => (p.id === updatedPost.id ? updatedPost : p))
        );
    };

    // filter post deleted
    const handleDeletedPost = (postId: number) => {
        setPosts((prev) => prev.filter((post) => post.id !== postId));
    };

    // search posts
    const handlePostSearch = (postsFound: Post[], searchQuery: string) => {
        setPosts([]);
        let searchResult = [];
        searchResult = locallyPostMatchesSearch(searchQuery);
        if (searchResult.length > 0) {
            searchResult = [...searchResult, ...postsFound];
        }else{
            searchResult = [...postsFound];
        }
        
        setPosts(searchResult);
        setHasMorePosts(false);
    };

    // reset search
    const handleResetSearch = async (isSearchCleared: boolean) => {
        if (!isSearchCleared) return;
        await getPosts(1, PAGE_SIZE, 0).then(posts => {
            setPosts(posts);
            setPage(1);
            setHasMorePosts(posts.length === PAGE_SIZE);
        });
    }

    const locallyPostMatchesSearch = (searchQuery: string) => {
        const localMatches: Post[] = []
        posts.forEach((post) => {
            if (post.isLocallyAdded && (post.title.includes(searchQuery) || post.body.includes(searchQuery))) {
                localMatches.push(post);
            }
        })
        return localMatches;
    }

    return (
        <div className="w lg:w-xl w-sm mx-auto my-4">
            <div className="flex items-center justify-between mb-4 px-2">
                <Link to="/">
                    <h1 className="text-3xl font-bold">Posts</h1>
                </Link>
                <button onClick={() => setOpenModal(true)} className="text-blue-500 px-4 py-2 rounded cursor-pointer rounded-full hover:bg-blue-100 transition-colors">
                    Add Post
                </button>
            </div>

            <div className="px-2">
                <SearchPosts onSearch={handlePostSearch} onDeleteFilter={handleResetSearch} />
            </div>

            <div className="flex flex-col gap-4 items-center">
                {Boolean(posts.length == 0) && (<NotFound />)}
                {Boolean(posts.length > 0) && posts.map((post: Post) => (
                    <PostCard key={post.id}
                        post={post}
                        onUpdate={handleUpdatePost}
                        onDelete={handleDeletedPost} />
                ))}
                {/* handle infinite scroll */}
                {Boolean(posts.length > 0) && hasMorePosts && <div ref={loader} >
                    <Loader2 className="size-7 animate-spin text-gray-500" />
                </div>}
                {!hasMorePosts && (<div className="flex items-center justify-center gap-2 text-gray-400 my-2">
                    <Flag className="size-7" />
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

export default Home;
