import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'

// Podium position styles — subtle glow keeps them premium, not garish
const PODIUM = {
  1: { color: '#FFD700', textShadow: '0 0 10px rgba(255,215,0,0.35)' },
  2: { color: '#C0C0C0', textShadow: '0 0 8px rgba(192,192,192,0.25)' },
  3: { color: '#CD7F32', textShadow: '0 0 8px rgba(205,127,50,0.25)' },
}
const DEFAULT_POSITION_STYLE = { color: 'rgba(255,255,255,0.35)' }

/**
 * Reusable standings table.
 *
 * Props:
 *   columns       — array of { key, label, className?, cellClassName?, colorBar?: boolean }
 *   data          — array of row objects keyed by the column keys
 *   resolveColor  — optional (row) => hexColor — drives the slim color bar on columns
 *                   marked with colorBar: true
 */
export default function StandingsTable({ columns, data, resolveColor }) {
  return (
    <div className="rounded-xl overflow-hidden border border-white/[0.08]" style={{ background: 'rgba(15, 32, 39, 0.6)' }}>
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

                  // Position cell — podium or neutral
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

                  // Points cell — always bold white
                  if (col.key === 'points') {
                    return (
                      <TableCell key={col.key} className={col.cellClassName}>
                        <span className="font-extrabold text-white">{value}</span>
                      </TableCell>
                    )
                  }

                  // Color bar cell — slim vertical accent beside text
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

                  // Default cell
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
  )
}
