import Hero from './components/hero';
import HeroContent from './components/content';

export const metadata = {
  title: 'Travel India | Premium Tours & Experiences 2026-2027',
  description: 'Discover curated travel experiences across India. Book your adventure for season 2026-2027. Expert-crafted tours for unforgettable journeys.',
  openGraph: {
    title: 'Travel India | Premium Tours 2026-2027',
    description: 'Curated with passion, crafted for you. Explore India like never before.',
    images: ['/hero-1.jpg'],
  },
};


export default function Home() {
  return (
    <>
  <Hero />
  <HeroContent></HeroContent>
    </>
  );
}
