document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        
        const formDataJSON = {};
        formData.forEach((value, key) => {
            formDataJSON[key] = value;
        });

        const response = await fetch('/api/sessions/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formDataJSON),
        });

        const responseData = await response.json();

        if (responseData.status === 'success') {
            window.location.replace('/products');
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Error al iniciar sesión',
                confirmButtonColor: '#FF4B2B',
                text: 'Usuario o contraseña incorrectos. Verifica tus datos e inténtalo nuevamente.',
            });
        }
    });

});
document.addEventListener('DOMContentLoaded', () => {
    const btnLogout = document.getElementById('logout');
    
    btnLogout.addEventListener('click', async () => {
        try {
            const response = await fetch('/api/sessions/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const responseData = await response.json();

            if (responseData.status === 'success') {
                window.location.replace('/login');
            } else {
               console.error("Error al cerrar sesión");
            }
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    });

});

document.addEventListener('DOMContentLoaded', (e) => {
    const products = document.querySelectorAll('[id^="btn_add_"]');
    
    products.forEach((btnAddToCart) => {
        btnAddToCart.addEventListener('click', () => {
            const idParts = btnAddToCart.id.split('_');
            const productId = idParts[idParts.length - 1];
            console.log(`Estoy clickeando en el botón con ID ${productId}`);
        });
    });
});