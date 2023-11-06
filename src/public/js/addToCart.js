document.addEventListener('DOMContentLoaded', () => {

  const btnAddToCart = document.querySelectorAll('.addToCart');
  btnAddToCart.forEach(button => {
    button.addEventListener('click', async (event) => {

      const productId = event.target.id;  
      const btnCart = document.getElementById("cartButton");
      const cid = btnCart.getAttribute('cid') ? btnCart.getAttribute('cid').valueOf() : null;

      try {
        const response = await fetch(`/api/carts/addToCart/${productId}`, {
          method: 'POST',
        });
        
        if (response.ok) {
          alert('Producto agregado al carrito con éxito');
          if (!cid) { window.location.reload();}
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

  const cid = btnCart.getAttribute("userCart").valueOf();
  const rol = btnAdmin.getAttribute("rol").valueOf();

  if (!cid) {
    btnCart.style.display = "none";
  }

  if (rol === "admin") {
    btnAdmin.style.display = "inline";
    btnCreate.style.display = "inline";
    btnCart.style.display = "none";
  } else if (rol === "premium") {
    btnDocuments.style.display = "inline";
    btnCreate.style.display = "inline";
  } else if ( rol === "user") {
    btnDocuments.style.display = "inline";
  }

})