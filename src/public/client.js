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
        <header></header>
        <main>
            ${Greeting(store.user.name)}

            <section>
                <h3>Rover Images</h3>
                <p>3 MARS Rovers</p>
                <p>
                    Ultimate images by NASA
                </p>
                ${RoverImages(rovers)}
            </section>

        </main>
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

const RoverImages = (rovers) => {
    console.log("in roverImages function");
    if(store.roverInfo.length <= 0 )
        getRoverInfo(store, store.rovers[0]);
    
    console.log(store);
    
    if (store.roverInfo.length < 0) {
        return(`
            <p> Images not found </p>
        `)}
    else{  
    const roverPhotos = store.roverInfo.map(roverPhoto => { 
        
        return(`
            <li><img src="${roverPhoto.img_src}" height="350px" width="100%" />
            <span>Landing Date : ${roverPhoto.rover.landing_date}</span>
            <span>Launch_Date :${roverPhoto.rover.launch_date}</span>
            <span>Status :${roverPhoto.rover.status}</span></li>
        `)
    });
       return (`
       <ul>${roverPhotos}</ul>`);
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

const getRoverInfo = (state, rover) => {
    
    const fetchUrl = `http://localhost:3000/roverinfo/${rover}`;
    console.log(fetchUrl);
    fetch(fetchUrl)
        .then(res => res.json())
        .then(roverInfo => roverInfo.imageRover.photos)
        .then(roverInfo => updateStore(store, { roverInfo })
        );
        //.then(roverInfo => updateStore(store, { roverInfo }))
    
    //return data
}