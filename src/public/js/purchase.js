document.addEventListener("DOMContentLoaded", function () {
    
    const purchaseButton = document.getElementById("purchase");
  
    purchaseButton.addEventListener("click", async function () {
      try {

        const cartId = purchaseButton.getAttribute('userPurchaseCart').valueOf;
        
        const response = await fetch(`/api/carts/${cartId}/purchase`, {
          method: "POST",
        });
  
        if (response.ok) {
          alert("Compra Realizada Con éxito.");
        } else {
          alert("Error al finalizar la compra.");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error al comprar.");
      }
    });
  });
  