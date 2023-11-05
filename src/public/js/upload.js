document.addEventListener('DOMContentLoaded', () => {
    const profileForm = document.getElementById('profileForm');
    const productForm = document.getElementById('productForm');
    const documentForm = document.getElementById('documentForm');

    profileForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(profileForm);

        const uId = profileForm.getAttribute('user').valueOf();

        const response = await fetch(`/api/users/${uId}/documents/profile`, {
            method: 'POST',
            body: formData,
        });

        if (response.status === 201) {
            Swal.fire({
                icon: 'success',
                title: 'Imagen Cargada',
                confirmButtonColor: '#FF4B2B',
                text: 'La imagen de perfil se ha cargado correctamente.',
            });
        }
    });

    productForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(productForm);

        const uId = productForm.getAttribute('user').valueOf();

        const response = await fetch(`/api/users/${uId}/documents/products`, {
            method: 'POST',
            body: formData,
        });

        if (response.status === 201) {
            Swal.fire({
                icon: 'success',
                title: 'Imágenes Cargadas',
                confirmButtonColor: '#FF4B2B',
                text: 'Las imágenes de productos se han cargado correctamente.',
            });
        }
    });
    
    documentForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(documentForm);

        const documentType =  document.getElementById("documentType");
        const selectedValue = documentType.value;
        
        const uId = productForm.getAttribute('user').valueOf();
        
        formData.append('documentType', selectedValue);

        const response = await fetch(`/api/users/${uId}/documents`, {
            method: 'POST',
            body: formData,
        });

        if (response.status === 201) {
            Swal.fire({
                icon: 'success',
                title: 'Documento Cargado',
                confirmButtonColor: '#FF4B2B',
                text: 'El documento se ha cargado correctamente.',
            });
        }
    });
    

});