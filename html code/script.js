const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');

if (bar){
    bar.addEventListener('click',() =>{
        nav.classList.add('active');
    })
}

if (close){
    close.addEventListener('click',() =>{
        nav.classList.remove('active');
    })
}

// --- DYNAMIC SHOPPING CART SYSTEM ---

// Load cart from localStorage
function getCart() {
    try {
        return JSON.parse(localStorage.getItem('shoppingCart')) || [];
    } catch (e) {
        return [];
    }
}

// Save cart to localStorage and update badge
function saveCart(cart) {
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
    updateCartBadge();
}

// Add item to cart
function addToCart(product) {
    let cart = getCart();
    
    // Check if the item with same name and size already exists in the cart
    let existing = cart.find(item => item.name === product.name && item.size === product.size);
    if (existing) {
        existing.quantity += product.quantity;
    } else {
        cart.push(product);
    }
    
    saveCart(cart);
    showToast(`${product.name} (Size: ${product.size}) added to cart!`);
}

// Show toast notification
function showToast(message) {
    let toast = document.getElementById('cart-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'cart-toast';
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.right = '20px';
        toast.style.backgroundColor = '#088178';
        toast.style.color = '#fff';
        toast.style.padding = '12px 24px';
        toast.style.borderRadius = '4px';
        toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        toast.style.zIndex = '1000';
        toast.style.fontSize = '14px';
        toast.style.fontWeight = '600';
        toast.style.transition = 'all 0.3s ease';
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        document.body.appendChild(toast);
    }
    
    // Truncate message if too long
    toast.innerText = message.length > 50 ? message.substring(0, 47) + '...' : message;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
    }, 3000);
}

// Update navbar cart badge count on desktop & mobile
function updateCartBadge() {
    const cart = getCart();
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Select both cart.html and Addtocart.html links
    const bagIcons = document.querySelectorAll('a[href*="cart.html"], a[href*="Addtocart.html"]');
    bagIcons.forEach(link => {
        if (link.querySelector('.fa-bag-shopping') || link.classList.contains('fa-bag-shopping')) {
            // Remove any existing badge
            let badge = link.querySelector('.cart-badge');
            if (badge) {
                badge.remove();
            }
            
            if (totalCount > 0) {
                badge = document.createElement('span');
                badge.className = 'cart-badge';
                badge.innerText = totalCount;
                
                // Style badge
                badge.style.position = 'absolute';
                badge.style.top = '-8px';
                badge.style.right = '-8px';
                badge.style.backgroundColor = 'orangered';
                badge.style.color = '#fff';
                badge.style.borderRadius = '50%';
                badge.style.padding = '2px 6px';
                badge.style.fontSize = '11px';
                badge.style.fontWeight = '700';
                badge.style.lineHeight = '1';
                
                if (window.getComputedStyle(link).position === 'static') {
                    link.style.position = 'relative';
                }
                
                link.appendChild(badge);
            }
        }
    });
}

// Listen to product grid card add-to-cart clicks globally
document.addEventListener('click', function(e) {
    const cartLink = e.target.closest('.pro a');
    if (cartLink && (e.target.classList.contains('fa-cart-shopping') || cartLink.querySelector('.fa-cart-shopping'))) {
        e.preventDefault();
        e.stopPropagation();
        
        const productEl = cartLink.closest('.pro');
        if (productEl) {
            const imgEl = productEl.querySelector('img');
            const img = imgEl ? imgEl.getAttribute('src') : '';
            
            const desEl = productEl.querySelector('.des');
            if (desEl) {
                const brand = desEl.querySelector('span') ? desEl.querySelector('span').innerText.trim() : 'adidas';
                const name = desEl.querySelector('h5') ? desEl.querySelector('h5').innerText.trim() : '';
                
                const priceEl = desEl.querySelector('h4');
                const priceText = priceEl ? priceEl.innerText.trim() : '$0.00';
                
                addToCart({
                    name: name,
                    brand: brand,
                    price: priceText,
                    img: img,
                    quantity: 1,
                    size: 'XL'
                });
            }
        }
    }
});

