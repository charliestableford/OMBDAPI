// GLOBAL VARIABLES
const searchUpdate = document.querySelector('.searchUpdate');
const searchBtn = document.querySelector('.searchBtn');
const nominationsUL = document.querySelector('.nomContainer');
const movieList = document.querySelector('.movieInfo');
const finished = document.querySelector('.banner');
const count = document.querySelector('.count');
const clear = document.querySelector('.clear');
const clearnNom = document.querySelector('.clearNom');
const smokeScreen = document.querySelector('.smokeScreen');
const arrow = document.querySelector('.arrow');
// const modal = document.querySelector('modal');

let nomArray = [];
// defining for local storage
let nomItem;
let counter = 0;

// API CREDENTIALS
const key = `406fb5b1`;
const title = `net`;
    
// INPUT SEARCH HANDLER
const searchInputHandler = (e) => {
    e.preventDefault();
    const inputSearch = searchUpdate.value;
    ApiHandler(inputSearch);
}

// INITAL API CALL
const ApiHandler = async (title) => {
    const response = await fetch(`https://www.omdbapi.com/?apikey=${key}&s=${title}`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        
        // if response true return search
        data.Response ? renderMovies(data.Search) : movieList.innerHTML = `<div class="noTitle">
        sorry we have nothing by that name!
        </div>`;
    })
}

// RENDER MOVIE RESULTS
const renderMovies = (results) => {
        movieList.innerHTML = results.map(movie =>
        `<ul class="info">
            <li><a href="#"><img src="${movie.Poster}" alt="${movie.Title} ${movie.Type} poster" onerror="this.src='https://via.placeholder.com/200x250/0e1920.png?text=Sorry+no+image';" class="poster"></a></li>
            <li class="details">${movie.Title} - ${movie.Year} <br><button class="nominate hov" value="${movie.imdbID}">Nominate</button></li>
         </ul>`
    ).join('');
}

// RENDER NOMINATIONS LIST
const renderNom = async(movieID) => {
    const response = await fetch(`https://www.omdbapi.com/?apikey=${key}&i=${movieID}`)
    .then(response => response.json())
    .then(data => {
        console.log(data.Response);
        data.Response ? nomArray.push(data) : console.log("fail");
        result = init();
        result.length >= 5 ? (finished.classList.add("show"), smokeScreen.classList.add("smokeScreen"), smokeScreen.classList.add("show")) : nomArray.length >= 0 ? (total = result.length, count.innerHTML = `<span class="icon" role="img" aria-label="trophy">🏆 ${total}</span>`) : console.log("less than zerp");

        nominationsUL.innerHTML = nomArray.map(nomSearch =>
            `<ul class="NomUL">
                <li class="nomLi"><span class="icon" role="img" aria-label="trophy">🏆 </span>${nomSearch.Title} - ${nomSearch.Year} / ${nomSearch.imdbRating} <button class="remove hov" value="${nomSearch.imdbID}">Remove</button></li>
            </ul>`
        ).join('');

    })
}

 // NOMINATE 
const nominate = (e) => {
    let movieID = e.target.getAttribute('value'); 

    e.target.classList.contains('nominate') ? (addToLocalstorage(movieID), e.target.disabled = true, e.target.classList.add('opacity'), renderNom(movieID)) : console.log('failed to nominate');

}

// REMOVE NOMINATION 
function removal(e){
    if(e.target.classList.contains('remove')){
        e.target.parentNode.classList.add('shift');
        let movieID = e.target.getAttribute('value'); 
        removeLocal(movieID);
         console.log(counter--);
        //  res = init();
        count.innerHTML = `<span class="icon" role="img" aria-label="trophy">🏆 ${result.length}</span>`;
        //disable button + opacity.
        e.target.disabled = true;
        e.target.classList.add('opacity');

        const index = nomArray.findIndex(nomArray => nomArray.imdbID === `${movieID}`);
        console.log(`this is ${index}`);
        nomArray.splice(index, 1);
    }
}

//LOCALSTORAGE
function checkLocalStorage() {
    let res;
    res = init();
    if (res.length === 0) {
        console.log('nothing stored');
    } else {
        
        if(res.length >= 5){
            finished.classList.add("show");
            smokeScreen.classList.add("smokeScreen");
            smokeScreen.classList.add("show");
            // trans.classList.add("trans");
            // clear.innerHTML = `You're back! Want to change your nominations?`
        }
        console.log(counter++);
        total = res.length;
        count.innerHTML =  `<span class="icon" role="img" aria-label="trophy">🏆 ${total}</span>`;
    }
}

// CLEAR LOCAL SO USER CAN NOMINATE AGAIN
function clearLocalStorage(){
    localStorage.clear('nomination');
    location.reload();
}

function init() {
    // if there is nothing in the storage, start new array
   if(localStorage.getItem('nominated') === null) {
    nomItem = [];
   } else {
    // use parse for json.parse to make it back into an array
    nomItem = JSON.parse(localStorage.getItem('nominated'));
       
}
return nomItem;
}

// REMOVING SINGLE FROM LOCAL
function removeLocal(movieID) {
    // nomItem = init();
    nomItem.forEach((movie, index) => {
        if (movie === movieID) {
            nomItem.splice(index, 1);
        }
    });
    localStorage.setItem('nominated', JSON.stringify(nomItem));
}

// ADDING SINGLE TO LOCAL
function addToLocalstorage(movieID) {
    nomItem = init();
    nomItem.push(movieID);
    // use json.stringify to save into local storage
    localStorage.setItem('nominated', JSON.stringify(nomItem));
}

Element.prototype.isOverflowing = function(){
    return this.scrollWidth > this.clientWidth;
   
}
 
document.addEventListener('DOMContentLoaded', checkLocalStorage);
document.addEventListener('DOMContentLoaded', ApiHandler(title));
window.addEventListener('click', removal);
window.addEventListener('click', nominate);
searchUpdate.addEventListener('keyup', searchInputHandler);
searchBtn.addEventListener('click', searchInputHandler);
clearnNom.addEventListener('click', clearLocalStorage);