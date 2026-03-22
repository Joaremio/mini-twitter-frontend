import { api } from "@/services/api";
import { useInfiniteQuery } from "@tanstack/react-query";
import { MOCK_POSTS } from "@/mocks/posts";

export function usePosts(search: string = "") {
  const LIMIT = 5;

  return useInfiniteQuery({
    queryKey: ["posts", search],
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const response = await api.get("/posts", {
          params: {
            page: pageParam,
            limit: LIMIT,
            search: search || undefined,
          },
        });

        return response.data;
      } catch (error) {
        console.warn("API indisponível, usando mocks...");

        const filtered = MOCK_POSTS.filter((post) =>
          post.title.toLowerCase().includes(search.toLowerCase()),
        );

        const start = (pageParam - 1) * LIMIT;
        const end = start + LIMIT;

        const paginatedPosts = filtered.slice(start, end);

        return {
          posts: paginatedPosts,
          total: filtered.length,
          page: pageParam,
        };
      }
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const totalPages = Math.ceil(lastPage.total / LIMIT);
      return lastPage.page < totalPages ? lastPage.page + 1 : undefined;
    },
  });
}
