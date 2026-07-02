import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { OrderResponse } from '@/types'

async function fetchOrderDetails(orderId: string): Promise<OrderResponse> {
  const { data } = await api.get<OrderResponse>(`/api/v1/orders/${orderId}`)
  return data
}

export function useOrderDetails(orderId: string | null) {
  return useQuery({
    queryKey: ['order-details', orderId],
    queryFn: () => fetchOrderDetails(orderId!),
    enabled: !!orderId,
  })
}
