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
    document.querySelector('a[href="/api/users/passReset"]').addEventListener('click', function (e) {
        e.preventDefault();
        const signInContainer = document.querySelector('.sign-in-container');
        const resetPasswordContainer = document.querySelector('.reset-password-container');
        signInContainer.style.display = 'none';
        resetPasswordContainer.style.display = 'block';
      });      

      const resetPasswordForm = document.getElementById('reset-password-form');

      resetPasswordForm.addEventListener('submit', async (event) => {
          event.preventDefault();

          const formData = new FormData(resetPasswordForm);
          const formDataJSON = {};
          formData.forEach((value, key) => {
              formDataJSON[key] = value;
          });
  
          const response = await fetch('/api/users/passReset', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(formDataJSON),
          });
  
          const responseData = await response.json();
  
          if (responseData.status === 'success') {
              window.location.replace('/');
          } else {
              Swal.fire({
                  icon: 'error',
                  title: 'Error al enviar el correo de recuperación',
                  confirmButtonColor: '#FF4B2B',
                  text: 'Hubo un problema al enviar el correo de recuperación. Inténtalo nuevamente.',
              });
          }
      });
});

