document.querySelector(".ticket__title").textContent =
  localStorage.getItem("filmName")
document.querySelector(".ticket__hall").textContent =
  localStorage.getItem("hallName")[3]
document.querySelector(".ticket__start").textContent =
  localStorage.getItem("seanceStart")
document.querySelector(".ticket__chairs").textContent =
  localStorage.getItem("selectedPlaces")

let qrCode = window.QRCreator(
  `Ряд/Место: ${localStorage.getItem("selectedPlaces")}, 
Зал: ${localStorage.getItem("hallName")}, 
Фильм: ${localStorage.getItem("filmName")}, ${localStorage.getItem(
    "seanceStart"
  )}, ${localStorage.getItem("seanceDate")}`,
  {image: "html"}
)

document.querySelector(".ticket__info-qrCode").append(qrCode.result)
document.querySelector(".qrcode").classList.add("ticket__info-qr")
