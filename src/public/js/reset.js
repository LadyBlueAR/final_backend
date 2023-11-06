document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('reset-form');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        
        const formDataJSON = {};
        formData.forEach((value, key) => {
            formDataJSON[key] = value;
        });

        const urlParams = new URLSearchParams(window.location.search);
        const email = urlParams.get('email');
        if (email) {
            document.getElementById('email').value = email;
        }

        const response = await fetch('/api/users/changePassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formDataJSON),
        });

        if (response.status === 400) {
            Swal.fire({
                icon: 'error',
                title: 'Error al modificar la contraseña',
                confirmButtonColor: '#FF4B2B',
                text: "La nueva contraseña no puede ser igual a la anterior",
            });
        } else if (response.status === 401 ) {
            Swal.fire({
                icon: 'error',
                title: 'Error al modificar la contraseña',
                confirmButtonColor: '#FF4B2B',
                text: "Las contraseñas no coinciden",
            });
        } else if (response.status === 200) {
            Swal.fire({
                icon: 'success',
                title: 'Constraseña Cambiada',
                confirmButtonColor: '#FF4B2B',
                text: "La contraseña fue cambiada con éxito. Será redirigido a la página de login",
            }).then(() => {
                window.location.replace("/login");
              });  
        }
    });

});