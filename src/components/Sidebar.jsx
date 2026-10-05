// Sidmeny (Rasmus)

export default function Sidebar({ open, user, onClose, onLoginOrAccount, onToggleTheme, onLogout }) {
    return (
        <>
            <div className={open ? 'sidebar-overlay open' : 'sidebar-overlay'} onClick={onClose}></div>
            <aside className={open ? 'sidebar open' : 'sidebar'} id="menuSidebar" aria-label="Meny">
                <div className="sidebar-header">
                    <h2>Meny</h2>
                    <button className="sidebar-close" id="menuClose" type="button" aria-label="Stäng meny" onClick={onClose}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                </div>
                <ul className="sidebar-list">
                    <li>
                        <button className="sidebar-item" type="button" onClick={onLoginOrAccount}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                            <span className="sidebar-item-label">{user ? (user.name || user.email) : 'Logga in'}</span>
                        </button>
                    </li>
                    <li>
                        <button className="sidebar-item" type="button" onClick={onToggleTheme}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
                            Ljust/mörkt läge
                        </button>
                    </li>
                </ul>
                {/* "Logga ut"-knappen i botten av sidmenyn (synlig bara när inloggad) */}
                {user && (
                    <button className="sidebar-logout visible" type="button" onClick={onLogout}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                        Logga ut
                    </button>
                )}
            </aside>
        </>
    );
}
