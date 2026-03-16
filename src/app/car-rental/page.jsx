import CarRentalForm from '@/app/components/CarRentalForm';


export const metadata = {
  title: 'Car Rental',
  description: 'Request private car rental services across Rajasthan and India with a simple, fast booking enquiry form.',
};

export default function CarRentalPage() {
  return (
    <div style={{ background: '#FAF7F2' }}>
      <section
        style={{
          padding: 'clamp(72px, 10vw, 120px) 24px 56px',
          background:
            'linear-gradient(135deg, rgba(34,26,18,0.98) 0%, rgba(26,22,18,1) 60%, rgba(64,42,25,0.96) 100%)',
          color: 'white',
        }}
      >
        <div
          className="car-rental-shell"
          style={{
            width: '100%',
            maxWidth: 1180,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1.05fr 0.95fr',
            gap: 48,
            alignItems: 'start',
          }}
        >
          <div>
            <p
              style={{
                fontFamily: 'Cinzel, serif',
                fontSize: '0.76rem',
                letterSpacing: '0.38em',
                color: '#F2C4A0',
                marginBottom: 18,
              }}
            >
              PRIVATE CAR RENTALS
            </p>
            <h1
              style={{
                fontFamily: 'Cinzel, serif',
                fontSize: 'clamp(2.1rem, 5vw, 4.4rem)',
                fontWeight: 400,
                lineHeight: 1.02,
                marginBottom: 22,
              }}
            >
              Chauffeured Cars
              <br />
              For Smooth India Travel
            </h1>
            <div style={{ width: 70, height: 1.5, background: '#D4956A', marginBottom: 24 }} />
            <p
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '1.16rem',
                lineHeight: 1.9,
                color: 'rgba(255,255,255,0.82)',
                maxWidth: 620,
                marginBottom: 18,
              }}
            >
              Book airport transfers, city drives, intercity routes, or multi-day Rajasthan circuits with
              vetted drivers and well-kept vehicles.
            </p>
            <p
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '1.04rem',
                lineHeight: 1.85,
                color: 'rgba(255,255,255,0.66)',
                maxWidth: 620,
              }}
            >
              Keep it simple: fill the short form, submit, and we&apos;ll take you back home while the request lands in your dashboard.
            </p>
          </div>

          <CarRentalForm />
        </div>
      </section>

  

      <style>{`
        @media (max-width: 920px) {
          .car-rental-shell {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
