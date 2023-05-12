const fs = require('fs');
// npm i readline-sync
const rl = require('readline-sync');

// Beskrivning av projekt:
// Det finns grodor vi inte fångat, som vi vill ha
// En lista för grodor vi fångat
// Ibland vill vi befria dem - då ska de få komma ut i listan med grodor som vi inte fångat
// Vi ska kunna skicka in grodor som vi fångat i vår samling

// funktion för att hämta våra små grodor
function fetchFrogs(collection) {
    // läsa av filen med grodor
    let data = fs.readFileSync('frogs.json');
    if (collection == "wildFrogs") {
        data = JSON.parse(data)
        return data.wildFrogs;
    } else {
        data = JSON.parse(data)
        return data.myCollection;
    }
};

// det har uppdagats att en ny grodart finns i Amazonas
function addNewFrogSpecie() {
    let specie = rl.question("Name:" );
    let isCute = rl.question("Is it cute tho?\n[1] hell yeah\n[0] nah\n ");
    let poisonous = rl.question("Is it poisonous?\n[1] hell yeah\n[0] nah\n ")
    // vi vill få in ett objekt här (frog)
    let frog = {
        id: Math.floor(Math.random() * 100000),
        specie: specie,
        isCute: isCute == 1 ? true : false,
        poisonous: poisonous == 1 ? true : false
    };
    // få in listan med grodor för att sedan lägga in den nya arten
    let frogs = fetchFrogs("wildFrogs");
    // frog skall pushas in i frogs
    frogs.push(frog);

    // skapa om vår json
    let newJson = {
        myCollection: fetchFrogs("myCollection"),
        wildFrogs: frogs
    };
    fs.writeFileSync('frogs.json', JSON.stringify(newJson));
};

function addFrogToCollection() {
    // ge användaren prompts på datan som skall in
    let id = rl.question("Type in the frog ID: ");
    // hämta grodorna från wildFrogs och matcha med id:t
    let wildFrogs = fetchFrogs("wildFrogs");
    let myCollection;
    console.log(wildFrogs);
    let wildFrogId = wildFrogs.findIndex((wf) => wf.id === parseInt(id));
    if (wildFrogId > -1) {
        // hämta vår egen collection
        myCollection = fetchFrogs("myCollection");
        // pusha in grodan i collection
        myCollection.push(wildFrogs[wildFrogId]);
        wildFrogs.splice(wildFrogId, 1);
        // uppdatera vår json med de nya listorna
        let newJson = {
            myCollection: myCollection,
            wildFrogs: wildFrogs
        };
        fs.writeFileSync('frogs.json', JSON.stringify(newJson));
    } else {
        let newId = rl.question("Nu such ID could be found, please type in a new one: ");
    }
    // KLAR
    console.log('added frog to collection /n', myCollection);
};

function releaseFrog() {
    console.log('released frog from collection');
    // ge användaren prompts på vilken groda som skall släppas ut
    let frogId = rl.question("Type in the frog ID to release: ");
    // matcha id:t med de grodor som finns i min collection
    let myCollection = fetchFrogs("myCollection");
    let wildFrogs = fetchFrogs("wildFrogs");
    let frogIDInColl = myCollection.findIndex((mc) => mc.id === parseInt(frogId));
    // kolla om det finns en sådan groda
    if (frogIDInColl > -1) {
        // pusha in grodan i wildFrogs
        wildFrogs.push(myCollection[frogIDInColl]);
        // ta bort från min samling
        myCollection.splice(frogIDInColl, 1);
        let newJson = {
            myCollection: myCollection,
            wildFrogs: wildFrogs
        };
        fs.writeFileSync('frogs.json', JSON.stringify(newJson));
    }
    // KLAR
    
};
function seeMyCollection() {
    // stuff to do
    let myCollection = fetchFrogs("myCollection");
    console.log('here is your collection: ');
    console.log(myCollection);
};
function seeWildFrogs() {
    console.log('here are the wild frogs: ');
    let wildFrogs = fetchFrogs("wildFrogs");
    console.log(wildFrogs);
};

// när man startar applikationen skall en meny dyka upp
function onStart() {
    let finish = false;
    do {
        let choice = rl.question(
            "Make a choice:\n [1] Add frog to your collection\n [2] Release frog from collection\n [3] See your collection\n [4] See wild frogs\n [5] Add new frog specie\n [6] Cancel\n Your answer (1-6):")
        switch (choice) {
            case "1":
                addFrogToCollection();
                break;
            case "2":
                releaseFrog();
                break;
            case "3":
                seeMyCollection();
                break;
            case "4":
                seeWildFrogs();
                break;
            case "5":
                addNewFrogSpecie();
                break;
            case "6":
                finish = true;
                break;
        }
    } while (!finish)
}

onStart();