export type PhoneLocation = {
  city: string
  region: string
  country: string
  latitude: number
  longitude: number
  precision: 'approximate'
  source: 'phone area/country code'
  normalizedPhone: string
}

type LocationEntry = Omit<PhoneLocation, 'normalizedPhone'> & { prefix: string; countryCode: string }

export const phoneLocations: LocationEntry[] = [
  { prefix: '11', countryCode: '+55', city: 'São Paulo', region: 'SP', country: 'Brasil', latitude: -23.5505, longitude: -46.6333, precision: 'approximate', source: 'phone area/country code' },
  { prefix: '21', countryCode: '+55', city: 'Rio de Janeiro', region: 'RJ', country: 'Brasil', latitude: -22.9068, longitude: -43.1729, precision: 'approximate', source: 'phone area/country code' },
  { prefix: '31', countryCode: '+55', city: 'Belo Horizonte', region: 'MG', country: 'Brasil', latitude: -19.9167, longitude: -43.9345, precision: 'approximate', source: 'phone area/country code' },
  { prefix: '41', countryCode: '+55', city: 'Curitiba', region: 'PR', country: 'Brasil', latitude: -25.4284, longitude: -49.2733, precision: 'approximate', source: 'phone area/country code' },
  { prefix: '51', countryCode: '+55', city: 'Porto Alegre', region: 'RS', country: 'Brasil', latitude: -30.0346, longitude: -51.2177, precision: 'approximate', source: 'phone area/country code' },
  { prefix: '61', countryCode: '+55', city: 'Brasília', region: 'DF', country: 'Brasil', latitude: -15.7939, longitude: -47.8828, precision: 'approximate', source: 'phone area/country code' },
  { prefix: '71', countryCode: '+55', city: 'Salvador', region: 'BA', country: 'Brasil', latitude: -12.9777, longitude: -38.5016, precision: 'approximate', source: 'phone area/country code' },
  { prefix: '81', countryCode: '+55', city: 'Recife', region: 'PE', country: 'Brasil', latitude: -8.0476, longitude: -34.877, precision: 'approximate', source: 'phone area/country code' },
  { prefix: '85', countryCode: '+55', city: 'Fortaleza', region: 'CE', country: 'Brasil', latitude: -3.7319, longitude: -38.5267, precision: 'approximate', source: 'phone area/country code' },
  { prefix: '91', countryCode: '+55', city: 'Belém', region: 'PA', country: 'Brasil', latitude: -1.4558, longitude: -48.4902, precision: 'approximate', source: 'phone area/country code' },
]

const countryLocations: LocationEntry[] = [
  { prefix: '', countryCode: '+55', city: 'Localização não identificada', region: 'Brasil', country: 'Brasil', latitude: -14.235, longitude: -51.9253, precision: 'approximate', source: 'phone area/country code' },
  { prefix: '', countryCode: '+1', city: 'Localização não identificada', region: 'North America', country: 'Estados Unidos / Canadá', latitude: 39.8283, longitude: -98.5795, precision: 'approximate', source: 'phone area/country code' },
  { prefix: '', countryCode: '+351', city: 'Localização não identificada', region: 'Portugal', country: 'Portugal', latitude: 39.3999, longitude: -8.2245, precision: 'approximate', source: 'phone area/country code' },
  { prefix: '', countryCode: '+44', city: 'Localização não identificada', region: 'United Kingdom', country: 'Reino Unido', latitude: 55.3781, longitude: -3.436, precision: 'approximate', source: 'phone area/country code' },
]

export function getLocationFromPhone(phone: string): PhoneLocation | null {
  const normalizedPhone = phone.replace(/\D/g, '')
  if (normalizedPhone.length < 8) return null
  const countryCode = phone.trim().startsWith('+55') || normalizedPhone.startsWith('55') ? '+55' : phone.match(/^\+(351|44|1)/)?.[0] || ''
  if (!countryCode) return null
  const national = countryCode === '+55' && normalizedPhone.startsWith('55') ? normalizedPhone.slice(2) : normalizedPhone
  const areaCode = countryCode === '+55' ? national.slice(0, 2) : ''
  const match = phoneLocations.find((entry) => entry.countryCode === countryCode && entry.prefix === areaCode) || countryLocations.find((entry) => entry.countryCode === countryCode)
  return match ? { ...match, normalizedPhone } : null
}

export function getLocationFromPhoneParts(countryCode: string, phone: string) {
  return getLocationFromPhone(`${countryCode}${phone}`)
}

export { countryLocations }
