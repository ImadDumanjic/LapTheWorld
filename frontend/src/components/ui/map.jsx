import { cn } from "@/lib/utils"
import "leaflet/dist/leaflet.css"
import { MapPinIcon, MinusIcon, PlusIcon } from "lucide-react"
import React, { Suspense, lazy, useEffect, useRef, useState } from "react"
import { renderToString } from "react-dom/server"
import { useMap, useMapEvents } from "react-leaflet"

// ── Lazy wrappers ─────────────────────────────────────────────────────────────
function createLazyComponent(factory) {
    const LazyComponent = lazy(factory)

    return (props) => {
        const [isMounted, setIsMounted] = useState(false)

        useEffect(() => {
            setIsMounted(true)
        }, [])

        if (!isMounted) return null

        return (
            <Suspense>
                <LazyComponent {...props} />
            </Suspense>
        )
    }
}

const LeafletMapContainer = createLazyComponent(() =>
    import("react-leaflet").then((mod) => ({ default: mod.MapContainer })))

const LeafletTileLayer = createLazyComponent(() =>
    import("react-leaflet").then((mod) => ({ default: mod.TileLayer })))

const LeafletMarker = createLazyComponent(() =>
    import("react-leaflet").then((mod) => ({ default: mod.Marker })))

const LeafletPopup = createLazyComponent(() =>
    import("react-leaflet").then((mod) => ({ default: mod.Popup })))

const LeafletTooltip = createLazyComponent(() =>
    import("react-leaflet").then((mod) => ({ default: mod.Tooltip })))

// ── Map ───────────────────────────────────────────────────────────────────────
function Map({ zoom = 15, maxZoom = 18, className, ...props }) {
    return (
        <LeafletMapContainer
            zoom={zoom}
            maxZoom={maxZoom}
            attributionControl={false}
            zoomControl={false}
            className={cn("z-50 size-full min-h-96 flex-1 rounded-md", className)}
            {...props}
        />
    )
}

// ── MapTileLayer ──────────────────────────────────────────────────────────────
function MapTileLayer({ url, attribution, ...props }) {
    const map = useMap()
    if (map.attributionControl) {
        map.attributionControl.setPrefix("")
    }

    const DEFAULT_URL = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
    const resolvedUrl = url ?? DEFAULT_URL
    const resolvedAttribution = attribution ??
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>'

    return <LeafletTileLayer url={resolvedUrl} attribution={resolvedAttribution} {...props} />
}

// ── MapMarker ─────────────────────────────────────────────────────────────────
function MapMarker({
    icon = <MapPinIcon className="size-6" />,
    iconAnchor = [12, 12],
    bgPos,
    popupAnchor,
    tooltipAnchor,
    ...props
}) {
    const { L } = useLeaflet()
    if (!L) return null

    return (
        <LeafletMarker
            icon={L.divIcon({
                html: renderToString(icon),
                iconAnchor,
                ...(bgPos ? { bgPos } : {}),
                ...(popupAnchor ? { popupAnchor } : {}),
                ...(tooltipAnchor ? { tooltipAnchor } : {}),
            })}
            riseOnHover
            {...props}
        />
    )
}

// ── MapPopup ──────────────────────────────────────────────────────────────────
function MapPopup({ className, ...props }) {
    return (
        <LeafletPopup
            className={cn(
                "bg-popover text-popover-foreground z-50 w-72 rounded-md border p-4 font-sans shadow-md outline-hidden",
                className
            )}
            {...props}
        />
    )
}

// ── MapTooltip ────────────────────────────────────────────────────────────────
function MapTooltip({ className, children, side = "top", sideOffset = 15, ...props }) {
    const ARROW_CLASSES = {
        top: "bottom-0.5 left-1/2 -translate-x-1/2 translate-y-1/2",
        bottom: "top-0.5 left-1/2 -translate-x-1/2 -translate-y-1/2",
        left: "right-0.5 top-1/2 translate-x-1/2 -translate-y-1/2",
        right: "left-0.5 top-1/2 -translate-x-1/2 -translate-y-1/2",
    }
    const OFFSET = {
        top: [0, -sideOffset],
        bottom: [0, sideOffset],
        left: [-sideOffset, 0],
        right: [sideOffset, 0],
    }

    return (
        <LeafletTooltip
            className={cn("relative z-50 w-fit text-xs text-balance", className)}
            data-side={side}
            direction={side}
            offset={OFFSET[side]}
            opacity={1}
            {...props}
        >
            {children}
            <div className={cn("bg-foreground absolute z-50 size-2.5 rotate-45 rounded-[2px]", ARROW_CLASSES[side])} />
        </LeafletTooltip>
    )
}

// ── MapZoomControl ────────────────────────────────────────────────────────────
function MapZoomControl({ position = "top-1 left-1", className }) {
    const map = useMap()
    const [zoomLevel, setZoomLevel] = useState(map.getZoom())

    useMapEvents({
        zoomend: () => setZoomLevel(map.getZoom()),
    })

    const btnStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 26,
        height: 26,
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        color: 'rgba(255,255,255,0.65)',
        transition: 'color 150ms, background 150ms',
    }

    return (
        <MapControlContainer className={cn(position, className)}>
            <div
                style={{
                    background: 'rgba(8,16,24,0.88)',
                    border: '1px solid rgba(255,255,255,0.10)',
                    borderRadius: 8,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                }}
                aria-label="Zoom controls"
            >
                <button
                    type="button"
                    aria-label="Zoom in"
                    title="Zoom in"
                    disabled={zoomLevel >= map.getMaxZoom()}
                    onClick={() => map.zoomIn()}
                    style={{
                        ...btnStyle,
                        borderBottom: '1px solid rgba(255,255,255,0.08)',
                        opacity: zoomLevel >= map.getMaxZoom() ? 0.3 : 1,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.95)'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; e.currentTarget.style.background = 'transparent' }}
                >
                    <PlusIcon size={13} strokeWidth={2.5} />
                </button>
                <button
                    type="button"
                    aria-label="Zoom out"
                    title="Zoom out"
                    disabled={zoomLevel <= map.getMinZoom()}
                    onClick={() => map.zoomOut()}
                    style={{
                        ...btnStyle,
                        opacity: zoomLevel <= map.getMinZoom() ? 0.3 : 1,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.95)'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; e.currentTarget.style.background = 'transparent' }}
                >
                    <MinusIcon size={13} strokeWidth={2.5} />
                </button>
            </div>
        </MapControlContainer>
    )
}

// ── MapControlContainer ───────────────────────────────────────────────────────
function MapControlContainer({ className, ...props }) {
    const { L } = useLeaflet()
    const containerRef = useRef(null)

    useEffect(() => {
        if (!L) return
        const el = containerRef.current
        if (!el) return
        L.DomEvent.disableClickPropagation(el)
        L.DomEvent.disableScrollPropagation(el)
    }, [L])

    return (
        <div
            ref={containerRef}
            className={cn("absolute z-1000 size-fit cursor-default", className)}
            {...props}
        />
    )
}

// ── useLeaflet ────────────────────────────────────────────────────────────────
function useLeaflet() {
    const [L, setL] = useState(null)

    useEffect(() => {
        if (L || typeof window === "undefined") return
        import("leaflet").then((mod) => setL(mod.default))
    }, [L])

    return { L }
}

export {
    Map,
    MapControlContainer,
    MapMarker,
    MapPopup,
    MapTileLayer,
    MapTooltip,
    MapZoomControl,
    useLeaflet,
}
