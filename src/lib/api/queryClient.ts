import { QueryClient } from '@tanstack/react-query'

/**
 * Creates a fresh QueryClient for use in Server Components.
 * Each request must get its own instance — sharing a singleton across
 * requests would leak data between users in a server environment.
 *
 * Use pattern in page.tsx:
 *   const queryClient = createServerQueryClient()
 *   await queryClient.prefetchQuery({ queryKey: [...], queryFn: ... })
 *   return <HydrationBoundary state={dehydrate(queryClient)}>...</HydrationBoundary>
 */
export function createServerQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data prefetched on the server is considered fresh for 60s on the client,
        // avoiding an immediate refetch after hydration.
        staleTime: 60 * 1000,
        retry: false,
      },
    },
  })
}
