document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('upload-form');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(form);

        const uId = form.getAttribute('user').valueOf();
        const fileType = form.querySelector('#fileType').value;

        const response = await fetch(`/api/users/${uId}/documents/${fileType}`, {
            method: 'POST',
            body: formData,
        });

        if (response.status === 201) {
            Swal.fire({
                icon: 'success',
                title: 'Archivo Cargado',
                confirmButtonColor: '#FF4B2B',
                text: 'el archivo se ha cargado correctamente.',
            });
        }
    });

});