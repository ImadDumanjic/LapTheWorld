const FALLBACK_COLOR = '#4a6577' 

const BY_ID = {
  mclaren:      '#FF8700',
  mercedes:     '#27F4D2',
  red_bull:     '#1E41FF',
  ferrari:      '#DC0000',
  williams:     '#005AFF',
  rb:           '#FFFFFF', 
  aston_martin: '#006F62',
  haas:         '#B6BABD',
  alpine:       '#FF87BC',
  audi:         '#C0C0C0',
  cadillac:     '#000000',
}

const BY_NAME = {
  'mclaren':                                '#FF8700',
  'mclaren formula 1 team':                 '#FF8700',
  'mercedes':                               '#27F4D2',
  'mercedes-amg petronas formula one team': '#27F4D2',
  'mercedes amg petronas f1 team':          '#27F4D2',
  'red bull racing':                        '#1E41FF',
  'oracle red bull racing':                 '#1E41FF',
  'ferrari':                                '#DC0000',
  'scuderia ferrari':                       '#DC0000',
  'scuderia ferrari hp':                    '#DC0000',
  'williams':                               '#005AFF',
  'williams racing':                        '#005AFF',
  'racing bulls':                           '#FFFFFF',
  'rb':                                     '#FFFFFF',
  'visa cash app rb formula one team':      '#FFFFFF',
  'aston martin':                           '#006F62',
  'aston martin aramco formula one team':   '#006F62',
  'aston martin aramco cognizant formula one team': '#006F62',
  'haas':                                   '#B6BABD',
  'haas f1 team':                           '#B6BABD',
  'moneygram haas f1 team':                 '#B6BABD',
  'alpine':                                 '#FF87BC',
  'bwt alpine f1 team':                     '#FF87BC',
  'audi':                                   '#C0C0C0',
  'audi formula racing gmbh':               '#C0C0C0',
  'cadillac':                               '#000000',
  'andretti global':                        '#000000',
}


export function resolveTeamColor(constructorId, teamName) {
  if (constructorId) {
    const color = BY_ID[constructorId.toLowerCase()]
    if (color) return color
  }
  if (teamName) {
    const color = BY_NAME[teamName.toLowerCase()]
    if (color) return color
  }
  return FALLBACK_COLOR
}
