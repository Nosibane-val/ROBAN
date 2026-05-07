function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || []
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart))
}

function updateCartCount() {
    const cart = getCart()
    const total = cart.reduce((sum, item) => sum + item.quantity, 0)
    const cartLink = document.getElementById('cart-count')
    if(cartLink) cartLink.textContent = `Cart (${total})`
}

function checkAuth() {
    const user = JSON.parse(localStorage.getItem('user'))
    const authLink = document.getElementById('auth-link')
    const logoutBtn = document.getElementById('logout-btn')
    const userGreeting = document.getElementById('user-greeting')

    if (user) {
        authLink.style.display = 'none'
        logoutBtn.style.display = 'block'
        userGreeting.textContent = `Hi, ${user.name}!`
    }
}

function addToCart(productId, name, price, image){
    const cart = getCart()
    const existingItem = cart.find(item => item.productId === productId)

    if (existingItem) {
        existingItem.quantity +=1
    } else {
        cart.push({ productId, name, price, image, quantity: 1})
    }

    saveCart(cart)
    updateCartCount()
    alert(`${name} added to cart!`)
}

async function fetchProduct() {
    const params = new URLSearchParams(window.location.search)
    const productId = params.get('id')

    if (!productId) {
        window.location.href = 'index.html'
        return
    }

    try {
        const response = await fetch(`http://localhost:5001/api/products/${productId}`)
        const product = await response.json()

        const detail = document.getElementById('product-detail')

        detail.innerHTML = `
        
        <div class="product-detail-container">
          <div class="product-detail-image">
            <img src="${product.image || 'https://placehold.co/500x400?text=No+Image'}" alt="${product.name}" />
          </div>

          <div class="product-detail-info">
            <span class="product-category">${product.category}</span>
            <h1>${product.name}</h1>
            <p class="product-detail-description">${product.description}</p>
            <div class="product-detail-price">$${product.price}</div>
            <p class="product-stock ${product.stock > 0 ? 'in-stock' : 'out-stock'}">
            ${product.stock > 0 ? `<i class="fas fa-check-circle"></i> In Stock (${product.stock} availabble)` : '<i class="fas fa--times-circle"></i> Our of Stock'}
            </p>

            <div class="product-detail-actions">
              <button
              class="add-to-cart-btn"
              ${product.stock === 0 ? 'disabled' : ''}
              data-id="${product._id}"
              data-name="${product.name}"
              data-price="${product.price}"
              data-image="${product.image}"
              onclick="addToCart(this.dataset.id, this.dataset.name, this.dataset.price, this.dataset.image)"
              ><i class="fas fa-shopping-cart"></i> Add to Cart
              </button>
              <a href="index.html" class="back-btn">
              <i class="fas fa-arrow-left"></i> Back to Store
              </a>
            </div>
          </div>
        </div>
        `
    } catch (error) {
         console.log('Fetch error:', error.message)
        document.getElementById('product-detail').innerHTML = '<p>Failed to load product.</p>'
    }
}

fetchProduct()
updateCartCount()
checkAuth()