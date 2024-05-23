document.addEventListener("DOMContentLoaded", function () {
  // Load navbar content
  fetch("navbar.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("navbar").innerHTML = data;

      // Get the current page URL
      const currentPage = window.location.pathname;

      // Set the active class based on the current page
      if (currentPage.includes("index.html")) {
        document.getElementById("home-link").classList.add("active");
      } else if (currentPage.includes("about.html")) {
        document.getElementById("about-link").classList.add("active");
      }

      // Set the "Cans" link as active
      if (currentPage.includes("models.html")) {
        document.getElementById("navbardrop").classList.add("active");
      }
      // Add similar conditions for other pages if needed
    });

  // Load footer content
  fetch("footer.html")
    .then((response) => response.text())
    .then((data) => (document.getElementById("footer").innerHTML = data));
});
