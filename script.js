const menu = document.getElementById('menu')
const cartBtn = document.getElementById('cart-btn')
const cartModal = document.getElementById('cart-modal')
const cartItemsContainer = document.getElementById('cart-items')
const cartTotal = document.getElementById('cart-total')
const checkoutBtn = document.getElementById('checkout-btn')
const closeModalBtn = document.getElementById('close-modal-btn')
const cartCount = document.getElementById('cart-count')
const addressInput = document.getElementById('address')
const addressWarn = document.getElementById('address-warn')
const checkoutWarn = document.getElementById('checkout-warn')

let cart = []

cartBtn.addEventListener('click', function() {
    updateCartmodal()
    cartModal.style.display = 'flex'
})

cartModal.addEventListener('click', function(event) {
    if(event.target === cartModal){
        cartModal.style.display = 'none'
    }
})

closeModalBtn.addEventListener('click', function() {
    cartModal.style.display = 'none'
})


menu.addEventListener('click', function(event) {
    let parentButton = event.target.closest('.add-to-cart-btn')

    if(parentButton){
        const name = parentButton.getAttribute('data-name')
        const price = parseFloat(parentButton.getAttribute('data-price'))
        addToCart(name, price)
    }



})

function addToCart(name, price) {
    const hasItem = cart.find(item => item.name === name)

    if(hasItem){
        hasItem.quantity+=1
        return;
    }else{
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }


    updateCartmodal()
}


function updateCartmodal() {
    cartItemsContainer.innerHTML = ''
    let total = 0

    cart.forEach(item => {
     const cartItemElement = document.createElement('div')
     cartItemElement.classList.add('flex', 'justify-between', 'mb-4', 'flex-col')

     cartItemElement.innerHTML = `
        <div class='flex items-center justify-between'>
            <div>
                <p class='font-medium'>${item.name}</p>
                <p>Quantidade: ${item.quantity}</p>
                <p class='font-medium mt-2'>R$ ${item.price.toFixed(2)}</p>
            </div>
                <button class='rm-btn' data-name='${item.name}'> Remover </button>
        </div>
        
    `

    total += item.price * item.quantity

    cartItemsContainer.appendChild(cartItemElement)
    })

    cartTotal.textContent = `Total: R$ ${total.toFixed(2)}`

    cartCount.innerHTML = cart.length
}

cartItemsContainer.addEventListener('click', function(event) {
    if(event.target.classList.contains('rm-btn')){
        const name = event.target.getAttribute('data-name')

        removeItemCart(name)
    }
})

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name)

    if(index !== -1){
        const item = cart[index]

        if(item.quantity > 1) {
            item.quantity -= 1
            updateCartmodal()
            return;
        }
        
        cart.splice(index, 1);
        updateCartmodal()   
    }
}

addressInput.addEventListener('input',function(event){
    let inputValue = event.target.value

    if(inputValue !== ''){
        addressWarn.classList.add('hidden')
    }
})


checkoutBtn.addEventListener('click', function(){
    const isOpen = checkRestauranteOpen()
    if(!isOpen){
        Toastify({
            text: "Ops, o restaurante está fechado no momento",
            duration: 3000,
            destination: "https://github.com/apvarun/toastify-js",
            newWindow: true,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "left", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "linear-gradient(to right, #00b09b, #96c93d)",
            },
        })
}

    if(cart.length === 0){
        checkoutWarn.classList.remove('hidden')
        return;
    }else if(cart.length !== 0){
        checkoutWarn.classList.add('hidden')
    } 
    if(addressInput.value === ''){
        addressWarn.classList.remove('hidden')
        return
    }
    
    const cartItems = cart.map((item) => {
        return (
            `${item.name} Quantidade: ${item.quantity} Preço: ${item.price} |`
        )
    }).join('')

    const message = encodeURIComponent(cartItems)
    const phone = '85991293258'

    window.open(`https://wa.me/${phone}?text=${message} Endereço:${addressInput.value}`, "_blank")

    cart = [],
    updateCartmodal();

    Toastify({
            text: "Compra, feita com sucesso!",
            duration: 3000,
            destination: "https://github.com/apvarun/toastify-js",
            newWindow: true,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "left", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "linear-gradient(to right, #00b09b, #96c93d)",
            },
        }).showToast()
})


function checkRestauranteOpen() {
    const data = new Date();
    const hora = data.getHours()
    return hora >= 18 && hora < 22;
}

const spanItem = document.getElementById('date-span')
const isOpen = checkRestauranteOpen()

if(isOpen){
    spanItem.classList.remove('bg-red-500')
    spanItem.classList.add('bg-green-500')
}else {
    spanItem.classList.remove('bg-green-600')
    spanItem.classList.add('bg-red-500')
}
