document.addEventListener('DOMContentLoaded', () => {

  const btnAddToCart = document.querySelectorAll('.addToCart');
  btnAddToCart.forEach(button => {
    button.addEventListener('click', async (event) => {
      
      const cartId = button.getAttribute('userCart').valueOf();
      console.log(cartId);
      const productId = event.target.id;   

      try {
        const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
          method: 'POST',
        });
        
        if (response.ok) {
          alert('Producto agregado al carrito con éxito');
        } else if( response.status === 403) {
          alert("Error de permisos: no posee permisos para agregar productos al carrito");
        } else if ( response.status === 400) {
          alert(" ERROR: No puede agregar al carrito sus propios productos");
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
