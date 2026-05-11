import Guide from '../../models/Guide.js'

function toApiShape(row) {
  return {
    slug:         row.slug,
    title:        row.title,
    country:      row.country,
    city:         row.city,
    circuit:      row.circuit,
    coordinates:  { lat: parseFloat(row.lat), lng: parseFloat(row.lng) },
    weather:      { location: row.weather_location },
    circuitInfo:  row.circuit_info,
    guideSections: row.guide_sections,
    hotels:       row.hotels,
  }
}

export async function getAllGuides() {
  const rows = await Guide.findAll({ order: [['title', 'ASC']] })
  return rows.map(toApiShape)
}

export async function getGuideBySlug(slug) {
  const row = await Guide.findByPk(slug)
  return row ? toApiShape(row) : null
}
