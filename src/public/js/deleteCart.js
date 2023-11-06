document.addEventListener("DOMContentLoaded", ()=> {
   const btnEmpty = document.getElementById("empty");
   const headerEmpty = document.getElementById("headerEmpty");

    const isEmpty = headerEmpty.getAttribute("empty").valueOf();
    console.log(isEmpty)

    if (isEmpty === "true") {
        headerEmpty.style.visibility = "visible";
    }

    btnEmpty.addEventListener("click", async ()=> {
        const idCart = btnEmpty.getAttribute("idCart").valueOf();

        const response = await fetch(`/api/carts/${idCart}/delete`, {
            method: 'DELETE',
        });

        if (response.status === 204) {
            Swal.fire({
                icon: 'success',
                title: 'Carrito Vacio',
                confirmButtonColor: '#FF4B2B',
                text: "Todos los productos del carrito han sido eliminados.",
            }).then(()=> {
                window.location.reload();
            });
        } else if (response.status === 200) {
            Swal.fire({
                icon: 'error',
                title: 'Carrito Vacio',
                confirmButtonColor: '#FF4B2B',
                text: "No hay ningún producto en el carrito.",
            });
        }
    });
});