function showTab(tab) {
    const loginForm = document.getElementById('login-form')
    const signupForm = document.getElementById('signup-form')
    const loginTab = document.getElementById('login-tab')
    const signupTab = document.getElementById('login-tab')

    if(tab === 'login') {
        loginForm.style.display = 'block'
        signupForm.style.display = 'none'
        loginTab.classList.add('active-tab')
        signupTab.classList.add('active-tab')
    } else {
        loginForm.style.display = 'none'
        signupForm.style.display = 'block'
        loginTab.classList.remove('active-tab')
        signupTab.classList.add('active-tab')
    }

}

async function login() {
    const email = document.getElementById('login-email').value
    const password = document.getElementById('login-password').value
    const errorMsg = document.getElementById('login-error')

    try {
        const response = await fetch('http://localhost:5001/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password})
        })

        const data = await response.json()

        if(!response.ok) {
            errorMsg.textContent = data.messsage
            return
        }

        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify({
            _id: data._id,
            name: data.name,
            email: data.email,
            role: data.role
        }))

        window.location.href = 'index.html'
        email = ''
        password = ''
    } catch (error) {
        errorMsg.textContent = 'Something went wrong!. Try again.'
    }
}

async function signup() {
    const name = document.getElementById('signup-name').value
    const email = document.getElementById('signup-email').value
    const password = document.getElementById('signup-password').value
    const errorMsg = document.getElementById('signup-eror')

    try {
        const response = await fetch('http://localhost:5001/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        })

        const data = await response.json()

        if(!response.ok) {
            errorMsg.textContent = data.messsage
            return
        }

        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify({
            _id: data._id,
            name: data.name,
            email: data.email,
            role: data.role
        }))
        
        name = ''
        email = ''
        password = ''
        window.location.href = 'index.html'
    } catch(error) {
        errorMsg.textContent = 'Something went wrong!. Try again.'
    }
}