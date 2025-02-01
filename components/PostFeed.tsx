import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { Post } from '@prisma/client';
import PostComponent from '@/components/dashboard/FeedContent/Post';

interface PostWithUser extends Post {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    profilePicture: string;
    username: string;
  };
  tags: string[];  // Added tags to match Post component interface
}

interface PostsResponse {
  posts: PostWithUser[];
  nextCursor: string | null;
}

export default function PostFeed() {
  const [posts, setPosts] = useState<PostWithUser[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  // Create a ref that detects when element is visible
  const { ref, inView } = useInView({
    threshold: 0,
  });

  const fetchPosts = async () => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    try {
      const url = cursor 
        ? `/api/posts/for-me?cursor=${cursor}`
        : '/api/posts/for-me';
        
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      
      const data: PostsResponse = await response.json();
      
      setPosts(prevPosts => [...prevPosts, ...data.posts]);
      setCursor(data.nextCursor);
      setHasMore(!!data.nextCursor);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch initial posts
  useEffect(() => {
    fetchPosts();
  }, []);

  // Fetch more posts when the loading element comes into view
  useEffect(() => {
    if (inView) {
      fetchPosts();
    }
  }, [inView]);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Posts grid/list */}
      <div className="space-y-4">
        {posts.map((post) => (
          <PostComponent
            key={post.id}
            post={{
              id: post.id,
              content: post.content,
              imageUrl: post.imageUrl,
              createdAt: post.createdAt.toString(),
              user: {
                id: post.user.id,
                firstName: post.user.firstName,
                lastName: post.user.lastName,
                profilePicture: post.user.profilePicture,
              },
              tags: post.tags,
            }}
          />
        ))}
      </div>

      {/* Loading indicator */}
      <div 
        ref={ref} 
        className="py-4 text-center"
      >
        {isLoading && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        )}
        {!hasMore && posts.length > 0 && (
          <p className="text-gray-500">No more posts to load</p>
        )}
        {!hasMore && posts.length === 0 && (
          <p className="text-gray-500">No posts found</p>
        )}
      </div>
    </div>
  );
} 