import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Ticket } from '@/types'

async function fetchTickets(): Promise<Ticket[]> {
  const { data } = await api.get<Ticket[]>('/api/v1/tickets')
  return data
}

export function useTickets() {
  return useQuery({
    queryKey: ['tickets'],
    queryFn: fetchTickets,
    staleTime: 30_000,
  })
}
