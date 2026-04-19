"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, Globe } from "lucide-react"
import { Banner } from "@/schemas/banner"

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

/* ── Color utilities ── */
const CREAM = "#FAF8F5"   // warm white
const CHARCOAL = "#2B2B2B" // soft dark

/** Returns true if a hex color is dark (luminance < 0.75)
 *  Threshold is high so text stays cream-white for most colors,
 *  only switching to dark on very light backgrounds (e.g. white, light yellow) */
function isDark(hex: string): boolean {
  const h = hex.replace("#", "")
  const r = parseInt(h.substring(0, 2), 16) / 255
  const g = parseInt(h.substring(2, 4), 16) / 255
  const b = parseInt(h.substring(4, 6), 16) / 255
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
  return lum < 0.75
}

function textFor(hex: string) { return isDark(hex) ? CREAM : CHARCOAL }
function subTextFor(hex: string) { return isDark(hex) ? "rgba(250,248,245,0.75)" : "rgba(43,43,43,0.65)" }

/* ── Flip-digit component ── */
function FlipDigit({ value, dark }: { value: string; dark: boolean }) {
  // Invert: if banner text is cream (dark bg), digits are cream-bg + charcoal text
  //         if banner text is charcoal (light bg), digits are charcoal-bg + cream text
  return (
    <span
      className="inline-flex items-center justify-center rounded-[5px] font-bold tabular-nums"
      style={{
        width: 22,
        height: 30,
        fontSize: 16,
        lineHeight: 1,
        backgroundColor: dark ? CREAM : CHARCOAL,
        color: dark ? CHARCOAL : CREAM,
        boxShadow: dark
          ? "0 1px 3px rgba(0,0,0,0.1)"
          : "0 1px 3px rgba(0,0,0,0.3)",
        letterSpacing: "-0.02em",
      }}
    >
      {value}
    </span>
  )
}

function FlipGroup({ val, label, dark }: { val: number; label: string; dark: boolean }) {
  const str = String(val).padStart(2, "0")
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="flex gap-[2px]">
        <FlipDigit value={str[0]} dark={dark} />
        <FlipDigit value={str[1]} dark={dark} />
      </div>
      <span
        className="text-[8px] uppercase tracking-wider font-medium"
        style={{ color: dark ? "rgba(250,248,245,0.6)" : "rgba(43,43,43,0.5)" }}
      >
        {label}
      </span>
    </div>
  )
}

function FlipSeparator({ dark }: { dark: boolean }) {
  return (
    <span
      className="font-bold text-sm self-start mt-[6px] mx-[1px]"
      style={{ color: dark ? "rgba(250,248,245,0.5)" : "rgba(43,43,43,0.4)" }}
    >
      :
    </span>
  )
}

/* ── Countdown timer ── */
function CountdownTimer({ target, bannerColor }: { target: Date; bannerColor: string }) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const diff = Math.max(0, target.getTime() - now.getTime())
  if (diff === 0) return null

  const totalSec = Math.floor(diff / 1000)
  const days = Math.floor(totalSec / 86400)
  const hours = Math.floor((totalSec % 86400) / 3600)
  const minutes = Math.floor((totalSec % 3600) / 60)
  const seconds = totalSec % 60

  const showDays = days > 0
  const dark = isDark(bannerColor)

  return (
    <div
      className="flex items-start gap-[3px] rounded-xl px-2.5 py-2"
      style={{
        backgroundColor: bannerColor,
        boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
      }}
    >
      {showDays ? (
        <>
          <FlipGroup val={days} label="giorni" dark={dark} />
          <FlipSeparator dark={dark} />
          <FlipGroup val={hours} label="ore" dark={dark} />
          <FlipSeparator dark={dark} />
          <FlipGroup val={minutes} label="min" dark={dark} />
        </>
      ) : (
        <>
          <FlipGroup val={hours} label="ore" dark={dark} />
          <FlipSeparator dark={dark} />
          <FlipGroup val={minutes} label="min" dark={dark} />
          <FlipSeparator dark={dark} />
          <FlipGroup val={seconds} label="sec" dark={dark} />
        </>
      )}
    </div>
  )
}

