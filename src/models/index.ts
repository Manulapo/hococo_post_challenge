export interface PostReactions {
    likes: number;
    dislikes: number;
}

export interface Post {
    id: number;
    title: string;
    body: string;
    tags: string[];
    reactions: PostReactions;
    views: number;
    userId: number;
    isLocallyAdded?: boolean; 
}

export type NewPost = Omit<Post, 'id'>;

