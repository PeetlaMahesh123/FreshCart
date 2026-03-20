import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { amount, currency, receipt, notes } = await req.json()

    // Razorpay test key (in production, use environment variables)
    const razorpayKey = 'rzp_test_1DP5mmOlF5GFOg'
    const razorpaySecret = 'your_test_secret' // This should be in environment variables

    // For demo purposes, we'll create a mock order
    // In production, you'd make a real API call to Razorpay
    const mockOrder = {
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      entity: "order",
      amount: amount,
      currency: currency,
      status: "created",
      receipt: receipt,
      notes: notes,
      created_at: Math.floor(Date.now() / 1000)
    }

    return new Response(JSON.stringify(mockOrder), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
