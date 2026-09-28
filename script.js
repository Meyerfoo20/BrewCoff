
        const products = [
            {
                id: 1,
                name: "BrewCoff Clean White",
                category: "motiv",
                price: 89,
                desc: "Stilren vit porslinsmugg utan tryck.",
                image: "Images/Stock-Mugg.png"
            },
            {
                id: 2,
                name: "BrewCoff Classic Mugg",
                category: "motiv",
                price: 99,
                desc: "Klassisk vit porslinsmugg med den bruna BrewCoff-logotypen.",
                image: "Images/brewcoff-mugg.png"
            },
            {
                id: 3,
                name: "BrewCoff Duo-Tone Mugg",
                category: "motiv",
                price: 119,
                desc: "Tvåfärgad porslinsmugg med brun bas och BrewCoff-tryck.",
                image: "Images/brewcoff-mugg-half.png"
            },
            {
                id: 4,
                name: "BrewCoff Mugg, One More?",
                category: "motiv",
                price: 119,
                desc: "Klassisk brun porslinsmugg med vitt tryck.",
                image: "Images/brewcoff-mugg-onemore.png"
            },
            {
                id: 5,
                name: "BrewCoff Mugg, Fika",
                category: "motiv",
                price: 129,
                desc: "Klassisk brun porslinsmugg med vitt tryck och fika dekaler",
                image: "Images/brewcoff-mugg-fika.png"
            },
            {
                id: 6,
                name: "BrewCoff Mugg, Irish Coffee",
                category: "motiv",
                price: 129,
                desc: "Klassisk brun porslinsmugg med vitt, irish coffe tryck",
                image: "Images/brewcoff-mugg-irish.png"
            },
            {
                id: 7,
                name: "Kaffe Filter",
                category: "filter",
                price: 99,
                desc: "100st",
                image: "Images/coffe-filter.png"
            },
            {
                id: 8,
                name: "Kaffe Filter",
                category: "filter",
                price: 189,
                desc: "200st",
                image: "Images/coffe-filter.png"
            },
            {
                id: 9,
                name: "Kaffe Filter",
                category: "filter",
                price: 279,
                desc: "300st",
                image: "Images/coffe-filter.png"
            },
        ];

        let cart = [];
        let activeCategory = 'all';
        let uploadedImage = null;
        let currentDesignType = 'text';
        let baseMugImg = new Image();

        document.addEventListener("DOMContentLoaded", () => {
            renderProducts(products);
            initCanvas();
        });

        function renderProducts(items) {
            const container = document.getElementById("productContainer");
            container.innerHTML = "";

            items.forEach(p => {
                const card = document.createElement("div");
                card.className = "product-card";
                // Gör så att man kommer till produktsidan när man trycker på kortet eller bilden
                card.innerHTML = `
                    <span class="product-badge">${p.category === 'motiv' ? 'Mugg' : 'Filter'}</span>
                    <div class="product-img-wrapper" onclick="openProductDetail(${p.id})">
                        <img src="${p.image}" alt="${p.name}">
                    </div>
                    <h3 class="product-title" onclick="openProductDetail(${p.id})">${p.name}</h3>
                    <p class="product-desc">${p.desc}</p>
                    <div class="product-bottom">
                        <span class="product-price">${p.price} kr</span>
                        <button class="add-cart-btn" onclick="addToCart(${p.id})">Lägg till</button>
                    </div>
                `;
                container.appendChild(card);
            });
        }

        /* Navigering mellan vyer */
        function openProductDetail(productId) {
            const product = products.find(p => p.id === productId);
            if (!product) return;

            document.getElementById("detailImg").src = product.image;
            document.getElementById("detailImg").alt = product.name;
            document.getElementById("detailBadge").innerText = product.category === 'motiv' ? 'Mugg' : 'Filter';
            document.getElementById("detailTitle").innerText = product.name;
            document.getElementById("detailPrice").innerText = `${product.price} kr`;
            document.getElementById("detailDesc").innerText = product.desc;

            // Koppla "Lägg till"-knappen på produktsidan
            const addBtn = document.getElementById("detailAddToCartBtn");
            addBtn.onclick = function() {
                addToCart(product.id);
            };

            // Visa produktsidan, dölj huvudvyn
            document.getElementById("mainView").style.display = "none";
            document.getElementById("productDetailView").style.display = "block";
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        function showMainView() {
            document.getElementById("productDetailView").style.display = "none";
            document.getElementById("mainView").style.display = "block";
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        function filterCategory(cat, btn) {
            activeCategory = cat;
            if(btn) {
                document.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            }
            if(cat === 'all') {
                renderProducts(products);
            } else {
                renderProducts(products.filter(p => p.category === cat));
            }
        }

        function searchProducts(query) {
            const filtered = products.filter(p =>
                p.name.toLowerCase().includes(query.toLowerCase()) ||
                p.desc.toLowerCase().includes(query.toLowerCase())
            );
            renderProducts(filtered);
}
function scrollToSection(id) {
    const mainView = document.getElementById("mainView");
    if (mainView.style.display === "none") {
        mainView.style.display = "block";
        document.getElementById("productDetailView").style.display = "none";
    }
    setTimeout(() => {
        document.getElementById(id).scrollIntoView({ behavior: "smooth" });
    }, 30);
}

// Scrollar till toppen av sidan (används av loggan)
function scrollToTop() {
    const mainView = document.getElementById("mainView");
    if (mainView.style.display === "none") {
        mainView.style.display = "block";
        document.getElementById("productDetailView").style.display = "none";
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// Ger navbaren en skugga när man scrollat ner
window.addEventListener("scroll", () => {
    document.querySelector(".navbar").classList.toggle("scrolled", window.scrollY > 10);
});
