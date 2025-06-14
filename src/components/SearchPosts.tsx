import { useState } from "react";
import { searchPosts } from "../api/post";
import type { Post } from "../models";
import { Search, X } from "lucide-react";

const SearchPosts = ({ onSearch, onDeleteFilter }: { onSearch: (postsFound: Post[]) => void, onDeleteFilter: (isSearchCleared:boolean) => void }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [queryText, setQueryText] = useState("");

  // Handle search 
  const handleSearchPosts = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim() === "") {
      console.warn("Search query is empty");
      return;
    }
    const postFound = await searchPosts(searchQuery);
    onSearch?.(postFound)
    setSearchQuery("");
    setQueryText(searchQuery);
  }

  // Clear search filter
  const handleDeleteFilter = () => {
    setQueryText("");
    setSearchQuery("");
    onDeleteFilter?.(true);
  }

  return (
    <div>
      <form onSubmit={handleSearchPosts}>
        <div className="flex items-center justify-center mb-4">
          <input
            type="text"
            placeholder="Search posts"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 px-4 border border-gray-300 border-1 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="text-blue-500 px-4 py-2 rounded cursor-pointer rounded-full hover:bg-blue-100 transition-colors ml-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={searchQuery.trim() === ""}
          >
            <Search className="inline size-4" />
          </button>
        </div>
      </form>
      {queryText && <p className="text-sm text-gray-500 mb-5 flex items-center gap-2">
        Displayed results for <span className=" flex w-max  items-center gap-2 font-semibold bg-gray-200 rounded-full px-3 py-1">{queryText} 
          <X className="size-4 cursor-pointer" onClick={handleDeleteFilter}/>
          </span>
      </p>}
    </div >
  )
}

export default SearchPosts