// Listen to details page "Add To Cart" buttons globally
document.addEventListener('click', function(e) {
    if (e.target && e.target.tagName === 'BUTTON' && e.target.innerText.trim().toLowerCase() === 'add to cart') {
        const detailsEl = e.target.closest('#prodetails');
        if (detailsEl) {
            const imgEl = detailsEl.querySelector('#MainImg');
            const img = imgEl ? imgEl.getAttribute('src') : '';
            
            const infoEl = detailsEl.querySelector('.single-pro-details');
            if (infoEl) {
                const brandEl = infoEl.querySelector('h6 strong');
                const brand = brandEl ? brandEl.innerText.trim() : 'adidas';
                
                const nameEl = infoEl.querySelector('h4');
                const name = nameEl ? nameEl.innerText.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim() : '';
                
                const priceEl = infoEl.querySelector('h2');
                const price = priceEl ? priceEl.innerText.trim() : '$0.00';
                
                const sizeEl = infoEl.querySelector('select');
                const size = sizeEl ? sizeEl.value : 'XL';
                
                const qtyEl = infoEl.querySelector('input[type="number"]');
                const qty = qtyEl ? parseInt(qtyEl.value) || 1 : 1;
                
                addToCart({
                    name: name,
                    brand: brand,
                    price: price,
                    img: img,
                    quantity: qty,
                    size: size === 'Select Size' ? 'XL' : size
                });
            }
        }
    }
});

// Listen to details page "By Now" / "Buy Now" buttons globally
document.addEventListener('click', function(e) {
    if (e.target && e.target.tagName === 'BUTTON' && (e.target.innerText.trim().toLowerCase() === 'by now' || e.target.innerText.trim().toLowerCase() === 'buy now')) {
        const detailsEl = e.target.closest('#prodetails');
        if (detailsEl) {
            e.preventDefault(); // Stop immediate navigation if wrapped in <a>
            
            const imgEl = detailsEl.querySelector('#MainImg');
            const img = imgEl ? imgEl.getAttribute('src') : '';
            
            const infoEl = detailsEl.querySelector('.single-pro-details');
            let brand = 'adidas';
            let name = '';
            let price = '$0.00';
            let size = 'XL';
            let color = 'Default';
            
            if (infoEl) {
                const brandEl = infoEl.querySelector('h6 strong');
                if (brandEl) brand = brandEl.innerText.trim();
                
                const nameEl = infoEl.querySelector('h4');
                if (nameEl) name = nameEl.innerText.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
                
                const priceEl = infoEl.querySelector('h2');
                if (priceEl) price = priceEl.innerText.trim();
                
                const sizeEl = infoEl.querySelector('select');
                if (sizeEl) size = sizeEl.value === 'Select Size' ? 'XL' : sizeEl.value;
                
                const h6Text = infoEl.querySelector('h6') ? infoEl.querySelector('h6').innerText : '';
                if (h6Text.includes('Color :')) {
                    color = h6Text.split('Color :')[1].trim();
                }
            }
            
            const checkoutProduct = {
                name: name,
                price: price,
                img: img,
                brand: brand,
                size: size,
                color: color
            };
            
            localStorage.setItem('currentCheckoutProduct', JSON.stringify(checkoutProduct));
            localStorage.setItem('checkoutMode', 'direct');
            
            const parentAnchor = e.target.closest('a');
            if (parentAnchor && parentAnchor.getAttribute('href')) {
                window.location.href = parentAnchor.getAttribute('href');
            } else {
                window.location.href = 'paymant.html';
            }
        }
    }
});

// --- CART PAGE UI RENDERING ---

let discountPercent = 0;

function renderCartPage() {
    const cartBody = document.getElementById('cart-items-body');
    const emptyMessage = document.getElementById('empty-cart-message');
    const cartTable = document.querySelector('#cart table');
    const cartAddSection = document.getElementById('cart-add');
    
    if (!cartBody) return; // Not on the cart page
    
    const cart = getCart();
    
    if (cart.length === 0) {
        if (cartTable) cartTable.style.display = 'none';
        if (cartAddSection) cartAddSection.style.display = 'none';
        if (emptyMessage) emptyMessage.style.display = 'block';
        return;
    }
    
    if (cartTable) cartTable.style.display = 'table';
    if (cartAddSection) cartAddSection.style.display = 'flex';
    if (emptyMessage) emptyMessage.style.display = 'none';
    
    cartBody.innerHTML = '';
    
    cart.forEach((item, index) => {
        const row = document.createElement('tr');
        
        const numericPrice = parsePrice(item.price);
        const subtotal = numericPrice * item.quantity;
        const currencySign = item.price.includes('₹') || item.price.includes('Rs') || item.price.includes('Rupee') || item.price.includes('rupee') ? '₹' : '$';
        
        row.innerHTML = `
            <td><a href="#" class="remove-cart-item" data-index="${index}"><i class="fa-regular fa-circle-xmark"></i></a></td>
            <td><img src="${item.img}" alt="${item.name}"></td>
            <td>
                <strong>${item.name}</strong><br>
                <small style="color: #666; font-size: 11px;">Brand: ${item.brand} | Size: ${item.size}</small>
            </td>
            <td>${currencySign}${numericPrice.toFixed(2)}</td>
            <td><input type="number" class="cart-qty-input" data-index="${index}" min="1" value="${item.quantity}"></td>
            <td>${currencySign}${subtotal.toFixed(2)}</td>
        `;
        
        cartBody.appendChild(row);
    });
    
    calculateTotals();
}

