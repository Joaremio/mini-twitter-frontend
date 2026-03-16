import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/services/api";

export function usePosts(search: string = "") {
  return useInfiniteQuery({
    queryKey: ["posts", search],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get("/posts", {
        params: {
          page: pageParam,
          limit: 10,
          search: search || undefined,
        },
      });
      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const totalPages = Math.ceil(lastPage.total / 10);
      return lastPage.page < totalPages ? lastPage.page + 1 : undefined;
    },
  });
}
