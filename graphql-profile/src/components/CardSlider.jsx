import { useState, useCallback } from "react"

export default function CardSlider({ children }) {
  const slides = Array.isArray(children) ? children : [children]
  const total = slides.length
  const [current, setCurrent] = useState(0)

  const prev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total])
  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total])

  return (
    <div className="card-slider">
      {/* Sliding track */}
      <div className="card-slider__viewport">
        <div
          className="card-slider__track"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <div key={i} className="card-slide" aria-hidden={i !== current}>
              {slide}
            </div>
          ))}
        </div>
      </div>

      {/* Controls: prev · dots · next */}
      <div className="card-slider__controls">
        <button
          className="card-slider__btn"
          onClick={prev}
          aria-label="Previous card"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div className="card-slider__dots" role="tablist">
          {slides.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === current}
              aria-label={`Card ${i + 1} of ${total}`}
              className={`card-slider__dot${i === current ? " card-slider__dot--active" : ""}`}
              onClick={() => setCurrent(i)}
            />
          ))}
        </div>

        <button
          className="card-slider__btn"
          onClick={next}
          aria-label="Next card"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  )
}