// Extract numerical values from price strings
function parsePrice(priceStr) {
    if (!priceStr) return 0;
    const cleaned = priceStr.replace(/[^0-9.]/g, '');
    const val = parseFloat(cleaned);
    return isNaN(val) ? 0 : val;
}

// Calculate subtotals, discount and grand totals
function calculateTotals() {
    const cart = getCart();
    let subtotal = 0;
    let currencySign = '$';
    
    cart.forEach(item => {
        const price = parsePrice(item.price);
        subtotal += price * item.quantity;
        if (item.price.includes('₹') || item.price.includes('Rs') || item.price.includes('Rupee') || item.price.includes('rupee')) {
            currencySign = '₹';
        }
    });
    
    const discount = subtotal * discountPercent;
    const total = subtotal - discount;
    
    const subtotalEl = document.getElementById('cart-subtotal-val');
    const totalEl = document.getElementById('cart-total-val');
    const discountRow = document.getElementById('discount-row');
    const discountEl = document.getElementById('discount-val');
    
    if (subtotalEl) subtotalEl.innerText = `${currencySign}${subtotal.toFixed(2)}`;
    if (totalEl) totalEl.innerText = `${currencySign}${total.toFixed(2)}`;
    
    if (discountRow && discountEl) {
        if (discountPercent > 0) {
            discountRow.style.display = 'table-row';
            discountEl.innerText = `-${currencySign}${discount.toFixed(2)} (${discountPercent * 100}%)`;
        } else {
            discountRow.style.display = 'none';
        }
    }
}

// Handle quantity changes in inputs
document.addEventListener('change', function(e) {
    if (e.target && e.target.classList.contains('cart-qty-input')) {
        const index = parseInt(e.target.getAttribute('data-index'));
        const val = parseInt(e.target.value) || 1;
        const cart = getCart();
        if (cart[index]) {
            cart[index].quantity = val < 1 ? 1 : val;
            saveCart(cart);
            renderCartPage();
        }
    }
});

// Handle item removal clicks
document.addEventListener('click', function(e) {
    const removeBtn = e.target.closest('.remove-cart-item');
    if (removeBtn) {
        e.preventDefault();
        const index = parseInt(removeBtn.getAttribute('data-index'));
        let cart = getCart();
        if (cart[index]) {
            cart.splice(index, 1);
            saveCart(cart);
            renderCartPage();
        }
    }
});

// Handle applying coupon codes
document.addEventListener('click', function(e) {
    if (e.target && e.target.id === 'apply-coupon-btn') {
        const couponInput = document.getElementById('coupon-code');
        const messageEl = document.getElementById('coupon-message');
        if (couponInput && messageEl) {
            const code = couponInput.value.trim().toUpperCase();
            if (code === 'SAVE10') {
                discountPercent = 0.10;
                messageEl.style.color = 'green';
                messageEl.innerText = 'Promo code SAVE10 applied! 10% discount.';
            } else if (code === 'SAVE20') {
                discountPercent = 0.20;
                messageEl.style.color = 'green';
                messageEl.innerText = 'Promo code SAVE20 applied! 20% discount.';
            } else if (code === '') {
                discountPercent = 0;
                messageEl.innerText = '';
            } else {
                discountPercent = 0;
                messageEl.style.color = 'red';
                messageEl.innerText = 'Invalid promo code.';
            }
            calculateTotals();
        }
    }
});

