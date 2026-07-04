export const SERVICE_FEE = 5000

export function addServiceFee(subtotal: number): number {
  return subtotal + SERVICE_FEE
}