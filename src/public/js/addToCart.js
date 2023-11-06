document.addEventListener('DOMContentLoaded', () => {

  const btnAddToCart = document.querySelectorAll('.addToCart');
  btnAddToCart.forEach(button => {
    button.addEventListener('click', async (event) => {
      
      const productId = event.target.id;   

      try {
        const response = await fetch(`/api/carts/addToCart/${productId}`, {
          method: 'POST',
        });
        
        if (response.ok) {
          alert('Producto agregado al carrito con éxito');
        } else if( response.status === 403) {
          Swal.fire({
            icon: 'error',
            title: 'Error de permisos',
            confirmButtonColor: '#FF4B2B',
            text: 'El administrador no puede agregar productos al carrito.',
        });
        } else if ( response.status === 400) {
          Swal.fire({
            icon: 'error',
            title: 'Error de permisos',
            confirmButtonColor: '#FF4B2B',
            text: 'No puede agregar sus propios productos al carrito.',
        });
        }
        else {
          console.error('Error al agregar el producto al carrito');
        }
      } catch (error) {
        console.error('Error al realizar la solicitud:', error);
      }
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const btnAdmin = document.getElementById("btnAdmin");
  const btnDocuments = document.getElementById("btnDocuments");
  const btnCreate = document.getElementById("btnCreate");
  const btnCart = document.getElementById("cartButton");

  const rol = btnAdmin.getAttribute("rol").valueOf();

  if (rol === "admin") {
    btnAdmin.style.visibility = "visible";
    btnCreate.style.visibility = "visible";
    btnCart.style.display = "none";
  } else if (rol === "premium") {
    btnDocuments.style.visibility = "visible";
    btnCreate.style.visibility = "visible";
  } else if ( rol === "user") {
    btnDocuments.style.visibility = "visible";
  }

})