/* ── Banner slide ── */
function BannerSlide({ banner }: { banner: Banner }) {
  const color = `#${banner.color}`
  const imgUrl = banner.image ? `/api/proxy/uploads/banners/${banner.image}` : null

  // Badge text adapts to card color; bottom text is always cream (over dark gradient)
  const badgeTxt = textFor(color)

  const iconBtnStyle = imgUrl
    ? { backgroundColor: `${color}cc`, color: badgeTxt }
    : { backgroundColor: "rgba(0,0,0,0.2)", color: CREAM }

  const eventDate =
    banner.type === "EVENT" && banner.dateTime
      ? new Date(banner.dateTime)
      : null
  const showCountdown = eventDate && eventDate.getTime() > Date.now()

  return (
    <div className="absolute inset-0" style={{ backgroundColor: color }}>
      {imgUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imgUrl}
          alt={banner.title ?? "Banner"}
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          decoding="async"
        />
      )}

      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-start justify-between p-3">
        {/* Left: badge */}
        <span
          className="text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide"
          style={{ backgroundColor: color, color: badgeTxt }}
        >
          {banner.type === "EVENT" ? "Evento" : "Sponsor"}
        </span>

        {/* Right: countdown (if any) + social icons stacked vertically */}
        <div className="flex flex-col items-end gap-2">
          {showCountdown && (
            <CountdownTimer target={eventDate} bannerColor={color} />
          )}
          <div className="flex items-center gap-2">
            {banner.website && (
              <a href={banner.website} target="_blank" rel="noopener noreferrer"
                className="p-1.5 rounded-full" style={iconBtnStyle}
                onClick={e => e.stopPropagation()} aria-label="Sito web">
                <Globe className="w-4 h-4" />
              </a>
            )}
            {banner.facebook && (
              <a href={banner.facebook} target="_blank" rel="noopener noreferrer"
                className="p-1.5 rounded-full" style={iconBtnStyle}
                onClick={e => e.stopPropagation()} aria-label="Facebook">
                <FacebookIcon className="w-4 h-4" />
              </a>
            )}
            {banner.instagram && (
              <a href={banner.instagram} target="_blank" rel="noopener noreferrer"
                className="p-1.5 rounded-full" style={iconBtnStyle}
                onClick={e => e.stopPropagation()} aria-label="Instagram">
                <InstagramIcon className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Bottom: title + description */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
        {banner.title && (
          <h2 className="font-bold text-xl leading-tight" style={{ color: CREAM }}>{banner.title}</h2>
        )}
        {banner.description && (
          <p className="text-sm mt-1 line-clamp-2" style={{ color: "rgba(250,248,245,0.8)" }}>{banner.description}</p>
        )}
      </div>
    </div>
  )
}

interface BannerCarouselProps {
  banners: Banner[]
}

/**
 * Strip carousel with infinite cloning.
 * Layout: [clone-of-last, slide0, slide1, ..., slideN-1, clone-of-first]
 *
 * All BannerSlide components live permanently in the DOM — their <Image>
 * elements never unmount, so the browser cache is hit on every transition
 * and there is zero flicker.
 *
 * Wrapping is handled by animating into a clone (visually identical to the
 * real target), then instantly "teleporting" the strip to the real position
 * with no transition. The jump is invisible because content is identical.
 */
