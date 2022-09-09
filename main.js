const url = `https://www.googleapis.com/books/v1/volumes?q=Gardens-of-the-moon`


fetch(url) 
.then((res) => res.json())
.then((resJson) => console.log(resJson))
.catch((err) => console.log(err))
