const cakeData = [
    { name: "Velvet Truffle", price: 45, category: "Orders", desc: "Signature deep red velvet with silk ganache.", img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400" },
    { name: "Ruby Strawberry", price: 38, category: "Orders", desc: "Fresh strawberries whipped into red cream.", img: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400" },
    { name: "Custom Crimson", price: 65, category: "Design", desc: "Fully customizable multi-tier red velvet cake.", img: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400" },
    { name: "Vanilla Rose", price: 40, category: "Design", desc: "Madagascan vanilla with edible red roses.", img: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400" }
];

const banners = [
    "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200",
    "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=1200"
];

const CART_KEY = "velvetCart";
let cart = [];
let bannerIdx = 0;
let pendingItem = null;

window.onload = () => {
    cart = loadCartFromStorage();
    updateCartCountDisplay();
    renderCakes();
    setInterval(rotateBanner, 4000);
    updateCart();
};

function renderCakes(filter = "") {
    const fullGrid = document.getElementById('full-grid');
    const trendGrid = document.getElementById('trending-grid');
    
    if(fullGrid) fullGrid.innerHTML = '';
    if(trendGrid) trendGrid.innerHTML = '';

    cakeData.forEach((cake, idx) => {
        if(cake.name.toLowerCase().includes(filter) || cake.category.toLowerCase().includes(filter)) {
            const html = `
                <div class="cake-card">
                    <span class="category-tag">${cake.category}</span>
                    <img src="${cake.img}" style="width:100%; height:180px; object-fit:cover; border-radius:15px;">
                    <h3>${cake.name}</h3>
                    <p style="font-size:0.8rem; opacity:0.8;">${cake.desc}</p>
                    <p style="color: var(--cream); font-weight: 600; font-size: 1.2rem;">$${cake.price}</p>
                    <button class="btn-cream" style="margin-top: 10px; width: 100%;" onclick="askConfirm('${cake.name}', ${cake.price})">Add to Order</button>
                </div>`;
            
            if(fullGrid) fullGrid.innerHTML += html;
            if(trendGrid && idx < 3 && filter === "") trendGrid.innerHTML += html;
        }
    });
}

function rotateBanner() {
    bannerIdx = (bannerIdx + 1) % banners.length;
    const img = document.getElementById('carousel-img');
    if(img) {
        img.style.opacity = 0;
        setTimeout(() => { img.src = banners[bannerIdx]; img.style.opacity = 1; }, 500);
    }
}

function askConfirm(name, price) {
    pendingItem = { name, price };
    document.getElementById('modal-msg').innerText = `Add ${name} to your pickup cart?`;
    document.getElementById('qty-box').style.display = 'none';
    document.getElementById('cart-modal').style.display = 'flex';
    
    document.getElementById('modal-yes').onclick = () => {
        const qtyBox = document.getElementById('qty-box');
        if (qtyBox.style.display === 'none') {
            document.getElementById('modal-msg').innerText = "How many would you like?";
            qtyBox.style.display = 'block';
        } else {
            finalizeAdd();
        }
    };
}

function finalizeAdd() {
    const qty = parseInt(document.getElementById('item-qty').value) || 1;
    cart.push({ ...pendingItem, qty, id: Date.now() });
    updateCartCountDisplay();
    updateCart();
    closeModal('cart-modal');
    alert(`Added ${qty}x ${pendingItem.name} to cart!`);
}

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
    const qtyInput = document.getElementById('item-qty');
    if(qtyInput) qtyInput.value = 1;
}

// Info Display Button Logic
function showSchedule() {
    document.getElementById('schedule-modal').style.display = 'flex';
}

function updateCart() {
    updateCartCountDisplay();
    const list = document.getElementById('cart-items');
    if(!list) return;
    
    list.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        list.innerHTML += `<tr>
            <td>${item.name}</td><td>${item.qty}</td><td>$${item.price * item.qty}</td>
            <td><button onclick="removeItem(${item.id})" style="background:none; border:none; cursor:pointer; color:#ff6b6b; font-size:1.2rem;">✖</button></td></tr>`;
        total += (item.price * item.qty);
    });
    document.getElementById('total-price').innerText = total;
}

function removeItem(id) { cart = cart.filter(i => i.id !== id); updateCart(); saveCartToStorage(); }
function loadCartFromStorage() { try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch { return []; } }
function saveCartToStorage() { try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch {} }
function getCartQtyCount() { return cart.reduce((sum, item) => sum + (parseInt(item.qty, 10) || 0), 0); }
function updateCartCountDisplay() {
    const count = getCartQtyCount();
    document.querySelectorAll('#cart-count').forEach(el => el.innerText = count);
    saveCartToStorage();
}