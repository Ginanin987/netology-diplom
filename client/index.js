import fetchRequest from "./fetchRequest.js"

const dayWeek = Array.from(document.querySelectorAll(".page-nav__day-week"))
const dayNumber = Array.from(document.querySelectorAll(".page-nav__day-number"))
const nav = Array.from(document.querySelectorAll(".page-nav__day"))
let date = new Date()
let dateTimestamp = date.setHours(0, 0, 0, 0)
let dateDayWeek = date.getDay()
let dateNumber = date.getDate()
let dayOfweek = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"]

function currentDayOfWeek(array) {
  for (let i = 0; i < array.length; i++) {
    array[i].textContent = dayOfweek[dateDayWeek]

    if (dateDayWeek == 0 || dateDayWeek == 6) {
      array[i].closest("a").classList.add("page-nav__day_weekend")
    } else {
      array[i].closest("a").classList.remove("page-nav__day_weekend")
    }

    dateDayWeek++

    if (dateDayWeek == 7) {
      dateDayWeek = 0
    }
  }
}

function currentDayNumber(array) {
  let itterationDate = date
  for (let i = 0; i < array.length; i++) {
    array[i].textContent = itterationDate.getDate()
    let nextDate = new Date(itterationDate)
    itterationDate.setDate(nextDate.getDate() + 1)
  }
  date = new Date()
}

currentDayOfWeek(dayWeek)
currentDayNumber(dayNumber)

nav.forEach(
  (element) =>
    (element.onclick = function () {
      nav.forEach((element) => element.classList.remove("page-nav__day_chosen"))

      element.classList.add("page-nav__day_chosen")

      if (element.classList.contains("page-nav__day_today")) {
        date = new Date()
        activeSeance(date)

        dateTimestamp = date.setHours(0, 0, 0, 0)
      } else {
        date.setDate(element.querySelector(".page-nav__day-number").textContent)
        dateTimestamp = date.setHours(0, 0, 0, 0)
        activeSeance(date)
      }
    })
)

let list = fetchRequest("event=update").then((data) => {
  for (let film in data.films.result) {
    document.querySelector("main").innerHTML += `
  <section class="movie" id="film_${data.films.result[film].film_id}">
        <div class="movie__info">
          <div class="movie__poster">
            <img
              class="movie__poster-image"
              alt="${data.films.result[film].film_name} постер"
              src="${data.films.result[film].film_poster}"
            />
          </div>
          <div class="movie__description">
            <h2 class="movie__title"
              >${data.films.result[film].film_name}</h2
            >
            <p class="movie__synopsis"
              >${data.films.result[film].film_description}</p
            >
            <p class="movie__data">
              <span class="movie__data-duration">${data.films.result[film].film_duration}</span>
              <span class="movie__data-origin">${data.films.result[film].film_origin}</span>
            </p>
          </div>
        </div>

      </section>

  `
  }

  for (let seance in data.seances.result) {
    let film = document.getElementById(
      `film_${data.seances.result[seance].seance_filmid}`
    )
    let hall = document.getElementById(
      `hall_${data.seances.result[seance].seance_hallid}`
    )
    let hallObject = data.halls.result.find(
      (hall) => hall.hall_id == data.seances.result[seance].seance_hallid
    )

    if (hallObject.hall_open == 0) {
      continue
    }

    if (
      film.querySelector(`#hall_${hallObject.hall_id}`) &&
      hallObject.hall_open == 1
    ) {
      hall.querySelector("ul").insertAdjacentHTML(
        "beforeend",
        `<li class="movie-seances__time-block">
        <a class="movie-seances__time" href="hall.html" data-hallId=${
          hallObject.hall_id
        } data-seanceId=${data.seances.result[seance].seance_id} 
           data-seancestart=${data.seances.result[seance].seance_time} 
        data-hallname=${hallObject.hall_name}
        data-filmname='${
          data.films.result.find(
            (film) =>
              film.film_id == [data.seances.result[seance].seance_filmid]
          ).film_name
        }' data-hallconfig='${hallObject.hall_config}'
        data-hallpricestandart=${hallObject.hall_price_standart}
        data-hallpricevip=${hallObject.hall_price_vip}
        data-seancestartminutes="${data.seances.result[seance].seance_start}"
        
        >${data.seances.result[seance].seance_time}</a>
    </li>`
      )

      activeSeance(date)
      setLocalStorageItems()
    } else {
      document.getElementById(
        `film_${data.seances.result[seance].seance_filmid}`
      ).innerHTML += `
            <div class="movie-seances__hall" id=hall_${hallObject.hall_id}>
                <h3 class="movie-seances__hall-title" >${
                  hallObject.hall_name
                }</h3>
                <ul class="movie-seances__list">
                    <li class="movie-seances__time-block">
                        <a class="movie-seances__time" 
                        href="hall.html" data-hallid=${
                          hallObject.hall_id
                        } data-hallconfig='${hallObject.hall_config}'
                        data-hallpricestandart=${hallObject.hall_price_standart}
                        data-hallpricevip=${hallObject.hall_price_vip}
                        data-seanceid=${data.seances.result[seance].seance_id} 
                         data-seancestart=${
                           data.seances.result[seance].seance_time
                         } data-hallname=${hallObject.hall_name} 
      data-filmname='${
        data.films.result.find(
          (film) => film.film_id == [data.seances.result[seance].seance_filmid]
        ).film_name
      }'
      data-seancestartminutes="${data.seances.result[seance].seance_start}">
                        ${data.seances.result[seance].seance_time}</a>
                    </li>
                </ul>
            </div>
        `

      activeSeance(date)
      setLocalStorageItems()
    }
  }
})

function activeSeance(time) {
  let timeNow = time.getHours() * 60 + time.getMinutes()
  Array.from(document.querySelectorAll(".movie-seances__time")).forEach(
    (element) => {
      if (element.dataset.seancestartminutes < timeNow) {
        element.style.backgroundColor = "grey"
        element.style.pointerEvents = "none"
      } else {
        element.style.backgroundColor = "white"
        element.style.pointerEvents = "auto"
      }
    }
  )
}

function setLocalStorageItems() {
  Array.from(document.querySelectorAll(".movie-seances__time")).forEach(
    (element) => {
      element.onclick = function () {
        let timestamp =
          Math.trunc(dateTimestamp / 1000) +
          Number(element.dataset.seancestartminutes) * 60

        let seanceDate =
          date.getFullYear() +
          "-" +
          (date.getMonth() + 1) +
          "-" +
          date.getDate()

        localStorage.timestamp = timestamp
        localStorage.hallId = element.dataset.hallid
        localStorage.seanceId = element.dataset.seanceid
        localStorage.seanceStart = element.dataset.seancestart
        localStorage.filmName = element.dataset.filmname
        localStorage.hallName = element.dataset.hallname
        localStorage.hallConfig = element.dataset.hallconfig
        localStorage.hallPriceStandart = element.dataset.hallpricestandart
        localStorage.hallPriceVip = element.dataset.hallpricevip
        localStorage.seanceDate = seanceDate
      }
    }
  )
}

// async function getList() {
//   const response = await fetch("https://jscp-diplom.netoserver.ru/", {
//     method: "POST",
//     body: "event=update",
//     headers: {
//       "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
//     },
//   })
//   return await response.json()
// }
