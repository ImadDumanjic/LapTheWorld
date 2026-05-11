import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'

const PODIUM = {
  1: { color: '#FFD700', textShadow: '0 0 10px rgba(255,215,0,0.35)' },
  2: { color: '#C0C0C0', textShadow: '0 0 8px rgba(192,192,192,0.25)' },
  3: { color: '#CD7F32', textShadow: '0 0 8px rgba(205,127,50,0.25)' },
}
const DEFAULT_POSITION_STYLE = { color: 'rgba(255,255,255,0.35)' }

function MobileCard({ row, columns, resolveColor }) {
  const [expanded, setExpanded] = useState(false)
  const teamColor = resolveColor ? resolveColor(row) : null

  const nameCol = columns.find(c => c.colorBar)
  const secondaryCols = columns.filter(c => c.key !== 'position' && !c.colorBar && c.key !== 'points')

  return (
    <div
      className="rounded-xl border border-white/[0.08] overflow-hidden"
      style={{ background: 'rgba(15, 32, 39, 0.6)' }}
    >
      <button
        className="w-full flex items-center gap-3 px-4 py-3 text-left cursor-pointer"
        onClick={() => setExpanded(v => !v)}
      >
        <span
          className="w-7 font-extrabold tabular-nums text-sm flex-shrink-0"
          style={PODIUM[row.position] ?? DEFAULT_POSITION_STYLE}
        >
          {row.position}
        </span>

        <span className="flex items-center gap-2 flex-1 min-w-0">
          {teamColor && (
            <span
              className="w-[3px] h-[18px] rounded-full flex-shrink-0 opacity-90"
              style={{ background: teamColor }}
            />
          )}
          <span className="text-white text-sm font-semibold truncate">
            {nameCol ? row[nameCol.key] : ''}
          </span>
        </span>

        <span className="font-extrabold text-white text-sm flex-shrink-0">
          {row.points} <span className="text-white/40 font-normal text-xs">pts</span>
        </span>

        <svg
          className={`w-4 h-4 text-white/40 flex-shrink-0 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="border-t border-white/[0.08] px-4 py-3 flex flex-col gap-2.5">
          {secondaryCols.map(col => (
            <div key={col.key} className="flex justify-between items-center">
              <span className="text-white/40 text-[11px] uppercase tracking-[2px]">{col.label}</span>
              <span className="text-white text-[13px] font-semibold">{row[col.key]}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function StandingsTable({ columns, data, resolveColor }) {
  return (
    <>
      {/* Mobile cards */}
      <div className="flex flex-col gap-2 sm:hidden">
        {data.map((row, idx) => (
          <MobileCard key={idx} row={row} columns={columns} resolveColor={resolveColor} />
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block rounded-xl overflow-hidden border border-white/[0.08]" style={{ background: 'rgba(15, 32, 39, 0.6)' }}>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-white/[0.08]">
              {columns.map((col) => (
                <TableHead key={col.key} className={col.className}>
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, idx) => {
              const teamColor = resolveColor ? resolveColor(row) : null

              return (
                <TableRow key={idx}>
                  {columns.map((col) => {
                    const value = row[col.key]

                    if (col.key === 'position') {
                      return (
                        <TableCell key={col.key} className="w-12 font-bold">
                          <span
                            className="font-extrabold tabular-nums"
                            style={PODIUM[value] ?? DEFAULT_POSITION_STYLE}
                          >
                            {value}
                          </span>
                        </TableCell>
                      )
                    }

                    if (col.key === 'points') {
                      return (
                        <TableCell key={col.key} className={col.cellClassName}>
                          <span className="font-extrabold text-white">{value}</span>
                        </TableCell>
                      )
                    }

                    if (col.colorBar && teamColor) {
                      return (
                        <TableCell key={col.key} className={col.cellClassName}>
                          <span className="flex items-center gap-2.5">
                            <span
                              className="w-[3px] h-[18px] rounded-full flex-shrink-0 opacity-90"
                              style={{ background: teamColor }}
                            />
                            <span>{value}</span>
                          </span>
                        </TableCell>
                      )
                    }

                    return (
                      <TableCell key={col.key} className={col.cellClassName}>
                        {value}
                      </TableCell>
                    )
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
