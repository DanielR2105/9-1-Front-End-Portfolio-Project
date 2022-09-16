const url = `https://www.googleapis.com/books/v1/volumes?q=`
const main = document.querySelector("main")
const bookDetails = document.querySelector("#book_details")
const tempP = document.querySelector("#view_book")
const searchForm = document.querySelector("#search_bar")

function renderSearch(results) {
    const bookTitle = document.createElement("h2")
    const author = document.createElement("h3")
    const snippet = document.createElement("p")
    const bookDescription = document.createElement("p")
    const showMore = document.createElement("p")
    const publishedDate = document.createElement("p")
    const purchaseLink = document.createElement("a")
    const bookImage = document.createElement("img")
    const primaryBook = document.createElement("section")

    if (!results.items[0].volumeInfo.imageLinks) {
        bookImage.src = "https://cdn.pixabay.com/photo/2014/04/02/14/06/book-306178__340.png"      
    } else {
        bookImage.src = results.items[0].volumeInfo.imageLinks.thumbnail
    }
    bookImage.alt = "Thumbnail"

    author.innerHTML = `Written by ${results.items[0].volumeInfo.authors}`
    bookTitle.innerHTML = results.items[0].volumeInfo.title
    publishedDate.innerHTML = `Published on ${results.items[0].volumeInfo.publishedDate}`
    if (!results.items[0].searchInfo) {
        snippet.innerHTML = "No book snippet available"
    } else {
    snippet.innerHTML = results.items[0].searchInfo.textSnippet
    }
    if (!results.items[0].volumeInfo.description){
        bookDescription.innerHTML = "No book description available"
    } else {
    bookDescription.innerHTML = results.items[0].volumeInfo.description
    }
    bookDescription.style.display = "none"
    showMore.innerHTML = "Show description"

    showMore.addEventListener("click", (event) => {
        event.preventDefault()
        if (bookDescription.style.display === "none") {
            bookDescription.style.display = "block"
            snippet.style.display = "none"
            showMore.innerHTML = "Hide description"
        } else {
            bookDescription.style.display = "none"
            snippet.style.display = "block"
            showMore.innerHTML = "Show description"
        }
    })

    if (results.items[0].saleInfo.saleability === "FOR_SALE") {
    purchaseLink.innerHTML = "Click to Purchase"
    purchaseLink.href = results.items[0].saleInfo.buyLink
    purchaseLink.target ="_blank"
    purchaseLink.rel = "noopener noreferrer"
} else {
    purchaseLink.style.visibility = "hidden"
}

    primaryBook.append(
        bookTitle,
        bookImage,
        author,
        publishedDate,
        snippet,
        bookDescription,
        showMore,
        purchaseLink,
        renderSimilarBooks(results.items)
    )
    return primaryBook
}

function errorHandling() {
   const parentDiv = document.createElement("div")
   parentDiv.id = "wrapper"
   const boxDiv = document.createElement("div")
   boxDiv.id = "box"
   const boxHeading = document.createElement("h5")
   boxHeading.innerHTML = "Please type something into the search bar"
   boxDiv.append(boxHeading)
   parentDiv.append(boxDiv)
   return parentDiv
}

function renderSimilarBook(book) {
    const similarBookImage = document.createElement("img")
    const similarBookTitle = document.createElement("h4")
    const similarDiv = document.createElement("div")
    const similarBookAuthor = document.createElement("h5")

    similarBookTitle.innerHTML = book.volumeInfo.title
    similarBookTitle.id = "similar_titles"
    if (!book.volumeInfo.imageLinks) {
        similarBookImage.src = "https://cdn.pixabay.com/photo/2014/04/02/14/06/book-306178__340.png"      
    } else {
        similarBookImage.src = book.volumeInfo.imageLinks.thumbnail
    }
    
    similarBookImage.alt = "Thumbnail"
    similarBookImage.id = "similar_images"

    similarBookTitle.addEventListener("click", (event) => {
        event.preventDefault()
        clearPage()
        makeFetchCall(event.target.innerHTML)
    })

    similarBookAuthor.innerHTML = book.volumeInfo.authors
    similarBookAuthor.addEventListener("click", (event) => {
        event.preventDefault()
        clearPage()
        makeFetchCall(event.target.innerHTML)
    })

    similarDiv.append(
        similarBookTitle,
        similarBookImage,
        similarBookAuthor
    )
    return similarDiv
}

function renderSimilarBooks(books) {
    const similarSection = document.createElement("section")
    for (let i = 1; i < books.length; i++) {
        similarSection.append(renderSimilarBook(books[i]))
    }
    return similarSection
}

function clearPage() {
    while(bookDetails.children.length > 0) {
        bookDetails.children[0].remove()
    }
}

function makeFetchCall(search) {
    fetch(`${url}${search}`)
    .then((res) => res.json())
    .then((res) => {
        bookDetails.append(renderSearch(res))
    })
}

searchForm.addEventListener("submit", (event) => {
    event.preventDefault()
    clearPage()
    const searchQuery = document.querySelector("#search").value
    if (searchQuery === "") {
        bookDetails.append(errorHandling())
    } else {
    makeFetchCall(searchQuery)
    searchForm.reset()
    }
})

makeFetchCall("Gardens of the Moon")