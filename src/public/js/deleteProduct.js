document.addEventListener('DOMContentLoaded', () => {

    const btnAddToCart = document.querySelectorAll('.deleteProduct');
    btnAddToCart.forEach(button => {
      button.addEventListener('click', async (event) => {
        
        const productId = button.getAttribute('productId').valueOf();

        try {
          const response = await fetch(`/api/products/${productId}`, {
            method: 'DELETE',
          });
          
          if (response.ok) {
            alert('Producto eliminado con éxito');
            window.location.replace('/products');            
          } else if (response.status === 404) {
            alert("Error de permisos: No posee permisos para eliminar este producto");
          }
          else {
            console.error('Error al eliminar el producto');
          }
        } catch (error) {
          console.error('Error al realizar la solicitud:', error);
        }
      });
    });
  });