// Handle proceed to checkout
document.addEventListener('click', function(e) {
    if (e.target && e.target.id === 'checkout-btn') {
        const cart = getCart();
        if (cart.length === 0) {
            alert('Your cart is empty.');
            return;
        }
        
        let subtotal = 0;
        let currencySign = '$';
        let itemNames = [];
        let firstImg = 'E:\\Shopping app\\images\\Products\\f1.jpg';
        let brand = 'Multiple Brands';
        
        cart.forEach((item, index) => {
            const price = parsePrice(item.price);
            subtotal += price * item.quantity;
            if (item.price.includes('₹') || item.price.includes('Rs') || item.price.includes('Rupee') || item.price.includes('rupee')) {
                currencySign = '₹';
            }
            itemNames.push(`${item.name} (x${item.quantity})`);
            if (index === 0) {
                firstImg = item.img;
                brand = item.brand;
            }
        });
        
        const discount = subtotal * discountPercent;
        const grandTotal = subtotal - discount;
        
        const checkoutProduct = {
            name: itemNames.join(', '),
            price: `${currencySign}${grandTotal.toFixed(2)}`,
            img: firstImg,
            brand: brand,
            size: 'Multiple'
        };
        
        localStorage.setItem('currentCheckoutProduct', JSON.stringify(checkoutProduct));
        localStorage.setItem('checkoutMode', 'cart');
        
        window.location.href = 'paymant.html';
    }
});

// Observe success modal overlay on paymant.html to clear cart and save orders
document.addEventListener('DOMContentLoaded', function() {
    updateCartBadge();
    renderCartPage();
    renderOrdersPage();
    
    // Clear cart and save order if success modal overlay active on paymant.html
    if (window.location.pathname.includes('paymant.html')) {
        const successOverlay = document.getElementById('successOverlay');
        
        function processSuccessfulOrder() {
            let orders = JSON.parse(localStorage.getItem('myOrders')) || [];
            
            if (localStorage.getItem('checkoutMode') === 'cart') {
                let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
                cart.forEach(item => {
                    item.status = 'Processing';
                    item.orderDate = new Date().toISOString();
                    orders.push(item);
                });
                localStorage.removeItem('shoppingCart');
            } else if (localStorage.getItem('checkoutMode') === 'direct') {
                let item = JSON.parse(localStorage.getItem('currentCheckoutProduct'));
                if (item) {
                    item.quantity = 1;
                    item.status = 'Processing';
                    item.orderDate = new Date().toISOString();
                    orders.push(item);
                }
            }
            
            localStorage.setItem('myOrders', JSON.stringify(orders));
            localStorage.removeItem('checkoutMode');
            localStorage.removeItem('currentCheckoutProduct');
            updateCartBadge();
        }

        if (successOverlay) {
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.attributeName === 'class' && successOverlay.classList.contains('active')) {
                        if (localStorage.getItem('checkoutMode')) {
                            processSuccessfulOrder();
                        }
                    }
                });
            });
            observer.observe(successOverlay, { attributes: true });
        }
        
        const successBtn = document.getElementById('successRedirectBtn');
        if (successBtn) {
            successBtn.addEventListener('click', function() {
                if (localStorage.getItem('checkoutMode')) {
                    processSuccessfulOrder();
                }
            });
        }
    }
});

