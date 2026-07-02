import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { OrderRequest, OrderResponse } from '@/types'

async function createOrder(payload: OrderRequest): Promise<OrderResponse> {
  const { data } = await api.post<OrderResponse>('/api/v1/orders', payload)
  return data
}

export function useCreateOrder() {
  return useMutation({
    mutationFn: createOrder,
  })
}
