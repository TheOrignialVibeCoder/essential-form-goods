document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        const mobileMenuIcon = mobileMenuButton.querySelector('i');
        mobileMenuButton.addEventListener('click', () => {
            const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true' || false;
            mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.classList.toggle('hidden');
            if (mobileMenu.classList.contains('hidden')) {
                mobileMenuIcon.setAttribute('data-lucide', 'menu');
            } else {
                mobileMenuIcon.setAttribute('data-lucide', 'x');
            }
            lucide.createIcons();
        });
    }

    const collectionsMobileButton = document.getElementById('collections-mobile-button');
    const collectionsMobileDropdown = document.getElementById('collections-mobile-dropdown');
    
    if (collectionsMobileButton && collectionsMobileDropdown) {
        const collectionsMobileIcon = collectionsMobileButton.querySelector('i');
        collectionsMobileButton.addEventListener('click', (e) => {
            e.stopPropagation();
            collectionsMobileDropdown.classList.toggle('hidden');
            collectionsMobileButton.classList.toggle('open');
            if (collectionsMobileDropdown.classList.contains('hidden')) {
                collectionsMobileIcon.setAttribute('data-lucide', 'chevron-down');
            } else {
                collectionsMobileIcon.setAttribute('data-lucide', 'chevron-up');
            }
            lucide.createIcons();
        });
    }
    
    const collectionsDesktopButton = document.getElementById('collections-desktop-button');
    const collectionsDesktopDropdown = document.getElementById('collections-desktop-dropdown');

    if (collectionsDesktopButton && collectionsDesktopDropdown) {
        collectionsDesktopButton.addEventListener('click', (event) => {
            event.stopPropagation();
            collectionsDesktopDropdown.classList.toggle('hidden');
        });

        document.addEventListener('click', (event) => {
            if (!collectionsDesktopButton.contains(event.target) && !collectionsDesktopDropdown.contains(event.target)) {
                collectionsDesktopDropdown.classList.add('hidden');
            }
        });
    }

    let cart = JSON.parse(localStorage.getItem('efgCart')) || [];

    const cartModal = document.getElementById('cart-modal');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartSubtotalElement = document.getElementById('cart-subtotal');
    const cartEmptyMessage = document.getElementById('cart-empty-message');
    const cartIconDesktop = document.getElementById('cart-icon-desktop');
    const cartIconMobile = document.getElementById('cart-icon-mobile');
    const cartItemCountDesktop = document.getElementById('cart-item-count-desktop');
    const cartItemCountMobile = document.getElementById('cart-item-count-mobile');
    const closeCartModalButton = document.getElementById('close-cart-modal-button');
    const continueShoppingButton = document.getElementById('continue-shopping-button');
    const checkoutButton = document.getElementById('checkout-button');

    function saveCart() {
        localStorage.setItem('efgCart', JSON.stringify(cart));
    }

    function updateCartIconCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartItemCountDesktop) cartItemCountDesktop.textContent = totalItems;
        if (cartItemCountMobile) cartItemCountMobile.textContent = totalItems;
    }

    function formatPrice(price) {
        return `$${parseFloat(price).toFixed(2)}`;
    }

    function renderCartItems() {
        if (!cartItemsContainer) return;
        cartItemsContainer.innerHTML = ''; 
        
        if (cart.length === 0) {
            if(cartEmptyMessage) cartEmptyMessage.classList.remove('hidden');
        } else {
            if(cartEmptyMessage) cartEmptyMessage.classList.add('hidden');
            cart.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'flex items-center space-x-3 sm:space-x-4 p-3 border border-light-grey rounded-md bg-white';
                itemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded bg-stone-100 p-1">
                    <div class="flex-grow">
                        <h3 class="text-sm sm:text-md font-medium text-deep-charcoal">${item.name}</h3>
                        <p class="text-xs sm:text-sm text-mid-grey">${formatPrice(item.price)}</p>
                    </div>
                    <div class="flex items-center space-x-1 sm:space-x-2">
                        <button data-id="${item.id}" class="cart-quantity-decrease text-muted-forest hover:text-deep-charcoal p-1 rounded-full hover:bg-light-grey/50">
                            <i data-lucide="minus-circle" class="w-4 h-4 sm:w-5 sm:h-5"></i>
                        </button>
                        <input type="number" value="${item.quantity}" min="1" data-id="${item.id}" class="cart-item-quantity w-10 sm:w-12 text-center border border-light-grey rounded-md text-sm py-1">
                        <button data-id="${item.id}" class="cart-quantity-increase text-muted-forest hover:text-deep-charcoal p-1 rounded-full hover:bg-light-grey/50">
                            <i data-lucide="plus-circle" class="w-4 h-4 sm:w-5 sm:h-5"></i>
                        </button>
                    </div>
                    <p class="text-sm sm:text-md font-medium text-deep-charcoal w-16 sm:w-20 text-right">${formatPrice(item.price * item.quantity)}</p>
                    <button data-id="${item.id}" class="cart-remove-item text-mid-grey hover:text-red-600 p-1 rounded-full hover:bg-light-grey/50">
                        <i data-lucide="trash-2" class="w-4 h-4 sm:w-5 sm:h-5"></i>
                    </button>
                `;
                cartItemsContainer.appendChild(itemElement);
            });
        }
        updateCartSubtotal();
        updateCartIconCount();
        lucide.createIcons();
    }

    function updateCartSubtotal() {
        if (!cartSubtotalElement) return;
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartSubtotalElement.textContent = formatPrice(subtotal);
    }

    function addToCart(productId, name, price, image) {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ id: productId, name, price: parseFloat(price), image, quantity: 1 });
        }
        saveCart();
        renderCartItems();
        openCartModal(); 
    }

    function updateQuantity(productId, quantity) {
        const itemInCart = cart.find(item => item.id === productId);
        if (itemInCart) {
            itemInCart.quantity = Math.max(1, parseInt(quantity, 10)); // Ensure quantity is at least 1
            saveCart();
            renderCartItems();
        }
    }
    
    function decreaseQuantity(productId) {
        const itemInCart = cart.find(item => item.id === productId);
        if (itemInCart) {
            itemInCart.quantity--;
            if (itemInCart.quantity <= 0) {
                removeFromCart(productId);
            } else {
                saveCart();
                renderCartItems();
            }
        }
    }

    function increaseQuantity(productId) {
        const itemInCart = cart.find(item => item.id === productId);
        if (itemInCart) {
            itemInCart.quantity++;
            saveCart();
            renderCartItems();
        }
    }


    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        saveCart();
        renderCartItems();
    }

    function openCartModal() {
        if (cartModal) {
            renderCartItems();
            cartModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden'; 
        }
    }

    function closeCartModal() {
        if (cartModal) {
            cartModal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }

    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const { productId, productName, productPrice, productImage } = e.currentTarget.dataset;
            addToCart(productId, productName, productPrice, productImage);
        });
    });

    if (cartIconDesktop) cartIconDesktop.addEventListener('click', (e) => { e.preventDefault(); openCartModal(); });
    if (cartIconMobile) cartIconMobile.addEventListener('click', (e) => { e.preventDefault(); openCartModal(); });
    if (closeCartModalButton) closeCartModalButton.addEventListener('click', closeCartModal);
    if (continueShoppingButton) continueShoppingButton.addEventListener('click', closeCartModal);
    
    if (cartModal) {
        cartModal.addEventListener('click', (e) => {
            if (e.target === cartModal) {
                closeCartModal();
            }
        });
    }

    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', (e) => {
            const target = e.target.closest('button');
            if (!target) return;

            const productId = target.dataset.id;
            if (target.classList.contains('cart-quantity-decrease')) {
                decreaseQuantity(productId);
            } else if (target.classList.contains('cart-quantity-increase')) {
                increaseQuantity(productId);
            } else if (target.classList.contains('cart-remove-item')) {
                removeFromCart(productId);
            }
        });
        
        cartItemsContainer.addEventListener('change', (e) => {
            if (e.target.classList.contains('cart-item-quantity')) {
                const productId = e.target.dataset.id;
                const newQuantity = parseInt(e.target.value, 10);
                if (newQuantity >= 1) {
                    updateQuantity(productId, newQuantity);
                } else {
                    e.target.value = cart.find(item => item.id === productId).quantity; 
                }
            }
        });
    }

    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            if (cart.length > 0) {
                window.location.href = 'checkout.html';
            } else {
                alert("Your cart is empty. Add some products before proceeding to checkout.");
            }
        });
    }
    
    renderCartItems(); 
});
