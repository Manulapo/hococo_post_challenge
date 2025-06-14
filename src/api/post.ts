import type { NewPost, Post } from "../models";

const URL = 'https://dummyjson.com/posts';

export const getAllPosts = async () => {
  try {
    const response = await fetch(URL);

    if (!response.ok) {
      throw new Error('Error retrieving posts');
    }

    const data = await response.json();
    return data.posts;

  } catch (error) {
    console.error('Failed to fetch all posts:', error);
    return [];
  }
}

export const getPosts = async (page: number, limit: number, skip: number = 20) => {
  try {
    const api_call = `${URL}?page=${page}&limit=${limit}&skip=${skip}`;
    const response = await fetch(api_call);

    if (!response.ok) {
      throw new Error('Error retrieving posts');
    }

    const data = await response.json();
    return data.posts;

  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return [];
  }
}

export const addNewPost = async (post: NewPost) => {
  if (!post || !post.title || !post.body) {
    console.error('Invalid post data');
    return null;
  }

  try {
    const response = await fetch(`${URL}/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: post.title,
        body: post.body,
        userId: post.userId,
        tags: post.tags || [],
        reactions: post.reactions || { likes: 0, dislikes: 0, views: 0 },
      }),
    });

    if (!response.ok) {
      throw new Error('Error adding new post');
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Failed to add new post:', error);
    return null;
  }
}

export const updatePost = async (post: Post) => {
  const { id } = post;
  if (!post || !id) {
    console.error('Invalid post data or ID');
    return null;
  }

  try {
    const response = await fetch(`${URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: post.id,
        userId: post.userId,
        title: post.title,
        body: post.body,
        tags: post.tags,
        reactions: post.reactions,
      }),
    });

    if (!response.ok) {
      throw new Error('Error updating post');
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Failed to update post:', error);
    return null;
  }
}

export const deletePost = async (id: number) => {
  if (!id) {
    console.error('Invalid post ID');
    return null;
  }

  try {
    const response = await fetch(`${URL}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Error deleting post');
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Failed to delete post:', error);
    return false;
  }
}

export const searchPosts = async (query: string) => {
  if (!query) {
    console.error('Search query is empty');
    return [];
  }

  try {
    const response = await fetch(`${URL}/search?q=${query}`);

    if (!response.ok) {
      throw new Error('Error searching posts');
    }

    const data = await response.json();
    return data.posts;

  } catch (error) {
    console.error('Failed to search posts:', error);
    return [];
  }
}