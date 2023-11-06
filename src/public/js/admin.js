document.addEventListener('DOMContentLoaded', () => {
    const userList = document.querySelector("ul");
    
    userList.addEventListener("click", async (event) => {
        const target = event.target;

        if (target.tagName === "BUTTON") {
            const userId = target.getAttribute("userId");

            if (target.id === "delete") {
                const response = await fetch(`/api/users/${userId}`, {
                    method: 'DELETE',
                });
        
                if (response.status === 201) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Usuario Eliminado',
                        confirmButtonColor: '#FF4B2B',
                        text: 'El usuario fue eliminado correctamente.',
                    }).then(() => {
                        location.reload();
                    })
                }
            } else if (target.id === "changeRol") {
                const response = await fetch(`/api/users/premium/${userId}`, {
                    method: 'PUT',
                });
                if (response.status === 200) {
                    const responseData = await response.json();
                    Swal.fire({
                        icon: 'success',
                        title: 'Rol Modificado',
                        confirmButtonColor: '#FF4B2B',
                        text: responseData.message,
                    }).then(() => {
                        location.reload();
                    })
                } else if (response.status === 404) {
                    const responseData = await response.json();
                    Swal.fire({
                        icon: 'error',
                        title: 'No Se Puede Modificar el Rol',
                        confirmButtonColor: '#FF4B2B',
                        text: responseData.message,
                    });
                }

            }
        }
    });
});
