import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import type { CheckinRequest, CheckinResponse } from '@/types'

type CheckinError = Error & { status?: number }

interface CheckinPayload extends CheckinRequest {
  adminPin?: string
}

const ADMIN_PIN_FALLBACK = process.env.NEXT_PUBLIC_ADMIN_PIN || '1234'

async function checkinTicket(payload: CheckinPayload): Promise<CheckinResponse> {
  const { adminPin, ...body } = payload

  try {
    const { data } = await axios.post<CheckinResponse>(
      `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'}/api/v1/checkin`,
      body,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-PIN': adminPin || ADMIN_PIN_FALLBACK,
        },
        timeout: 10_000,
      }
    )
    return data
  } catch (error) {
    if (axios.isAxiosError<{ message?: string }>(error)) {
      const status = error.response?.status
      const message =
        error.response?.data?.message ??
        error.message ??
        'Terjadi kesalahan saat check-in.'

      const checkinError: CheckinError = new Error(message)
      checkinError.status = status
      throw checkinError
    }

    throw error
  }
}

export function useCheckin() {
  return useMutation({
    mutationFn: checkinTicket,
  })
}
