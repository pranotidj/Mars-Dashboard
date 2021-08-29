
//import { Map } from '../../../node_modules/immutable'; 
let store = Immutable.Map({
    user: Immutable.Map({ name: "Student" }),
    apod: '',
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
    roverInfo: [],
})

//List(['Curiosity', 'Opportunity', 'Spirit']),
// add our markup to the pages
const root = document.getElementById('root')
const rover = document.getElementById('rover');
const updateStore = (state, newState) => {
    
    store = state.merge(newState);
    
    render(root, store);
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}


// create content
const App = (state) => {
    let user = state.getIn(['user','name']);
    console.log(user);

    let rovers = state.getIn(['rovers'])
    console.log(rovers[0]);

    let apod = state.getIn(['apod']);
    
    //let { rovers, apod } = state
    
    //<button id="marsrover" onclick="${test()}" value="Curiosity">Curiosity</button>
         
    return `
        <header> <h3>MARS ROVER PHOTOS</h3>
            ${createNavBar(rovers)}
        </header>
            <section class="container flexdiv">
                <div id="imgDiv">
                ${ImageOfTheDay(apod)}
                </div>  
                <div id="rover" class="row"> </div>
            </section>
        <footer></footer>
    `
}
//${ImageOfTheDay(apod)}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
    
})

// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {
    let apodInfo = store.getIn(['apod']);
    let date = store.getIn(['apod','image','date']);
    
    // If image does not already exist, or it is not from today -- request it again
    
    const today = new Date();
    const photodate = new Date(apod.date);

    if (apodInfo.length === 0 || date === today.getDate() ) {
        getImageOfTheDay(store)
    }

    //check if the photo of the day is actually type video!
    if (store.getIn(['apod','image','media_type']) === "video") {
        return (`
            <p>See today's featured video <a href="${store.getIn(['apod','image','url'])}">here</a></p>
            <p>${store.getIn(['apod','image','title'])}</p>
            <p>${store.getIn(['apod','image','explanation'])}</p>
        `)
    } else {
        return (`
            <img src="${store.getIn(['apod','image','url'])}" height="350px" width="100%" />
            <p>${store.getIn(['apod','image','explanation'])}</p>
        `)
    }
}



const getRoverImages = (rover) => {
    console.log("in space");
    let roverInfoArray = store.getIn(['roverInfo']);
    if(roverInfoArray.length === 0){
        getRoverInfo(store, rover);
        return(`
            <p> Loading... </p>
        `)}
    else{
        let resultList = store.getIn(['roverInfo','photos']);
        console.log("in else");
        console.log(resultList.toJS());


        const roverPhotos = resultList.toJS().map(roverPhoto => {  
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
        
        
        document.getElementById('rover').innerHTML = roverPhotos.join('')
                // return (`
                // <div id="rover" class="row">${roverPhotos.join('')}</div>`)
       
        
    }
}

// ------------------------------------------------------  API CALLS

// Example API call
const getImageOfTheDay = (state) => {
    console.log("api call");
    let { apod } = state

    fetch(`/apod`)
        .then(res => res.json())
        .then(apod => updateStore(store, { apod }))
    
    //return data
}

const getRoverInfo = (store,rover) => {
    
    const fetchUrl = `http://localhost:3000/roverinfo/${rover}`;
    console.log(fetchUrl);
    fetch(fetchUrl)
        .then(res => res.json())
        .then(roverInfo=> roverInfo.imageRover)
        .then(roverInfo=> updateStore(store, { roverInfo }));
}

const createNavBar = (rovers) => {
    const navArray = rovers;
    const navBar = document.createElement('section');
    document.body.appendChild(navBar);
    const container = document.createElement('div');
    navBar.appendChild(container);

    return navArray.map (element => {
        return `
            <button id="${element}" class="roverButton" type="button" value="${element}" onclick="clickRoverButton(this)">${element}</button>
        `
        
        }).join(' ')
        
}

const clickRoverButton = (button) =>{

    console.log(button.id);
    getRoverImages(button.id);
    let ele = document.getElementById('rover');
    document.getElementById('imgDiv').style.display = 'none';
    if(ele.style.display === 'none')
        rover.style.display = 'block';
}


            
        