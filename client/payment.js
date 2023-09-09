document.querySelector(".ticket__title").textContent =
  localStorage.getItem("filmName")
document.querySelector(".ticket__hall").textContent =
  localStorage.getItem("hallName")[3]
document.querySelector(".ticket__start").textContent =
  localStorage.getItem("seanceStart")
document.querySelector(".ticket__chairs").textContent =
  localStorage.getItem("selectedPlaces")
document.querySelector(".ticket__cost").textContent =
  localStorage.getItem("totalCost")
