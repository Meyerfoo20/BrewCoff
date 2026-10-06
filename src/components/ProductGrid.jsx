// Produktkort + rutnät (Neo)

function ProductCard({ product, onOpenDetail, onAddToCart }) {
    return (
        <div className="product-card">
            <span className="product-badge">{product.category === 'motiv' ? 'Mugg' : 'Filter'}</span>
            {/* Gör så att man kommer till produktsidan när man trycker på kortet eller bilden */}
            <div className="product-img-wrapper" onClick={() => onOpenDetail(product.id)}>
                <img src={product.image} alt={product.name} />
            </div>
            <h3 className="product-title" onClick={() => onOpenDetail(product.id)}>{product.name}</h3>
            <p className="product-desc">{product.desc}</p>
            <div className="product-bottom">
                <span className="product-price">{product.price} kr</span>
                <button className="add-cart-btn" onClick={() => onAddToCart(product.id)}>Lägg till</button>
            </div>
        </div>
    );
}

export default function ProductGrid({ items, onOpenDetail, onAddToCart }) {
    return (
        <section className="products-grid" id="productContainer">
            {items.map(p => (
                <ProductCard key={p.id} product={p} onOpenDetail={onOpenDetail} onAddToCart={onAddToCart} />
            ))}
        </section>
    );
}
