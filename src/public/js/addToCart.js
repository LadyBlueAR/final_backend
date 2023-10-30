  document.addEventListener('DOMContentLoaded', () => {

    const btnAddToCart = document.querySelectorAll('.addToCart');
    btnAddToCart.forEach(button => {
      button.addEventListener('click', async (event) => {
        
        const cartId = button.getAttribute('userCart').valueOf;
        const productId = event.target.id;   

        try {
          const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
            method: 'POST',
          });
          
          if (response.ok) {
            alert('Producto agregado al carrito con éxito');
          } else {
            console.error('Error al agregar el producto al carrito');
          }
        } catch (error) {
          console.error('Error al realizar la solicitud:', error);
        }
      });
    });
  });


