/**
 * Maps API country names (from Circuit.Location.country) to ISO 3166-1 alpha-2 codes.
 * Used to build flag image URLs via flagcdn.com.
 */
const COUNTRY_CODE = {
  // Active F1 venues
  Australia:             'au',
  Bahrain:               'bh',
  China:                 'cn',
  Japan:                 'jp',
  'Saudi Arabia':        'sa',
  'United States':       'us',
  USA:                   'us',
  Italy:                 'it',
  Monaco:                'mc',
  Canada:                'ca',
  Spain:                 'es',
  Austria:               'at',
  // UK — API returns the short form "UK" for the British GP
  UK:                    'gb',
  'Great Britain':       'gb',
  'United Kingdom':      'gb',
  Hungary:               'hu',
  Belgium:               'be',
  Netherlands:           'nl',
  Azerbaijan:            'az',
  Singapore:             'sg',
  Mexico:                'mx',
  Brazil:                'br',
  // UAE — API returns the short form "UAE" for the Abu Dhabi GP
  UAE:                   'ae',
  'United Arab Emirates':'ae',
  Qatar:                 'qa',
  // Historical venues
  France:                'fr',
  Germany:               'de',
  Portugal:              'pt',
  Turkey:                'tr',
  Russia:                'ru',
  Vietnam:               'vn',
  Korea:                 'kr',
  Malaysia:              'my',
  India:                 'in',
  'South Africa':        'za',
  Argentina:             'ar',
  Switzerland:           'ch',
}

/**
 * Returns a high-resolution flag image URL for the given country name,
 * or null if the country is not in the mapping.
 *
 * @param {string} country - Country name as returned by the Jolpica API
 * @returns {string | null}
 */
export function getFlagUrl(country) {
  const code = COUNTRY_CODE[country]
  if (!code) return null
  return `https://flagcdn.com/w1280/${code}.png`
}
