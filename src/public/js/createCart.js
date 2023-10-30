document.addEventListener("DOMContentLoaded", function () {
    const createCartButton = document.getElementById("createCart");
  
    createCartButton.addEventListener("click", async function () {
      try {
        const response = await fetch(`/api/carts/createCart`, {
          method: "POST",
        });
  
        if (response.ok) {
          alert("Carrito creado con éxito.");
        } else {
          alert("Error al crear el carrito.");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error al crear el carrito.");
      }
    });
  });
  