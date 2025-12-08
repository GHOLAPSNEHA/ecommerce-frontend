const API_URL = "https://fakestoreapi.com/products/";

const productId = new URLSearchParams(window.location.search).get("id");
const detailContainer = document.getElementById("productDetail");

async function fetchProductDetails() {
  try {
    const res = await fetch(API_URL + productId);
    const product = await res.json();
    renderProduct(product);
  } catch (error) {
    detailContainer.innerHTML = "<p>Error loading product.</p>";
  }
}

fetchProductDetails();
