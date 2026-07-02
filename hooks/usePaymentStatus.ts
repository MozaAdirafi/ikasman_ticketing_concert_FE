import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { PaymentStatusResponse } from '@/types'

async function fetchPaymentStatus(orderId: string): Promise<PaymentStatusResponse> {
  const { data } = await api.get<PaymentStatusResponse>(`/api/v1/payments/status/${orderId}`)
  return data
}

export function usePaymentStatus(orderId: string | null) {
  const query = useQuery({
    queryKey: ['payment-status', orderId],
    queryFn: () => fetchPaymentStatus(orderId!),
    enabled: !!orderId,
    refetchInterval: 3_000,
    refetchIntervalInBackground: true,
  })

  return query
}
