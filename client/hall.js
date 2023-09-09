import fetchRequest from "./fetchRequest.js"

document.querySelector(".buying__info-title").textContent =
  localStorage.getItem("filmName")
document
  .querySelector(".buying__info-start")
  .insertAdjacentText("beforeend", localStorage.getItem("seanceStart"))
document.querySelector(".buying__info-hall").textContent =
  localStorage.getItem("hallName")
document.querySelector(".price-standart").textContent =
  localStorage.getItem("hallPriceStandart")
document.querySelector(".price-vip").textContent =
  localStorage.getItem("hallPriceVip")

const priceStandart = Number(localStorage.getItem("hallPriceStandart"))
const priceVip = Number(localStorage.getItem("hallPriceVip"))
let rowsObject = {}
let hallConfiguration = ""

let config = fetchRequest(
  `event=get_hallConfig&timestamp=${localStorage.getItem(
    "timestamp"
  )}&hallId=${localStorage.getItem("hallId")}&seanceId=${localStorage.getItem(
    "seanceId"
  )}`
).then((data) => {
  if (data == null) {
    document.querySelector(".conf-step").insertAdjacentHTML(
      "afterbegin",
      `<div class="conf-step__wrapper"> 
    ${localStorage.getItem("hallConfig")}
  </div>
  `
    )
  } else {
    document.querySelector(".conf-step").insertAdjacentHTML("afterbegin", data)
  }

  Array.from(
    document
      .querySelector(".conf-step__wrapper")
      .querySelectorAll(".conf-step__chair")
  ).forEach((element) => {
    if (element.classList.contains("conf-step__chair_taken")) {
      element.style.cursor = "default"
    }

    element.onclick = function () {
      if (element.classList.contains("conf-step__chair_taken")) {
        return false
      }

      if (element.classList.contains("conf-step__chair_selected")) {
        element.classList.remove("conf-step__chair_selected")
      } else {
        element.classList.add("conf-step__chair_selected")
      }
    }
  })
})

document.querySelector(".acceptin-button").addEventListener("click", () => {
  localStorage.selectedPlaces = getRowChair().join(", ")
  fetchRequest(
    `event=sale_add&timestamp=${localStorage.getItem(
      "timestamp"
    )}}&hallId=${localStorage.getItem(
      "hallId"
    )}&seanceId=${localStorage.getItem(
      "seanceId"
    )}&hallConfiguration=${hallConfiguration}`
  )
})

function getRowChair() {
  const rows = Array.from(document.querySelectorAll(".conf-step__row"))

  for (let i = 1; i < rows.length + 1; i++) {
    rowsObject[i] = Array.from(
      rows[i - 1].querySelectorAll(".conf-step__chair")
    )
  }

  for (let row in rowsObject) {
    rowsObject[row] = rowsObject[row].filter(
      (element) => !element.classList.contains("conf-step__chair_disabled")
    )
  }

  let selectedPlaces = []
  let cost = 0

  for (let row in rowsObject) {
    rowsObject[row].forEach((element) => {
      if (element.classList.contains("conf-step__chair_selected")) {
        selectedPlaces.push(`${row}/${rowsObject[row].indexOf(element) + 1}`)
        if (element.classList.contains("conf-step__chair_standart")) {
          cost += priceStandart
        }

        if (element.classList.contains("conf-step__chair_vip")) {
          cost += priceVip
        }
        element.classList.remove("conf-step__chair_selected")
        element.classList.add("conf-step__chair_taken")
      }
    })
  }

  localStorage.totalCost = cost
  hallConfiguration = document
    .querySelector(".conf-step__wrapper")
    .cloneNode(true).outerHTML
  return selectedPlaces
}
