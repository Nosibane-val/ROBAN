function checkAuth () {
    const user = JSON.parse(localStorage.getItem('user'))
    const authLink = document.getElementById('auth-link')
    const logoutBtn = document.getElementById('logout-btn')
    const userGreeting = document.getElementById('user-greeting')

    let allProducts = []

    if(user) {
        authLink.style.display = 'none'
        logoutBtn.style.display = 'block'
        userGreeting.textContent = `Hello, ${user.name}!\nWelcome back!`
    }
}

function logout () {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = 'auth.html'
}


const container = document.getElementById('products-container')

function getCart (){
    return JSON.parse(localStorage.getItem('cart')) || []
}

function saveCart (cart) {
localStorage.setItem('cart', JSON.stringify(cart))
}

function addToCart (productId, name, price, image) {
const cart = getCart()

const existingItem = cart.find(item => item.productId === productId)

if (existingItem){
    existingItem.quantity += 1
} else {
    cart.push({productId, name, price, image, quantity: 1})
}

saveCart(cart)
updateCartCount()
alert(`${name} successfully added to cart!`)
}

function updateCartCount() {
    const cart = getCart()
    const total = cart.reduce((sum, item) => sum + item.quantity, 0)
    const cartLink = document.getElementById('cart-count')

    if (cartLink) cartLink.textContent = `Cart: ${total}`
}


// Fetch and display products

async function fetchProducts (){
    try {
        const response = await fetch ('http://localhost:5001/api/products')
        const products = await response.json()

        allProducts = products
        renderProducts(products)
    } catch (error) {
        container.innerHTML = `<p>No Products Found!</p>`
        console.error(error)
    }
}

function renderProducts(products) {
    if(products.length === 0) {
        container.innerHTML = `<p>No Products Found!</p>`
        return
    }
  container.innerHTML = products.map(product => `
            
            <div class="product-card" onclick="window.location.href = 'product.html?id=${product._id}'" style="cursor:pointer">
            <div class="product-image">
            <img src="${product.image || 'https://placehold.co/240x200?text=N0+Image'}" alt="${product.name}" />
            </div>
            
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <h3 class="">$${product.price.toFixed(2)}</h3>
            <p>In stock: ${product.stock}</p>
            <button class="add-to-cart"
            data-id="${product._id}"
            data-name="${product.name}"
            data-price="${product.price}"
            data-image="${product.image}"
            onclick="addToCart(this.dataset.id, this.dataset.name, this.dataset.price, this.dataset.image); event.stopPropagation(); return false;">
            Add to Cart 
            </button>
            </div>
            `
        ).join('')

}


function filterProducts() {
    const searchValue = document.getElementById('search-input').value.toLowerCase()
    const categoryValue = document.getElementById('category-filter').value
    const priceValue = document.getElementById('price-filter').value

    let filtered = allProducts

    // Filter by Search
    if(searchValue) {
        filtered = filtered.filter(product => 
            product.name.toLowerCase().includes(searchValue) ||
            product.description.toLowerCase().includes(searchValue)
        )
    }

    // Filter by category
    if(categoryValue) {
        filtered = filtered.filter(product => product.category === categoryValue)
    }

    // Filter by price
    if(priceValue) {
        const [min, max] = priceValue.split('-').map(Number)
        filtered = filtered.filter(product =>
            product.price >= min && product.price <= max
        )
    }

    renderProducts(filtered)
}

fetchProducts()
updateCartCount()
checkAuth()

