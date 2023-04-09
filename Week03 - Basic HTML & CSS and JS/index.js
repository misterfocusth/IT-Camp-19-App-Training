import { dummyData } from "./dummyData.js";

// HTML Elements
const searchBar = document.getElementById("searchBar");
const searchButton = document.getElementById("searchButton")
const searchResultFor = document.getElementById("searchResultFor")
const menuCardContainer = document.getElementById("menuCardContainer");

// Selected Menu - HTML Elements
const noSelectedMenuLabel = document.getElementById("noSelectedMenuLabel");
const selectedMenuContainer = document.getElementById("selectedMenuContainer")
const totalPriceLabel = document.getElementById("totalPriceLabel");
const clearSelectedMenuButton = document.getElementById("clearSelectedMenuButton");

// Selected Items
let currentIds = [];
let elementPricePairs = {}
let searchValue = ""
let totalPrice = 0

// Event Listener
searchBar.addEventListener("keyup", (event) => {
    searchValue = event.currentTarget.value
    handleOnSearchValueChange()
})

searchButton.addEventListener("click", (event) => {
    event.preventDefault()
    handleOnSearchValueChange()
})

clearSelectedMenuButton.addEventListener("click", () => {
    currentIds = []
    elementPricePairs = {}
    searchValue = ""
    selectedMenuContainer.innerHTML = ""
    calculateTotalPrice()
    checkIsSelectedMenuEmpty()
})

const handleCollapseMenuCard = (event) => {
    const element = document.getElementById(event.currentTarget.id)
    const children = element.children

    if (children[1].classList.contains("hidden")) {
        children[1].classList.remove("hidden")
    } else {
        children[1].classList.add("hidden")
    }
}

const handleAddSelectedMenu = (event) => {
    const parentMenuId = (event.currentTarget.id).replace("btn", "")
    const parentMenu = document.getElementById(parentMenuId)
    const parentMenuName = parentMenu.children[1].children[0].children[0].textContent
    const menu = dummyData.filter((data) => data.name.includes(parentMenuName))[0]
    handleSelectedMenuChange(menu.name, menu.price, "add")

}

const handleOnSearchValueChange = () => {
    menuCardContainer.innerHTML = ""
    if (searchValue) {
        const filteredData = dummyData.filter(data => data.name.includes(searchValue))
        filteredData.forEach(data => (
            addMenuCardItem(data.name, data.price, data.image_url)
        ))
        searchResultFor.innerHTML = `ผลการค้นหาสำหรับ : ${searchValue} (${filteredData.length} รายการ)`
        searchResultFor.classList.remove("hidden")
    } else {
        searchResultFor.classList.add("hidden")
        dummyData.forEach(data => (
            addMenuCardItem(data.name, data.price, data.image_url)
        ))
    }
}

const randomItemId = () => {
    let result = Math.floor(Math.random() * 10000);
    while (currentIds.filter(item => item.id == result).length != 0) {
        result = Math.floor(Math.random() * 10000);
    }
    return result
}

const addMenuCardItem = (name, price, image_url) => {
    const id = randomItemId()
    const newMenuCardItem =
        (`<div id="${id}" class="rounded-xl mb-4">` +
            `<img src="${image_url}" alt="menu image" width="300" height="250" class="rounded-t-lg w-full">` +
            `<div id="menuCardContent" class="hidden block bg-orange-200 rounded-b-lg p-4">` +
            `<p>ชื่อเมนู : <span class="font-bold">${name}</span></p>` +
            `<p class="mt-2">ราคา : <span class="font-bold">${price}</span> ราคา</p>` +
            `<div class="mt-4">` +
            `<button id="${"btn" + id}" class="p-2 border bg-white rounded-xl w-full active:bg-gray-100 hover:bg-gray-100 font-bold">+ เพิ่มรายการอาหาร</button>` +
            `</div>` +
            `</div>` +
            `</div>`)
    menuCardContainer.insertAdjacentHTML("beforeend", newMenuCardItem)

    document.getElementById(id).addEventListener("click", (event) => {
        handleCollapseMenuCard(event)
    })
    document.getElementById("btn" + id).addEventListener("click", (event) => {
        handleAddSelectedMenu(event)
    })
}

const handleSelectedMenuChange = (name = "", price = 0, action, event = null) => {
    const id = randomItemId()
    if (action == "add") {
        elementPricePairs[id] = price
        const newSelectedMenu =
            (
                `<div id="${id}" class="grid grid-row-3 grid-flow-col gap-8 rounded-xl border p-4 mb-4">` +
                `<div class="col-span-2 text-start">` +
                `<p>${name}</p>` +
                `<p class="mt-2">ราคา : ${price} บาท</p>` +
                `</div>` +
                `<div class="flex align-center items-center">` +
                `<button id="${"btn" + id}" class="bg-red-500 font-bold text-white border rounded-xl px-4 py-2">- ลบ</button>` +
                `</div>`
            )
        selectedMenuContainer.insertAdjacentHTML("beforeend", newSelectedMenu)
        document.getElementById("btn" + id).addEventListener("click", (event) => {
            handleSelectedMenuChange("", 0, "remove", event)
        })
    } else {
        const elementId = (event.currentTarget.id).replace("btn", "")
        const element = document.getElementById(elementId)
        element.remove()
        delete elementPricePairs[elementId]
    }
    calculateTotalPrice()
    checkIsSelectedMenuEmpty()
}

const calculateTotalPrice = () => {
    totalPrice = 0
    for (let key in elementPricePairs) {
        totalPrice += elementPricePairs[key]
    }
    totalPriceLabel.innerHTML = totalPrice
}

const checkIsSelectedMenuEmpty = () => {
    if (totalPrice > 0) {
        noSelectedMenuLabel.classList.add("hidden")
    } else {
        noSelectedMenuLabel.classList.remove("hidden")
    }
}

dummyData.forEach(data => (
    addMenuCardItem(data.name, data.price, data.image_url)
))