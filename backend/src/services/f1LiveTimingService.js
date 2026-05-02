import WebSocket from 'ws'

const NEGOTIATE_URL =
  'https://livetiming.formula1.com/signalr/negotiate?connectionData=[{"name":"Streaming"}]&clientProtocol=1.5'

const SUBSCRIBE_MSG = JSON.stringify({
  H: 'Streaming',
  M: 'Subscribe',
  A: [['TimingData', 'DriverList', 'ExtrapolatedClock', 'RaceControlMessages', 'SessionInfo', 'SessionData', 'LapCount', 'WeatherData']],
  I: 1,
})

const RECONNECT_DELAY    = 10_000
const RENEGOTIATE_DELAY  = 30_000

export const liveState = {
  sessionInfo:         {},
  driverList:          {},
  timingData:          {},
  weatherData:         {},
  raceControlMessages: [],
  lapCount:            {},
  sessionActive:       false,
  lastUpdated:         null,
}

let ws         = null
let connecting = false

function isSessionActive(sessionInfo, sessionData) {
  if (!sessionInfo?.Type) return false
  // SessionData status transitions: 'Started' → 'Finished'
  const status = sessionData?.StatusSeries
  if (Array.isArray(status) && status.length) {
    const last = status[status.length - 1]
    if (last?.SessionStatus === 'Finalised' || last?.SessionStatus === 'Ends') return false
  }
  return true
}

function mergeDeep(target, source) {
  if (source == null || typeof source !== 'object') return source ?? target
  for (const key of Object.keys(source)) {
    if (source[key] !== null && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      target[key] = target[key] ?? {}
      mergeDeep(target[key], source[key])
    } else {
      target[key] = source[key]
    }
  }
  return target
}

function handleMessage(raw) {
  let msg
  try { msg = JSON.parse(raw) } catch { return }

  // Heartbeat / empty
  if (!msg.M && !msg.R) return

  const messages = Array.isArray(msg.M) ? msg.M : []
  for (const m of messages) {
    if (m.H !== 'Streaming' || m.M !== 'feed') continue
    const [topic, data] = m.A ?? []
    if (!topic || data == null) continue

    switch (topic) {
      case 'SessionInfo':
        mergeDeep(liveState.sessionInfo, data)
        liveState.sessionActive = isSessionActive(liveState.sessionInfo, liveState.sessionData)
        break
      case 'SessionData':
        liveState.sessionData = liveState.sessionData ?? {}
        mergeDeep(liveState.sessionData, data)
        liveState.sessionActive = isSessionActive(liveState.sessionInfo, liveState.sessionData)
        break
      case 'DriverList':
        mergeDeep(liveState.driverList, data)
        break
      case 'TimingData':
        mergeDeep(liveState.timingData, data)
        break
      case 'WeatherData':
        mergeDeep(liveState.weatherData, data)
        break
      case 'LapCount':
        mergeDeep(liveState.lapCount, data)
        break
      case 'RaceControlMessages': {
        const msgs = data?.Messages
        if (msgs) {
          if (Array.isArray(msgs)) liveState.raceControlMessages = msgs
          else mergeDeep(liveState.raceControlMessages, msgs)
        }
        break
      }
      default:
        break
    }
    liveState.lastUpdated = new Date().toISOString()
  }
}

async function negotiate() {
  const res = await fetch(NEGOTIATE_URL, {
    headers: { 'User-Agent': 'BestHTTP', 'Accept-Encoding': 'gzip,identity' },
  })
  if (!res.ok) throw new Error(`Negotiate failed: ${res.status}`)
  const cookie = res.headers.get('set-cookie') ?? ''
  const body   = await res.json()
  return { token: body.ConnectionToken, cookie }
}

function buildWsUrl(token) {
  const encoded = encodeURIComponent(token)
  return `wss://livetiming.formula1.com/signalr/connect?clientProtocol=1.5&transport=webSockets&connectionToken=${encoded}&connectionData=[{"name":"Streaming"}]`
}

export function connect() {
  if (connecting) return
  connecting = true

  negotiate()
    .then(({ token, cookie }) => {
      connecting = false
      const url = buildWsUrl(token)
      ws = new WebSocket(url, {
        headers: {
          'User-Agent':      'BestHTTP',
          'Accept-Encoding': 'gzip,identity',
          'Cookie':          cookie,
        },
      })

      ws.on('open', () => {
        ws.send(SUBSCRIBE_MSG)
      })

      ws.on('message', handleMessage)

      ws.on('close', () => {
        ws = null
        setTimeout(connect, RECONNECT_DELAY)
      })

      ws.on('error', () => {
        ws?.terminate()
        ws = null
        setTimeout(connect, RECONNECT_DELAY)
      })
    })
    .catch(() => {
      connecting = false
      setTimeout(connect, RENEGOTIATE_DELAY)
    })
}
