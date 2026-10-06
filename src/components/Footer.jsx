// Footer (Anton Blad)

export default function Footer({ onGoToCategory, onNavigate }) {
    return (
        <footer className="site-footer">
            <div className="footer-grid">
                <div className="footer-col">
                    <p className="footer-brand">BrewCoff</p>
                    <p>Brinner för härliga koppar kaffe och seriösa kaffefilter för dig som tar kaffe på allvar</p>
                </div>

                <div className="footer-col">
                    <h3>Handla</h3>
                    <ul>
                        <li><a href="#produkter" onClick={e => { e.preventDefault(); onGoToCategory('Muggar'); }}>Muggar</a></li>
                        <li><a href="#produkter" onClick={e => { e.preventDefault(); onGoToCategory('Kaffefilter'); }}>Filter</a></li>
                        <li><a href="#studio" onClick={e => { e.preventDefault(); onNavigate('studio'); }}>Egen Design</a></li>
                    </ul>
                </div>

                <div className="footer-col">
                    <h3>Kundservice</h3>
                    <ul>
                        <li><a href="#frakt">Frakt &amp; leverans</a></li>
                        <li><a href="#returer">Returer och Reklamation</a></li>
                        <li><a href="#köpvillkor">Köpvillkor</a></li>
                    </ul>
                </div>

                <div className="footer-col newsletter">
                    <h3>Kontakta oss</h3>
                    <ul>
                        <li><a href="mailto:brewcoff@info.se">brewcoff@info.se</a></li>
                        <li><a href="#telefonnummer"> 07 123 45 67</a></li>
                        <p>Helsingborg, Sverige</p>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; 2025 BrewCoff. Alla rättigheter förbehållna. Bryggat med omsorg.</p>
                <div>
                    <a href="#sekretesspolicy">Sekretesspolicy</a>
                    <a href="#villkor">Villkor</a>
                    <span style={{ marginLeft: '1rem' }}>Visa · Mastercard · PayPal</span>
                </div>
            </div>
        </footer>
    );
}
