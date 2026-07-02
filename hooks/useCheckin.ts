import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { CheckinRequest, CheckinResponse } from '@/types'

async function checkinTicket(payload: CheckinRequest): Promise<CheckinResponse> {
  const { data } = await api.post<CheckinResponse>('/api/v1/checkin', payload)
  return data
}

export function useCheckin() {
  return useMutation({
    mutationFn: checkinTicket,
  })
}
