import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { phone } = await request.json()
    const token = process.env.RAPIDAPI_KEY

    if (!token) return NextResponse.json({ error: 'The search could not be completed.' }, { status: 500 })

    const response = await fetch('https://whatsapp-profile-data1.p.rapidapi.com/WhatsappProfileDataWithToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-key': token,
        'x-rapidapi-host': 'whatsapp-profile-data1.p.rapidapi.com',
      },
      body: JSON.stringify({ phone_number: phone }),
      cache: 'no-store',
    })

    const payload = await response.json()
    if (!response.ok) return NextResponse.json({ error: 'The search could not be completed.' }, { status: response.status })

    const picture = payload?.picture ?? payload?.data?.picture ?? null
    return NextResponse.json({ picture, contactId: payload?.contact_id ?? null })
  } catch {
    return NextResponse.json({ error: 'The search could not be completed right now.' }, { status: 500 })
  }
}
