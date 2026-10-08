import { NextResponse } from 'next/server'

const countryCoordinates: Record<string, { latitude: string; longitude: string }> = {
  '+55:11': { latitude: '-23.5505', longitude: '-46.6333' },
  '+55:21': { latitude: '-22.9068', longitude: '-43.1729' },
  '+55:31': { latitude: '-19.9167', longitude: '-43.9345' },
  '+55:41': { latitude: '-25.4284', longitude: '-49.2733' },
  '+55:51': { latitude: '-30.0346', longitude: '-51.2177' },
  '+55:61': { latitude: '-15.7939', longitude: '-47.8828' },
  '+55:71': { latitude: '-12.9777', longitude: '-38.5016' },
  '+55:81': { latitude: '-8.0476', longitude: '-34.8770' },
  '+55:85': { latitude: '-3.7319', longitude: '-38.5267' },
  '+55:91': { latitude: '-1.4558', longitude: '-48.4902' },
  '+55:48': { latitude: '-27.5954', longitude: '-48.5480' },
  '+55:62': { latitude: '-16.6869', longitude: '-49.2648' },
  '+55:92': { latitude: '-3.1190', longitude: '-60.0217' },
  '+55:98': { latitude: '-2.5307', longitude: '-44.3068' },
  '+55': { latitude: '-14.2350', longitude: '-51.9253' },
  '+1': { latitude: '39.8283', longitude: '-98.5795' },
  '+351': { latitude: '39.3999', longitude: '-8.2245' },
  '+44': { latitude: '55.3781', longitude: '-3.4360' },
  '+34': { latitude: '40.4637', longitude: '-3.7492' },
  '+33': { latitude: '46.2276', longitude: '2.2137' },
  '+49': { latitude: '51.1657', longitude: '10.4515' },
  '+39': { latitude: '41.8719', longitude: '12.5674' },
}

export async function POST(request: Request) {
  try {
    const { countryCode, areaCode } = await request.json()
    const normalizedAreaCode = String(areaCode || '').replace(/\D/g, '').slice(0, 2)
    const coordinates = countryCoordinates[`${countryCode}:${normalizedAreaCode}`] || countryCoordinates[countryCode] || countryCoordinates['+55']
    const apiKey = process.env.RAPIDAPI_KEY

    if (!apiKey) return NextResponse.json({ error: 'RapidAPI key is not configured.' }, { status: 500 })

    const url = new URL('https://geocodeapi.p.rapidapi.com/GetNearestCities')
    url.searchParams.set('latitude', coordinates.latitude)
    url.searchParams.set('longitude', coordinates.longitude)
    url.searchParams.set('range', '0')

    const response = await fetch(url, {
      headers: { 'x-rapidapi-key': apiKey, 'x-rapidapi-host': 'geocodeapi.p.rapidapi.com' },
      cache: 'no-store',
    })

    if (!response.ok) return NextResponse.json({ error: 'Could not retrieve nearby cities.' }, { status: response.status })
    const data = await response.json()
    return NextResponse.json({ data, coordinates })
  } catch {
    return NextResponse.json({ error: 'Invalid location request.' }, { status: 400 })
  }
}
