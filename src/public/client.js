
let store = {
    user: { name: "Student" },
    apod: '',
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
    roverInfo: [],
}

// add our markup to the pages
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
        <header> <h3>MARS ROVER PHOTOS</h3>
        
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
    if(store.roverInfo.length <= 0 )
        getRoverInfo(store, store.rovers[0]);
    console.log(store.roverInfo.name);


    const resultString = store.roverInfo.photos;
    if (resultString === undefined || store.roverInfo.length < 0){
            return(`
            <p> Loading... </p>
        `)}
    else{

        const roverPhotos = resultString.map(roverPhoto => {  
            return(`
                <div class="col-xl-3 col-lg-4 col-md-6 mb-4">
                    <div class="bg-white rounded shadow-sm">
                        <img src="${roverPhoto.img_src}" class="img-fluid card-img-top"/><br>
                        <div class="infodiv p-4">
                            <span>Landing Date - ${roverPhoto.rover.landing_date}</span><br>
                            <span>Launch_Date - ${roverPhoto.rover.launch_date}</span><br>
                            <span>Status - ${roverPhoto.rover.status}</span>
                        </div>
                    </div>
                </div>
            `)            
        });

    
        return (`
        <div class="row">${roverPhotos.join('')}</div>`)
    }
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
        .then(roverInfo=> roverInfo.imageRover)
        .then(roverInfo=> updateStore(store, { roverInfo }));
}

