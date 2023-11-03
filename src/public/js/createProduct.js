document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('newProduct-form');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        
        const formDataJSON = {};
        formData.forEach((value, key) => {
            formDataJSON[key] = value;
        });

        const response = await fetch('/api/products/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formDataJSON),
        });

        if (response.status === 201) {
            // La solicitud se completó con éxito, puedes redirigir a la página deseada
            window.location.href = '/api/products';
        } else {
            // Manejar errores aquí
        }
    });
});
