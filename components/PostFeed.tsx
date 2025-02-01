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

const POSTS_PER_PAGE = 2; // Changed to show 2 posts at a time

export default function PostFeed() {
  const [posts, setPosts] = useState<PostWithUser[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  const { ref, inView } = useInView({
    threshold: 0.1,
    delay: 100,
    // Add root margin to trigger earlier
    rootMargin: '50px 0px',
    // This is crucial - observe within the scrollable container
    root: document.querySelector('.scroll-container'),
  });

  const fetchPosts = async () => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    try {
      const url = new URL('/api/posts/for-me', window.location.origin);
      if (cursor) {
        url.searchParams.set('cursor', cursor);
      }
      url.searchParams.set('limit', POSTS_PER_PAGE.toString());
      
      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      
      const data: PostsResponse = await response.json();
      
      setPosts(prevPosts => [...prevPosts, ...data.posts]);
      setCursor(data.nextCursor);
      setHasMore(data.nextCursor !== null);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchPosts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch more when scrolling
  useEffect(() => {
    if (inView) {
      fetchPosts();
    }
  }, [inView]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
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

      {/* Loading trigger */}
      <div 
        ref={ref}
        className="h-16 flex items-center justify-center"
      >
        {isLoading && (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
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