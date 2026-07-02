export type TicketTier = 'PLATINUM' | 'VIP' | 'REGULAR'

export interface Ticket {
  id: string
  name: string
  tier: TicketTier
  price: number
  stock: number
  description: string
}

export interface OrderRequest {
  ticket_id: string
  quantity: number
  name: string
  email: string
  whatsapp: string
}

export interface OrderResponse {
  order_id: string
  payment_url: string
  total_amount: number
  ticket: Pick<Ticket, 'id' | 'name' | 'price'>
  quantity: number
}

export type PaymentStatus = 'pending' | 'paid' | 'failed'

export interface PaymentStatusResponse {
  order_id: string
  payment_status: PaymentStatus
  order_status: PaymentStatus
  payment_url: string
}

export type PaymentMethod = 'QRIS' | 'VIRTUAL_ACCOUNT' | 'EWALLET'

export interface CheckinRequest {
  qr_code: string
}

export interface CheckinResponse {
  valid: boolean
  ticket_holder: string
  ticket_type: string
  message: string
}
