import { createClient } from '../../../sanity/lib/client'

const client = createClient({
  projectId: 'ms9xwjo9',
  dataset: 'production',
  apiVersion: '2024-02-02',
  token: process.env.NEXT_PUBLIC_SANITY_AUTH_TOKEN,
  useCdn: false
})

export async function submitOrderToSanity(orderDetails: any) {
  try {
    if (!process.env.NEXT_PUBLIC_SANITY_AUTH_TOKEN) {
      throw new Error('Sanity token is not configured')