export function BannerCarousel({ banners }: BannerCarouselProps) {
  const count = banners.length

  // [clone-of-last, ...real slides..., clone-of-first]
  const cloned = useMemo(() => {
    if (count <= 1) return [...banners]
    return [banners[count - 1], ...banners, banners[0]]
  }, [banners, count])

  const total = cloned.length

  // offset: integer index into `cloned`. For count > 1:
  //   0          = clone-of-last  → maps to real index count-1
  //   1..count   = real slides    → maps to real index offset-1
  //   count+1    = clone-of-first → maps to real index 0
  const [offset, setOffset] = useState(count > 1 ? 1 : 0)
  const [animate, setAnimate] = useState(false)
  const offsetRef = useRef(offset)
  const navCountRef = useRef(0)
  const autoTimer = useRef<ReturnType<typeof setInterval> | null>(null)

  // Touch refs
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)
  const touchEndX = useRef(0)
  const isHorizontalSwipe = useRef(false)

  // Real current index (0-based into `banners`)
  const current = useMemo(() => {
    if (count <= 1) return 0
    if (offset <= 0) return count - 1          // clone-of-last
    if (offset >= count + 1) return 0          // clone-of-first
    return offset - 1
  }, [count, offset])

  // Low-level navigate: update offset with or without CSS transition
  const navigate = useCallback((newOffset: number, withAnimation: boolean) => {
    offsetRef.current = newOffset
    setAnimate(withAnimation)
    setOffset(newOffset)
    if (withAnimation) navCountRef.current++
  }, [])

  const clearAutoTimer = useCallback(() => {
    if (autoTimer.current) {
      clearInterval(autoTimer.current)
      autoTimer.current = null
    }
  }, [])

  const resetAutoTimer = useCallback(() => {
    clearAutoTimer()
    if (count <= 1) return
    autoTimer.current = setInterval(() => {
      // Always increment — if at clone-of-first it will trigger the teleport
      navigate(offsetRef.current + 1, true)
    }, 5000)
  }, [count, clearAutoTimer, navigate])

  useEffect(() => {
    if (count <= 1) clearAutoTimer()
    else resetAutoTimer()
    return clearAutoTimer
  }, [count, clearAutoTimer, resetAutoTimer])

  const goNext = useCallback(() => {
    const next = Math.min(offsetRef.current + 1, count + 1)
    if (next !== offsetRef.current) navigate(next, true)
    resetAutoTimer()
  }, [count, navigate, resetAutoTimer])

  const goPrev = useCallback(() => {
    const next = Math.max(offsetRef.current - 1, 0)
    if (next !== offsetRef.current) navigate(next, true)
    resetAutoTimer()
  }, [navigate, resetAutoTimer])

  const goToReal = useCallback((realIndex: number) => {
    const normalized = ((realIndex % count) + count) % count
    navigate(normalized + 1, true)
    resetAutoTimer()
  }, [count, navigate, resetAutoTimer])

  // After CSS transition ends: if we landed on a clone, teleport to the
  // matching real slide (no animation — visually identical, no flash).
  const handleTransitionEnd = useCallback(() => {
    const cur = offsetRef.current
    if (cur >= count + 1) navigate(1, false)     // clone-of-first → real first
    else if (cur <= 0)    navigate(count, false)  // clone-of-last  → real last
    else                  setAnimate(false)
  }, [count, navigate])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
    touchEndX.current   = e.touches[0].clientX
    isHorizontalSwipe.current = false
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
    const dx = Math.abs(e.touches[0].clientX - touchStartX.current)
    const dy = Math.abs(e.touches[0].clientY - touchStartY.current)
    if (dx > dy && dx > 10) isHorizontalSwipe.current = true
  }

  const handleTouchEnd = () => {
    if (!isHorizontalSwipe.current) return
    const diff = touchStartX.current - touchEndX.current
    if (Math.abs(diff) > 50) diff > 0 ? goNext() : goPrev()
  }

  if (count === 0) return null

  const color = `#${banners[current].color}`
  // translateX: move strip so that `offset` slot is fully visible
  const translateX = total > 0 ? -(offset / total) * 100 : 0

  return (
    <div>
      <style>{`@keyframes banner-progress { from { width: 0% } to { width: 100% } }`}</style>

      {/* Card */}
      <div
        className="relative rounded-md overflow-hidden shadow-sm h-[352px]"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/*
          Horizontal strip — ALL slides always in DOM.
          Images never unmount → no flicker on transition.
        */}
        <div
          className="flex h-full"
          style={{
            width: `${total * 100}%`,
            transform: `translateX(${translateX}%)`,
            transition: animate ? "transform 0.38s ease-in-out" : "none",
            willChange: "transform",
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {cloned.map((banner, i) => (
            <div
              key={`${banner.id}-${i}`}
              className="relative flex-shrink-0 h-full"
              style={{ width: `${100 / total}%` }}
            >
              <BannerSlide banner={banner} />
            </div>
          ))}
        </div>

        {/* Prev / Next buttons */}
        {count > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-30 rounded-full p-1.5"
              style={{ backgroundColor: `${color}cc` }}
              aria-label="Banner precedente"
            >
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={goNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-30 rounded-full p-1.5"
              style={{ backgroundColor: `${color}cc` }}
              aria-label="Banner successivo"
            >
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          </>
        )}
      </div>

      {/* Dot indicators */}
      {count > 1 && (
        <div className="flex justify-center items-center gap-1.5 mt-3">
          {banners.map((b, i) => {
            const dotColor = `#${b.color}`
            const isActive = i === current
            return (
              <button
                key={b.id}
                onClick={() => goToReal(i)}
                className="relative rounded-full overflow-hidden p-0 border-0 cursor-pointer"
                style={{
                  height: 6,
                  width: isActive ? 32 : 6,
                  backgroundColor: isActive ? "transparent" : dotColor,
                  opacity: isActive ? 1 : 0.4,
                  transition: "width 0.35s ease, opacity 0.35s ease",
                }}
                aria-label={`Vai al banner ${i + 1}`}
              >
                {isActive && (
                  <>
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{ backgroundColor: "color-mix(in srgb, var(--muted-foreground) 30%, transparent)" }}
                    />
                    <div
                      key={`prog-${i}-${navCountRef.current}`}
                      className="absolute left-0 top-0 h-full rounded-full"
                      style={{
                        backgroundColor: dotColor,
                        animation: "banner-progress 5s linear forwards",
                      }}
                    />
                  </>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

