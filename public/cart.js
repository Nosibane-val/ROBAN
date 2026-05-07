function getCart () {
    return JSON.parse(localStorage.getItem('cart')) || []
}

function saveCart (cart) {
    localStorage.setItem('cart', JSON.stringify(cart))
}

function removeFromCart (productId) {
    let cart = getCart()
    cart = cart.filter(item => item.productId !== productId)

    saveCart(cart)
    renderCart()
}

function updateQuantity (productId, newQuantity) {
    const cart = getCart()
    const item = cart.find(item => item.productId === productId)

    if (newQuantity < 1){
        removeFromCart(productId)
        return
    }
    item.quantity = newQuantity
    saveCart(cart)
    renderCart()
}

function updateCartCount(){
    const cart = getCart()
    const total = cart.reduce((sum, item) => sum + item.quantity, 0)
    const cartLink = document.getElementById('cartcount')

    if (cartLink) cartLink.textContent = `Cart: ${total}`
}

function renderCart() {
    const cart = getCart()
    const container = document.getElementById('cart-container')
    const summary = document.getElementById('cart-summary')

    if(cart.length === 0){
        container.innerHTML = '<p>Your Cart is empty!</p>'
        summary.innerHTML = ''
        return
    }
    container.innerHTML = cart.map(item => `
            
            <div class="cart-item">
            <div class="cart-item-image">
            <img src="${item.image || 'https://placehold.co/80x80?text=No+Image'}" alt="${item.name}" />
            </div>

            <div class="cart-item-details">
            <h3>${item.name}</h3>
            <p>${item.price} each</p>
            <div class="quantity-controls">
             <button onclick="updateQuantity('${item.productId}', ${item.quantity - 1})">-</button>
             <span>${item.quantity}</span>
             <button onclick="updateQuantity('${item.productId}', ${item.quantity + 1})">+</button>
             </div>
             <p>Subtotal: $${item.price * item.quantity}</p>
             <button class="remove-btn" onclick="removeFromCart('${item.productId}')">Remove</button>
             </div>
             </div>
            `).join('')

            const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
            summary.innerHTML = `
            
            <div class="cart-total">
             <h3>Total: $${total}</h3>
             <button onclick="checkout()">Proceed to Checkout </button>
            </div>
            `
        updateCartCount()
    }

    async function checkout() {
        const token = localStorage.getItem('token')

        if(!token) {
            window.location.href = 'auth.html'
            return
        }

        const cart = getCart()

        if(cart.length === 0) {
            alert('Your cart is empty!')
            return
        }

        const items = cart.map(item => ({
            product: item.productId,
            quantity: item.quantity,
            price: item.price
        }))

        const totalPrice = cart.reduce((sum, item) =>
        sum + item.price * item.quantity, 0)

        try {
            const response = await fetch('http://localhost:5001/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ items, totalPrice })
            })

            const data = await response.json()

            if(!response.ok) {
                alert(data.message)
                return
            }

            localStorage.removeItem('cart')
            alert('Order placed successfully!')
            window.location.href = 'index.html'
        } catch (error) {
            alert('Something went wrong!. Try again')
        }
    }

    renderCart()
    updateCartCount()
