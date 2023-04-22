// Database imports
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js'
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js'

const appSettings = {
  databaseURL: import.meta.env.VITE_DB_URL,
}

// Database variables
const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListDB = ref(database, 'shoppingList')

// DOM element variables
const inputEl = document.getElementById('input')
const cartBtn = document.getElementById('cart-btn')
const listEl = document.querySelector('.container__list')

// Utility functions
const convertToUpperCase = (string) => string[0].toUpperCase() + string.slice(1, string.length)
const clearListEl = () => (listEl.innerHTML = '')
const addParagraphToList = (string) => {
  const paragraphEl = document.createElement('p')
  paragraphEl.textContent = string
  listEl.appendChild(paragraphEl)
}

// Main functions
const updateDB = (item) => {
  if (item) {
    addListItem(item)
    push(shoppingListDB, convertToUpperCase(item))
  }
}

const deleteListItem = (itemId) => {
  const itemLocationInDB = ref(database, `shoppingList/${itemId}`)
  remove(itemLocationInDB)
}

const addListItem = (item) => {
  const [itemID, itemValue] = item
  const listItemEl = document.createElement('li')
  listItemEl.textContent = convertToUpperCase(itemValue)
  listItemEl.addEventListener('dblclick', () => deleteListItem(itemID))
  listEl.appendChild(listItemEl)
}

onValue(shoppingListDB, (snapshot) => {
  if (snapshot.exists()) {
    const shoppingList = Object.entries(snapshot.val())
    clearListEl()
    addParagraphToList('Double Click to delete list item')
    shoppingList.forEach((item) => {
      addListItem(item)
    })
  } else {
    clearListEl()
    addParagraphToList('Shopping List is Empty')
  }
})

// Event listeners
cartBtn.addEventListener('click', (e) => {
  e.preventDefault()
  const item = inputEl.value
  updateDB(item)
  inputEl.value = ''
})
