
let store = {
    user: { name: "Student" },
    apod: '',
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
    roverInfo: [],
}

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}


// create content
const App = (state) => {
    let { rovers, apod } = state
    
    return `
        <header> <h3>Rover Images</h3>
        
        </header>
            <section class="container flexdiv">
                <div id="imgDiv">
                    ${getRoverImages(rovers)}
                </div>
            </section>
        <footer></footer>
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
    
})

// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = (name) => {
    if (name) {
        return `
            <h1>Welcome, ${name}!</h1>
        `
    }

    return `
        <h1>Hello!</h1>
    `
}

// Example of a pure function that renders infomation requested from the backend

const getRoverImages = (rovers) => {
    //const currentRover = store.roverInfo.photos[0].rover.name;
    //|| (currentRover != rover)
    if(store.roverInfo.length <= 0 )
        getRoverInfo(store, store.rovers[0]);
    
    
    const resultString = store.roverInfo.photos;
    if (resultString === undefined || store.roverInfo.length < 0){
            return(`
            <p> Loading... </p>
        `)}
    else{

        const roverPhotos = resultString.map(roverPhoto => {  
            return(`
                <li><img src="${roverPhoto.img_src}" class="gallaryImageCss"/><br>
                <div class="infodiv">
                <span>Landing Date : ${roverPhoto.rover.landing_date}</span><br>
                <span>Launch_Date :${roverPhoto.rover.launch_date}</span><br>
                <span>Status :${roverPhoto.rover.status}</span>
                </div></li>
            `)            
        });

        
       return (`
        <ul>${roverPhotos.join('')}</ul>`);
    }// ${roverPhotos}
   
}



// ------------------------------------------------------  API CALLS

// Example API call
// const getImageOfTheDay = (state) => {
//     let { apod } = state

//     fetch(`http://localhost:3000/apod`)
//         .then(res => res.json())
//         .then(apod => updateStore(store, { apod }))
    
//     //return data
// }

const getRoverInfo = (store,rover) => {
    
    const fetchUrl = `http://localhost:3000/roverinfo/${rover}`;
    fetch(fetchUrl)
        .then(res => res.json())
        .then(roverInfo => roverInfo.imageRover)
        .then(roverInfo => updateStore(store, { roverInfo }))
}