// --- MY ORDERS PAGE UI RENDERING ---
function renderOrdersPage() {
    const ordersBody = document.querySelector('#cart tbody');
    if (!ordersBody || !window.location.pathname.includes('myorder.html')) return;
    
    let orders = JSON.parse(localStorage.getItem('myOrders')) || [];
    
    if (orders.length === 0) {
        ordersBody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px;">You have no past orders.</td></tr>';
        return;
    }
    
    ordersBody.innerHTML = '';
    
    // Sort by newest first
    orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
    
    orders.forEach((item) => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td><img src="${item.img}" alt=""></td>
            <td>${item.name}</td>
            <td>${item.price}</td>
            <td>${item.quantity || 1}</td>
            <td style="color: orange; font-weight: bold;">${item.status || 'Processing'}</td>
            <td><a href="order.html"><button class="normal" style="padding: 10px 15px; font-size: 12px;">Track Order</button></a></td>
        `;
        
        ordersBody.appendChild(row);
    });
}

// --- PRODUCT CLICK & SINGLE PRODUCT (SPRODUCT) DYNAMIC LOADER ---

// Global handler for clicking product cards to view product details
document.addEventListener('click', function (e) {
    // If click is on cart icon or its link, don't trigger viewProduct navigation
    if (e.target.closest('.cart') || e.target.classList.contains('fa-cart-shopping')) {
        return;
    }

    const proCard = e.target.closest('.pro');
    if (proCard) {
        // Prevent inner link defaults if wrapped in <a>
        const link = e.target.closest('a');
        if (link && link.getAttribute('href') && link.getAttribute('href') !== '#') {
            e.preventDefault();
        }

        const imgEl = proCard.querySelector('img');
        const imgSrc = imgEl ? (imgEl.getAttribute('src') || imgEl.src) : '';
        
        const desEl = proCard.querySelector('.des');
        let brand = 'adidas';
        let name = 'Product';
        let price = '₹499.00';

        if (desEl) {
            const brandEl = desEl.querySelector('span');
            if (brandEl) brand = brandEl.innerText.trim();

            const titleEl = desEl.querySelector('h5');
            if (titleEl) name = titleEl.innerText.trim();

            const priceEl = desEl.querySelector('h4');
            if (priceEl) price = priceEl.innerHTML.trim();
        }

        let smallImgs = [];
        const smallImgsAttr = proCard.getAttribute('data-small-imgs');
        if (smallImgsAttr) {
            try {
                smallImgs = JSON.parse(smallImgsAttr);
            } catch (err) {
                smallImgs = smallImgsAttr.split(',').map(s => s.trim());
            }
        }

        if (!smallImgs || !smallImgs.length) {
            smallImgs = [imgSrc, imgSrc, imgSrc, imgSrc];
        }

        const product = {
            img: imgSrc,
            name: name,
            brand: brand,
            price: price,
            smallImgs: smallImgs
        };

        localStorage.setItem('selectedProduct', JSON.stringify(product));

        const params = new URLSearchParams();
        params.set('img', imgSrc);
        params.set('name', name);
        params.set('brand', brand);
        params.set('price', price.replace(/<[^>]*>?/gm, ''));
        params.set('sm', JSON.stringify(smallImgs));

        window.location.href = 'sproduct.html?' + params.toString();
    }
});

// Function to load single product data into sproduct.html
function loadSingleProduct() {
    const mainImgEl = document.getElementById('MainImg');
    if (!mainImgEl) return;

    let productData = null;

    // 1. Try reading from URL Search Params
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('img') || urlParams.has('name')) {
        let smImgs = [];
        try {
            if (urlParams.has('sm')) smImgs = JSON.parse(urlParams.get('sm'));
        } catch (e) {}

        productData = {
            img: urlParams.get('img'),
            name: urlParams.get('name'),
            brand: urlParams.get('brand'),
            price: urlParams.get('price'),
            smallImgs: smImgs
        };
    }

    // 2. Fallback to localStorage
    if (!productData || !productData.img) {
        try {
            const stored = localStorage.getItem('selectedProduct');
            if (stored) {
                productData = JSON.parse(stored);
            }
        } catch (e) {}
    }

    // 3. Render into DOM if product data exists
    if (productData && productData.img) {
        mainImgEl.src = productData.img;

        const smallimg = document.getElementsByClassName("small-img");
        const thumbs = (productData.smallImgs && productData.smallImgs.length) ? productData.smallImgs : [productData.img, productData.img, productData.img, productData.img];

        for (let i = 0; i < smallimg.length; i++) {
            if (thumbs[i]) {
                smallimg[i].src = thumbs[i];
            } else {
                smallimg[i].src = productData.img;
            }
        }

        const detailsEl = document.querySelector('.single-pro-details');
        if (detailsEl) {
            if (productData.brand) {
                const brandEl = detailsEl.querySelector('h6 strong');
                if (brandEl) brandEl.innerText = productData.brand;
            }
            if (productData.name) {
                const titleEl = detailsEl.querySelector('h4');
                if (titleEl) titleEl.innerText = productData.name;
            }
            if (productData.price) {
                const priceEl = detailsEl.querySelector('h2');
                if (priceEl) {
                    if (productData.price.includes('fa-indian-rupee-sign') || productData.price.includes('₹')) {
                        priceEl.innerHTML = productData.price;
                    } else if (productData.price.includes('$')) {
                        priceEl.innerText = productData.price;
                    } else {
                        priceEl.innerHTML = `<i class="fa-solid fa-indian-rupee-sign"></i>${productData.price}`;
                    }
                }
            }
        }
    }

    // Bind thumbnail click events to swap main image
    const smallimg = document.getElementsByClassName("small-img");
    for (let i = 0; i < smallimg.length; i++) {
        smallimg[i].onclick = function () {
            mainImgEl.src = this.src;
        };
    }
}

document.addEventListener('DOMContentLoaded', loadSingleProduct);

