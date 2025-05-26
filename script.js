document.addEventListener('DOMContentLoaded', () => {
    const fullscreenImageContainer = document.getElementById('fullscreen-image-container');
    const enterSiteButton = document.getElementById('enter-site-button');
    const mainHeader = document.getElementById('main-header');
    const mainContent = document.getElementById('main-content');

    const homeLink = document.getElementById('home-link');
    const categoryLinks = document.querySelectorAll('.dropdown-content a');
    const adminLink = document.getElementById('admin-link');
    const userDashboardLink = document.getElementById('user-dashboard-link');
    const loginLink = document.getElementById('login-link');
    const registerLink = document.getElementById('register-link');
    const logoutLink = document.getElementById('logout-link');

    const homeSection = document.getElementById('home-section');
    const categorySection = document.getElementById('category-section');
    const productDetailSection = document.getElementById('product-detail-section');
    const loginSection = document.getElementById('login-section');
    const registerSection = document.getElementById('register-section');
    const adminPanelSection = document.getElementById('admin-panel-section');
    const userDashboardSection = document.getElementById('user-dashboard-section');
    const orderPlacementSection = document.getElementById('order-placement-section');

    const productList = document.getElementById('product-list');
    const categoryTitle = document.getElementById('category-title');
    const subcategoryFilters = document.getElementById('subcategory-filters');
    const categoryProductList = document.getElementById('category-product-list');
    const productDetailContent = document.getElementById('product-detail-content');
    const backToProductsButton = document.getElementById('back-to-products');

    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegisterFromLogin = document.getElementById('show-register-from-login');
    const showLoginFromRegister = document.getElementById('show-login-from-register');

    const addProductBtn = document.getElementById('add-product-btn');
    const addEditProductFormContainer = document.getElementById('add-edit-product-form-container');
    const addEditProductForm = document.getElementById('add-edit-product-form');
    const adminProductTableBody = document.getElementById('admin-product-table-body');
    const adminOrdersTableBody = document.getElementById('admin-orders-table-body');
    const cancelProductEditBtn = document.getElementById('cancel-product-edit');

    const orderForm = document.getElementById('order-form');
    const orderProductNameDisplay = document.getElementById('order-product-name-display');
    const orderProductPriceDisplay = document.getElementById('order-product-price-display');
    const orderQuantityInput = document.getElementById('order-quantity');
    const orderTotalPriceSpan = document.getElementById('order-total-price');
    const cancelOrderButton = document.getElementById('cancel-order');
    const userOrdersList = document.getElementById('user-orders-list');

    let loggedInUser = null; // Stores current logged-in user object
    let editingProductId = null; // For admin product edit

    // --- Initial Data (Simulated Database using Local Storage) ---
    function getProducts() {
        return JSON.parse(localStorage.getItem('products')) || [
            { id: 'p1', name: 'Mango Pickle', price: 150, image: 'pickle1.jpg', description: 'Tangy and spicy homemade mango pickle.', category: 'pickles', subcategory: 'veg' },
            { id: 'p2', name: 'Lemon Pickle', price: 120, image: 'pickle2.jpg', description: 'Zesty lemon pickle, a perfect accompaniment.', category: 'pickles', subcategory: 'veg' },
            { id: 'p3', name: 'Murukku', price: 80, image: 'snack1.jpg', description: 'Crispy and savory traditional South Indian snack.', category: 'snacks', subcategory: 'veg' },
            { id: 'p4', name: 'Cashew Nuts', price: 500, image: 'dryfruit1.jpg', description: 'Premium quality roasted cashew nuts.', category: 'dry-fruits', subcategory: 'veg' },
            { id: 'p5', name: 'Almonds', price: 450, image: 'dryfruit2.jpg', description: 'Healthy and delicious California almonds.', category: 'dry-fruits', subcategory: 'veg' },
            { id: 'p6', name: 'Paneer', price: 200, image: 'milk1.jpg', description: 'Fresh and soft cottage cheese.', category: 'milk-products', subcategory: 'veg' },
            { id: 'p7', name: 'Gulab Jamun', price: 250, image: 'sweet1.jpg', description: 'Soft, melt-in-your-mouth milk-solids-based sweets.', category: 'sweets', subcategory: 'veg' },
            { id: 'p8', name: 'Chikki', price: 100, image: 'sweet2.jpg', description: 'Peanut and jaggery brittle.', category: 'sweets', subcategory: 'veg' }
        ];
    }

    function saveProducts(products) {
        localStorage.setItem('products', JSON.stringify(products));
    }

    function getUsers() {
        return JSON.parse(localStorage.getItem('users')) || [];
    }

    function saveUsers(users) {
        localStorage.setItem('users', JSON.stringify(users));
    }

    function getOrders() {
        return JSON.parse(localStorage.getItem('orders')) || [];
    }

    function saveOrders(orders) {
        localStorage.setItem('orders', JSON.stringify(orders));
    }

    // Initialize products in local storage if not present
    if (!localStorage.getItem('products')) {
        saveProducts(getProducts());
    }

    // --- UI State Management ---
    function showSection(sectionToShow) {
        const sections = [
            homeSection, categorySection, productDetailSection,
            loginSection, registerSection, adminPanelSection,
            userDashboardSection, orderPlacementSection
        ];
        sections.forEach(section => section.classList.add('hidden'));
        sectionToShow.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function updateAuthUI() {
        if (loggedInUser) {
            loginLink.classList.add('hidden');
            registerLink.classList.add('hidden');
            logoutLink.classList.remove('hidden');
            userDashboardLink.classList.remove('hidden');
            if (loggedInUser.isAdmin) {
                adminLink.classList.remove('hidden');
            } else {
                adminLink.classList.add('hidden');
            }
        } else {
            loginLink.classList.remove('hidden');
            registerLink.classList.remove('hidden');
            logoutLink.classList.add('hidden');
            adminLink.classList.add('hidden');
            userDashboardLink.classList.add('hidden');
        }
    }

    // --- Fullscreen Intro Logic ---
    enterSiteButton.addEventListener('click', () => {
        fullscreenImageContainer.classList.add('hidden');
        mainHeader.classList.remove('hidden');
        mainContent.classList.remove('hidden');
        loadProducts(getProducts()); // Load initial products on home page
    });

    // --- Navigation Handlers ---
    homeLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(homeSection);
        loadProducts(getProducts());
    });

    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = e.target.dataset.category;
            displayCategoryProducts(category);
            showSection(categorySection);
        });
    });

    loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(loginSection);
    });

    registerLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(registerSection);
    });

    showRegisterFromLogin.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(registerSection);
    });

    showLoginFromRegister.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(loginSection);
    });

    logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        loggedInUser = null;
        localStorage.removeItem('loggedInUser'); // Clear session
        alert('You have been logged out.');
        updateAuthUI();
        showSection(homeSection);
        loadProducts(getProducts()); // Reload products after logout
    });

    adminLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (loggedInUser && loggedInUser.isAdmin) {
            showSection(adminPanelSection);
            renderAdminProducts();
            renderAdminOrders();
        } else {
            alert('Access Denied. Admins only.');
            showSection(homeSection); // Redirect if not admin
        }
    });

    userDashboardLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (loggedInUser) {
            showSection(userDashboardSection);
            renderUserOrders();
        } else {
            alert('Please login to view your dashboard.');
            showSection(loginSection);
        }
    });

    backToProductsButton.addEventListener('click', () => {
        // Go back to the last viewed product list (home or category)
        if (categorySection.classList.contains('active-section') && !categorySection.classList.contains('hidden')) {
             showSection(categorySection);
        } else {
            showSection(homeSection);
        }
    });


    // --- Product Display Functions ---
    function renderProductCard(product, container) {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.dataset.productId = product.id; // Store ID for detail view

        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>₹${product.price.toFixed(2)}</p>
            <button class="view-details-btn" data-product-id="${product.id}">View Details</button>
            ${loggedInUser && !loggedInUser.isAdmin ? `<button class="add-to-cart-btn" data-product-id="${product.id}">Order Now</button>` : ''}
        `;
        container.appendChild(productCard);

        // Event listener for "View Details" button
        productCard.querySelector('.view-details-btn').addEventListener('click', () => {
            displayProductDetails(product.id);
        });

        // Event listener for "Order Now" button
        const orderNowBtn = productCard.querySelector('.add-to-cart-btn');
        if (orderNowBtn) {
            orderNowBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent card click event
                initiateOrderPlacement(product.id);
            });
        }
    }

    function loadProducts(productsToDisplay, container = productList) {
        container.innerHTML = ''; // Clear existing products
        productsToDisplay.forEach(product => renderProductCard(product, container));
    }

    function displayCategoryProducts(category) {
        categoryTitle.textContent = category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ');
        subcategoryFilters.innerHTML = ''; // Clear previous filters

        const products = getProducts();
        let filteredProducts = products.filter(p => p.category === category);

        // Identify unique subcategories for the selected category
        const subcategories = [...new Set(filteredProducts.map(p => p.subcategory).filter(Boolean))];

        if (subcategories.length > 1) {
            const allBtn = document.createElement('button');
            allBtn.textContent = 'All';
            allBtn.classList.add('subcategory-filter-btn', 'active');
            allBtn.addEventListener('click', () => {
                document.querySelectorAll('.subcategory-filter-btn').forEach(btn => btn.classList.remove('active'));
                allBtn.classList.add('active');
                loadProducts(filteredProducts, categoryProductList);
            });
            subcategoryFilters.appendChild(allBtn);

            subcategories.forEach(subcat => {
                const btn = document.createElement('button');
                btn.textContent = subcat.charAt(0).toUpperCase() + subcat.slice(1);
                btn.classList.add('subcategory-filter-btn');
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.subcategory-filter-btn').forEach(btn => btn.classList.remove('active'));
                    btn.classList.add('active');
                    const subcatFiltered = filteredProducts.filter(p => p.subcategory === subcat);
                    loadProducts(subcatFiltered, categoryProductList);
                });
                subcategoryFilters.appendChild(btn);
            });
        }
        loadProducts(filteredProducts, categoryProductList);
        // Set category section as active for back button
        homeSection.classList.remove('active-section');
        categorySection.classList.add('active-section');
    }

    function displayProductDetails(productId) {
        const products = getProducts();
        const product = products.find(p => p.id === productId);

        if (product) {
            productDetailContent.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="price">Price: ₹${product.price.toFixed(2)}</p>
                    <p>${product.description}</p>
                    <p><strong>Category:</strong> ${product.category.charAt(0).toUpperCase() + product.category.slice(1).replace('-', ' ')}</p>
                    ${product.subcategory ? `<p><strong>Subcategory:</strong> ${product.subcategory.charAt(0).toUpperCase() + product.subcategory.slice(1)}</p>` : ''}
                    ${loggedInUser && !loggedInUser.isAdmin ? `<button class="order-now-detail-btn" data-product-id="${product.id}">Order Now</button>` : ''}
                </div>
            `;
            showSection(productDetailSection);

            const orderNowDetailBtn = productDetailContent.querySelector('.order-now-detail-btn');
            if (orderNowDetailBtn) {
                orderNowDetailBtn.addEventListener('click', () => {
                    initiateOrderPlacement(product.id);
                });
            }
        } else {
            alert('Product not found.');
        }
    }


    // --- Authentication (Login/Register) ---
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        if (email === 'admin@example.com' && password === 'admin123') {
            loggedInUser = { email: email, isAdmin: true };
            localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
            alert('Admin Login Successful!');
            updateAuthUI();
            showSection(adminPanelSection);
            renderAdminProducts();
            renderAdminOrders();
            loginForm.reset();
        } else {
            const users = getUsers();
            const user = users.find(u => u.email === email && u.password === password);
            if (user) {
                loggedInUser = user;
                localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
                alert('Login Successful!');
                updateAuthUI();
                showSection(homeSection);
                loadProducts(getProducts());
                loginForm.reset();
            } else {
                alert('Invalid email or password.');
            }
        }
    });

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;

        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        const users = getUsers();
        if (users.some(u => u.email === email)) {
            alert('User with this email already exists.');
            return;
        }

        const newUser = {
            id: 'user_' + Date.now(),
            name: name,
            email: email,
            password: password,
            isAdmin: false
        };
        users.push(newUser);
        saveUsers(users);
        alert('Registration Successful! Please login.');
        registerForm.reset();
        showSection(loginSection);
    });

    // --- Admin Panel Functions ---
    addProductBtn.addEventListener('click', () => {
        addEditProductForm.reset();
        document.getElementById('product-id').value = ''; // Clear ID for new product
        editingProductId = null;
        addEditProductFormContainer.classList.remove('hidden');
        document.getElementById('save-product-btn').textContent = 'Add Product';
    });

    cancelProductEditBtn.addEventListener('click', () => {
        addEditProductFormContainer.classList.add('hidden');
    });

    addEditProductForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const productId = document.getElementById('product-id').value;
        const name = document.getElementById('product-name').value;
        const price = parseFloat(document.getElementById('product-price').value);
        const image = document.getElementById('product-image').value;
        const description = document.getElementById('product-description').value;
        const category = document.getElementById('product-category').value;
        const subcategory = document.getElementById('product-subcategory').value;

        let products = getProducts();

        if (productId) { // Editing existing product
            const productIndex = products.findIndex(p => p.id === productId);
            if (productIndex !== -1) {
                products[productIndex] = { ...products[productIndex], name, price, image, description, category, subcategory };
                alert('Product updated successfully!');
            }
        } else { // Adding new product
            const newProduct = {
                id: 'prod_' + Date.now(),
                name, price, image, description, category, subcategory
            };
            products.push(newProduct);
            alert('Product added successfully!');
        }
        saveProducts(products);
        renderAdminProducts();
        addEditProductFormContainer.classList.add('hidden');
        loadProducts(products); // Refresh products on home page
    });

    function renderAdminProducts() {
        adminProductTableBody.innerHTML = '';
        const products = getProducts();
        products.forEach(product => {
            const row = adminProductTableBody.insertRow();
            row.innerHTML = `
                <td><img src="${product.image}" alt="${product.name}"></td>
                <td>${product.name}</td>
                <td>₹${product.price.toFixed(2)}</td>
                <td>${product.category.charAt(0).toUpperCase() + product.category.slice(1).replace('-', ' ')}</td>
                <td>${product.subcategory ? (product.subcategory.charAt(0).toUpperCase() + product.subcategory.slice(1)) : '-'}</td>
                <td class="action-buttons">
                    <button class="edit-btn" data-id="${product.id}">Edit</button>
                    <button class="delete-btn" data-id="${product.id}">Delete</button>
                </td>
            `;
        });

        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.dataset.id;
                const products = getProducts();
                const productToEdit = products.find(p => p.id === productId);
                if (productToEdit) {
                    document.getElementById('product-id').value = productToEdit.id;
                    document.getElementById('product-name').value = productToEdit.name;
                    document.getElementById('product-price').value = productToEdit.price;
                    document.getElementById('product-image').value = productToEdit.image;
                    document.getElementById('product-description').value = productToEdit.description;
                    document.getElementById('product-category').value = productToEdit.category;
                    document.getElementById('product-subcategory').value = productToEdit.subcategory;
                    editingProductId = productToEdit.id;
                    addEditProductFormContainer.classList.remove('hidden');
                    document.getElementById('save-product-btn').textContent = 'Update Product';
                }
            });
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.dataset.id;
                if (confirm('Are you sure you want to delete this product?')) {
                    let products = getProducts();
                    products = products.filter(p => p.id !== productId);
                    saveProducts(products);
                    renderAdminProducts();
                    loadProducts(products); // Refresh products on home page
                    alert('Product deleted successfully!');
                }
            });
        });
    }

    function renderAdminOrders() {
        adminOrdersTableBody.innerHTML = '';
        const orders = getOrders();
        orders.forEach(order => {
            const row = adminOrdersTableBody.insertRow();
            row.innerHTML = `
                <td>${order.id}</td>
                <td>${order.customerName}</td>
                <td>${order.customerEmail}</td>
                <td>${order.productName}</td>
                <td>${order.quantity}</td>
                <td>₹${order.totalPrice.toFixed(2)}</td>
                <td>Pending</td> `;
        });
    }

    // --- User Order Placement ---
    let currentProductForOrder = null;

    function initiateOrderPlacement(productId) {
        if (!loggedInUser) {
            alert('Please login to place an order.');
            showSection(loginSection);
            return;
        }

        const products = getProducts();
        currentProductForOrder = products.find(p => p.id === productId);

        if (currentProductForOrder) {
            document.getElementById('order-product-id').value = currentProductForOrder.id;
            orderProductNameDisplay.textContent = currentProductForOrder.name;
            orderProductPriceDisplay.textContent = currentProductForOrder.price.toFixed(2);
            orderQuantityInput.value = 1; // Default quantity
            updateOrderTotalPrice();
            showSection(orderPlacementSection);

            // Pre-fill user details if logged in
            document.getElementById('order-name').value = loggedInUser.name || '';
            document.getElementById('order-email').value = loggedInUser.email || '';

        } else {
            alert('Product not found for order.');
        }
    }

    orderQuantityInput.addEventListener('input', updateOrderTotalPrice);

    function updateOrderTotalPrice() {
        const quantity = parseInt(orderQuantityInput.value);
        if (isNaN(quantity) || quantity <= 0) {
            orderTotalPriceSpan.textContent = '0.00';
            return;
        }
        const price = currentProductForOrder ? currentProductForOrder.price : 0;
        orderTotalPriceSpan.textContent = (price * quantity).toFixed(2);
    }

    orderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!currentProductForOrder) {
            alert('No product selected for order.');
            return;
        }

        const customerName = document.getElementById('order-name').value;
        const customerEmail = document.getElementById('order-email').value;
        const quantity = parseInt(orderQuantityInput.value);
        const totalPrice = parseFloat(orderTotalPriceSpan.textContent);

        if (isNaN(quantity) || quantity <= 0) {
            alert('Please enter a valid quantity.');
            return;
        }

        const orders = getOrders();
        const newOrder = {
            id: 'order_' + Date.now(),
            productId: currentProductForOrder.id,
            productName: currentProductForOrder.name,
            productPrice: currentProductForOrder.price,
            quantity: quantity,
            totalPrice: totalPrice,
            customerName: customerName,
            customerEmail: customerEmail,
            orderDate: new Date().toLocaleString(),
            userId: loggedInUser ? loggedInUser.id : 'guest' // Associate order with user
        };
        orders.push(newOrder);
        saveOrders(orders);
        alert('Order placed successfully!');
        orderForm.reset();
        showSection(userDashboardSection); // Redirect to user dashboard after order
        renderUserOrders();
    });

    cancelOrderButton.addEventListener('click', () => {
        showSection(productDetailSection); // Go back to product details
    });

    // --- User Dashboard Functions ---
    function renderUserOrders() {
        userOrdersList.innerHTML = '';
        if (!loggedInUser) {
            userOrdersList.innerHTML = '<p>Please login to view your orders.</p>';
            return;
        }

        const orders = getOrders();
        const userSpecificOrders = orders.filter(order => order.userId === loggedInUser.id);

        if (userSpecificOrders.length === 0) {
            userOrdersList.innerHTML = '<p>You have not placed any orders yet.</p>';
            return;
        }

        userSpecificOrders.forEach(order => {
            const orderItem = document.createElement('div');
            orderItem.classList.add('user-order-item');
            orderItem.innerHTML = `
                <p><strong>Order ID:</strong> ${order.id}</p>
                <p><strong>Product:</strong> ${order.productName}</p>
                <p><strong>Quantity:</strong> ${order.quantity}</p>
                <p><strong>Total Price:</strong> ₹${order.totalPrice.toFixed(2)}</p>
                <p><strong>Order Date:</strong> ${order.orderDate}</p>
                <p><strong>Status:</strong> Pending</p> `;
            userOrdersList.appendChild(orderItem);
        });
    }

    // --- Initial Load ---
    // Check for logged-in user on page load (simple session persistence)
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
        loggedInUser = JSON.parse(storedUser);
    }
    updateAuthUI();
    loadProducts(getProducts()); // Load products initially for home page
});
