'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

const SLIDES = [
  {
    src: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=2200&q=80',
    alt: 'Houseboats on Kerala backwaters at sunset',
    eyebrow: 'GOOD MORNING INDIA HOLIDAYS',
    title: 'Kerala Backwaters',
    subtitle: 'Slow canals, spice-scented evenings, and handcrafted houseboat journeys.',
  },
  {
    src: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=2200&q=80',
    alt: 'Rajasthan palace and cityscape in warm evening light',
    eyebrow: 'CURATED ROYAL CIRCUITS',
    title: 'Rajasthan Heritage',
    subtitle: 'Palace stays, desert sunsets, and deeply local cultural routes.',
  },
  {
    src: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=2200&q=80',
    alt: 'Ladakh mountain road and high-altitude landscape',
    eyebrow: 'SEASON 2026-2027',
    title: 'Ladakh Horizons',
    subtitle: 'High-altitude expeditions planned with comfort, pacing, and care.',
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className="relative min-h-[92vh] w-full overflow-hidden bg-[#1A1612]">
      {SLIDES.map((slide, idx) => (
        <div
          key={slide.src}
          className={`absolute inset-0 transition-opacity duration-1400ms ${
            idx === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden={idx !== currentSlide}
        >
          <img
            src={slide.src}
            alt={slide.alt}
            className="h-full w-full object-cover"
            loading={idx === 0 ? 'eager' : 'lazy'}
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-linear-to-t from-[#1A1612]/85 via-[#1A1612]/35 to-[#1A1612]/55" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(212,149,106,0.20),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(196,165,116,0.16),transparent_38%)]" />

      <div className="relative z-10 mx-auto flex min-h-[92vh] w-full max-w-7xl flex-col justify-end px-6 pb-16 pt-24 sm:px-10 sm:pb-20 sm:pt-36">
        <p className="mb-4 font-serif text-xs tracking-[0.45em] text-[#F2C4A0] sm:text-sm">
          {SLIDES[currentSlide].eyebrow}
        </p>

        <h1 className="max-w-4xl font-serif text-4xl leading-[0.95] tracking-wide text-white sm:text-5xl md:text-6xl lg:text-8xl">
          {SLIDES[currentSlide].title}
          <span className="mt-2 block text-xl font-light tracking-[0.2em] text-[#F2C4A0] sm:text-2xl md:text-3xl lg:text-4xl">
            BOOKINGS OPEN
          </span>
        </h1>

        <div className="mt-8 h-0.5 w-28 bg-linear-to-r from-transparent via-[#D4956A] to-transparent" />

        <p className="mt-7 max-w-2xl font-serif text-base leading-relaxed text-white/85 sm:text-lg md:text-xl">
          {SLIDES[currentSlide].subtitle}
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            href="/explore"
            className="border border-[#D4956A] px-8 py-3 text-xs tracking-[0.28em] text-[#F2C4A0] transition hover:bg-[#D4956A] hover:text-white"
          >
            EXPLORE TOURS
          </Link>
          <Link
            href="/about"
            className="border border-white/40 px-8 py-3 text-xs tracking-[0.28em] text-white transition hover:bg-white hover:text-[#1A1612]"
          >
            ABOUT US
          </Link>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {SLIDES.map((slide, idx) => (
          <button
            key={slide.alt}
            onClick={() => setCurrentSlide(idx)}
            className={`h-1 transition-all ${idx === currentSlide ? 'w-12 bg-[#F2C4A0]' : 'w-7 bg-white/45'}`}
            aria-label={`Go to ${slide.title}`}
          />
        ))}
      </div>
    </section>
  );
}