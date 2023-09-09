export default async function fetchRequest(bodyRequest) {
  const response = await fetch("https://jscp-diplom.netoserver.ru/", {
    method: "POST",
    body: bodyRequest,
    headers: {
      "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
  })

  return await response.json()
}
