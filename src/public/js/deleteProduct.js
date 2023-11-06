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
            Swal.fire({
              icon: 'success',
              title: 'Producto Eliminado',
              confirmButtonColor: '#FF4B2B',
              text: "El producto se ha eliminado de la base de datos",
          }).then(() => {
            location.reload();
          });           
          } else if (response.status === 404) {
            Swal.fire({
              icon: 'error',
              title: 'Error de Permisos',
              confirmButtonColor: '#FF4B2B',
              text: "No posee permisos para eliminar este producto",
          });
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

