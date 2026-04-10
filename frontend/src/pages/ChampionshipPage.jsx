import { useState } from 'react'
import StandingsTable from '../components/standings/StandingsTable'
import useStandings from '../hooks/useStandings'
import { fetchDriverStandings, fetchConstructorStandings } from '../services/standingsService'
import { resolveTeamColor } from '../components/standings/teamColors'

const TABS = [
  { id: 'drivers',      label: 'Drivers' },
  { id: 'constructors', label: 'Constructors' },
]

const driverColumns = [
  { key: 'position',    label: '#' },
  { key: 'name',        label: 'Driver',      colorBar: true },
  { key: 'nationality', label: 'Nationality' },
  { key: 'team',        label: 'Team' },
  { key: 'points',      label: 'Points' },
  { key: 'wins',        label: 'Wins' },
]

const constructorColumns = [
  { key: 'position',    label: '#' },
  { key: 'name',        label: 'Constructor', colorBar: true },
  { key: 'nationality', label: 'Nationality' },
  { key: 'points',      label: 'Points' },
  { key: 'wins',        label: 'Wins' },
]

// Stable module-level resolvers — no re-creation on render
const resolveDriverColor      = (row) => resolveTeamColor(row.teamId, row.team)
const resolveConstructorColor = (row) => resolveTeamColor(null, row.name)

export default function ChampionshipPage() {
  const [activeTab, setActiveTab] = useState('drivers')

  // Both fetches fire simultaneously on mount — tab switches are instant
  const drivers      = useStandings(fetchDriverStandings)
  const constructors = useStandings(fetchConstructorStandings)

  const active       = activeTab === 'drivers' ? drivers : constructors
  const columns      = activeTab === 'drivers' ? driverColumns : constructorColumns
  const resolveColor = activeTab === 'drivers' ? resolveDriverColor : resolveConstructorColor
  const season       = drivers.data?.season ?? constructors.data?.season

  return (
    <div
      className="min-h-svh px-6 pb-14 pt-36 sm:px-12"
      style={{ background: 'linear-gradient(180deg, rgba(15, 32, 39, 1) 40%, rgba(44, 83, 100, 1) 100%)' }}
    >
      <div className="max-w-[1200px] mx-auto">

        {/* Page heading */}
        <div className="mb-8">
          <p className="flex items-center gap-2 text-[11px] font-extrabold tracking-[4px] uppercase text-white/40 mb-3">
            <span>🏁</span>
            <span>Formula 1 · {season ? `${season} Season` : 'Current Season'}</span>
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white uppercase tracking-[2px]">
            Championship
          </h1>
        </div>

        {/* Tab switcher */}
        <div
          className="inline-flex rounded-xl border border-white/[0.08] p-1 mb-8"
          style={{ background: 'rgba(15, 32, 39, 0.8)' }}
        >
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`px-6 py-2 rounded-lg text-[11px] font-extrabold uppercase tracking-[2px] transition-all duration-300 cursor-pointer ${
                activeTab === id
                  ? 'bg-[linear-gradient(135deg,#3d7a96,#2C5364,#1a3340)] text-white shadow-[0_0_16px_rgba(44,83,100,0.4)]'
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        {active.loading && <StandingsStatus type="loading" />}
        {active.error   && <StandingsStatus type="error" message={active.error} />}
        {!active.loading && !active.error && active.data && (
          <StandingsTable columns={columns} data={active.data.rows} resolveColor={resolveColor} />
        )}

      </div>
    </div>
  )
}

function StandingsStatus({ type, message }) {
  return (
    <div
      className="rounded-xl border border-white/[0.08] px-4 py-16 text-center"
      style={{ background: 'rgba(15, 32, 39, 0.6)' }}
    >
      {type === 'loading' ? (
        <p className="text-[11px] font-extrabold uppercase tracking-[4px] text-white/30 animate-pulse">
          Loading standings...
        </p>
      ) : (
        <>
          <p className="text-[11px] font-extrabold uppercase tracking-[4px] text-white/40 mb-3">
            Unable to load standings
          </p>
          <p className="text-[12px] text-white/25">{message}</p>
        </>
      )}
    </div>
  )
}
