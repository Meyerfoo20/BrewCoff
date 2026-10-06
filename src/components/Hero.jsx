// Hero (toppsektion)

export default function Hero({ onNavigate }) {
    return (
        <section className="hero">
            <div className="hero-text">
                <span className="hero-badge">Hantverksmuggar &amp; kaffefilter</span>
                <h1>Ditt kaffe förtjänar en mugg med personlighet</h1>
                <p className="hero-subtitle">
                    Hos BrewCoff designar vi porslinsmuggar och kaffefilter som gör
                    vardagliga fikastunder lite finare. Enkel design, tåliga material
                    och tryck som håller – disk för disk.
                </p>
                <div className="hero-actions">
                    <button className="btn-primary" onClick={() => onNavigate('produkter')}>Se alla produkter</button>
                    <button className="btn-secondary" onClick={() => onNavigate('om-oss')}>Läs om oss</button>
                </div>
            </div>
            <div className="hero-image">
                <img src="Images/brewcoff-mugg.png" alt="BrewCoff Classic Mugg" />
            </div>
        </section>
    );
}
