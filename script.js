

// ==============================
// BIG BROTHER SIMULATOR
// ==============================


// GAME DATA

let houseguests = [];

let evictedHouseguests = [];

let activeTwists = [];

let currentWeek = 1;

let currentHOH = null;

let nominees = [];

let povWinner = null;

let seasonStarted = false;



// ==============================
// ADD HOUSEGUEST
// ==============================

function addHouseguest() {

    const nameInput =
        document.getElementById("nameInput");

    const imageInput =
        document.getElementById("imageInput");


    const name =
        nameInput.value.trim();

    const image =
        imageInput.value.trim();


    if (name === "") {

        alert(
            "Please enter a houseguest name!"
        );

        return;

    }


    const houseguest = {

        id: Date.now(),

        name: name,

        image: image || 
        "https://via.placeholder.com/300x300?text=" +
        encodeURIComponent(name),

        status: "Active"

    };


    houseguests.push(houseguest);


    nameInput.value = "";

    imageInput.value = "";


    updateCastDisplay();

    updateRemainingPlayers();


}



// ==============================
// DISPLAY CAST
// ==============================

function updateCastDisplay() {

    const castGrid =
        document.getElementById("castGrid");


    castGrid.innerHTML = "";


    houseguests.forEach(function(player) {

        const card =
            document.createElement("div");

        card.className =
            "houseguest-card";


        card.innerHTML = `

            <img
                src="${player.image}"
                alt="${player.name}"
            >

            <h3>
                ${player.name}
            </h3>

            <button
                onclick="removeHouseguest(${player.id})"
            >
                Remove
            </button>

        `;


        castGrid.appendChild(card);

    });

}



// ==============================
// REMOVE HOUSEGUEST
// ==============================

function removeHouseguest(id) {

    houseguests =
        houseguests.filter(
            player => player.id !== id
        );


    updateCastDisplay();

    updateRemainingPlayers();

}



// ==============================
// SAVE TWISTS
// ==============================

function saveTwists() {

    const checkboxes =
        document.querySelectorAll(
            ".twist-options input"
        );


    activeTwists = [];


    checkboxes.forEach(function(box) {

        if (box.checked) {

            activeTwists.push(
                box.value
            );

        }

    });


    const twistDisplay =
        document.getElementById(
            "activeTwists"
        );


    if (activeTwists.length === 0) {

        twistDisplay.innerHTML =
            "<p>No twists are currently active.</p>";

    }

    else {

        twistDisplay.innerHTML =

            "<h3>Active Twists:</h3>" +

            activeTwists
                .map(
                    twist =>
                    `<span class="player-item">${twist}</span>`
                )
                .join("");

    }


    addEvent(

        "Twists activated: " +

        activeTwists.join(", ")

    );

}



// ==============================
// START SEASON
// ==============================

function startNewSeason() {

    if (houseguests.length < 4) {

        alert(
            "You need at least 4 houseguests!"
        );

        return;

    }


    seasonStarted = true;

    currentWeek = 1;

    currentHOH = null;

    nominees = [];

    povWinner = null;


    addEvent(
        "🏠 The Big Brother season has officially begun!"
    );


    updateGameDisplay();

}



// ==============================
// GET RANDOM PLAYER
// ==============================

function getRandomPlayer(
    excludedPlayers = []
) {

    const availablePlayers =
        houseguests.filter(

            player =>
            !excludedPlayers.includes(player.name)

        );


    if (
        availablePlayers.length === 0
    ) {

        return null;

    }


    const randomIndex =
        Math.floor(

            Math.random() *
            availablePlayers.length

        );


    return availablePlayers[
        randomIndex
    ];

}



// ==============================
// RUN HOH
// ==============================

function runHOH() {

    if (!seasonStarted) {

        alert(
            "Start the season first!"
        );

        return;

    }


    if (houseguests.length < 2) {

        alert(
            "The season is almost over!"
        );

        return;

    }


    const winner =
        getRandomPlayer();


    currentHOH =
        winner.name;


    addEvent(

        "🏆 " +

        currentHOH +

        " has won the Head of Household competition!"

    );


    updateGameDisplay();

}



// ==============================
// NOMINATIONS
// ==============================

function makeNominations() {

    if (!currentHOH) {

        alert(
            "You must run the HOH competition first!"
        );

        return;

    }


    const availablePlayers =
        houseguests.filter(

            player =>
            player.name !== currentHOH

        );


    if (availablePlayers.length < 2) {

        alert(
            "Not enough players to nominate!"
        );

        return;

    }


    nominees = [];


    while (nominees.length < 2) {

        const player =
            availablePlayers[
                Math.floor(

                    Math.random() *
                    availablePlayers.length

                )
            ];


        if (
            !nominees.includes(
                player.name
            )
        ) {

            nominees.push(
                player.name
            );

        }

    }


    addEvent(

        "📋 " +

        currentHOH +

        " has nominated " +

        nominees[0] +

        " and " +

        nominees[1] +

        " for eviction."

    );


    updateGameDisplay();

}



// ==============================
// POV
// ==============================

function runPOV() {

    if (nominees.length !== 2) {

        alert(
            "You need nominees before playing POV!"
        );

        return;

    }


    const winner =
        getRandomPlayer();


    povWinner =
        winner.name;


    addEvent(

        "🥇 " +

        povWinner +

        " has won the Power of Veto!"

    );


    updateGameDisplay();

}



// ==============================
// USE POV
// ==============================

function usePOV() {

    if (!povWinner) {

        alert(
            "Run the POV competition first!"
        );

        return;

    }


    const useVeto =
        confirm(

            povWinner +

            " won the POV.\n\nDo they use the veto?"

        );


    if (!useVeto) {

        addEvent(

            "🦸 " +

            povWinner +

            " decided NOT to use the Power of Veto."

        );

        return;

    }


    let nomineeToRemove;


    if (
        nominees.includes(
            povWinner
        )
    ) {

        nomineeToRemove =
            povWinner;

    }

    else {

        nomineeToRemove =
            nominees[
                Math.floor(
                    Math.random() * nominees.length
                )
            ];

    }


    nominees =
        nominees.filter(

            name =>
            name !== nomineeToRemove

        );


    const replacement =
        getRandomPlayer(
            [
                currentHOH,
                povWinner,
                ...nominees
            ]
        );


    if (replacement) {

        nominees.push(
            replacement.name
        );


        addEvent(

            "🦸 " +

            povWinner +

            " used the Power of Veto on " +

            nomineeToRemove +

            ".\n\n" +

            currentHOH +

            " nominated " +

            replacement.name +

            " as the replacement nominee."

        );

    }


    updateGameDisplay();

}



// ==============================
// EVICTION
// ==============================

function runEviction() {

    if (nominees.length !== 2) {

        alert(
            "There must be two nominees!"
        );

        return;

    }


    const evicted =
        nominees[
            Math.floor(
                Math.random() * 2
            )
        ];


    const saved =
        nominees.find(
            name =>
            name !== evicted
        );


    const evictedPlayer =
        houseguests.find(
            player =>
            player.name === evicted
        );


    houseguests =
        houseguests.filter(
            player =>
            player.name !== evicted
        );


    evictedHouseguests.push(
        evictedPlayer
    );


    addEvent(

        "🚪 By a vote of the house...\n\n" +

        evicted +

        " has been evicted from the Big Brother house!\n\n" +

        saved +

        " survives another week."

    );


    nominees = [];

    currentHOH = null;

    povWinner = null;


    currentWeek++;


    if (houseguests.length === 3) {

        addEvent(
            "🔥 The Final 3 has been reached!"
        );

    }


    if (houseguests.length === 2) {

        addEvent(
            "🎉 The Final 2 has been reached!"
        );

    }


    updateGameDisplay();

    updateRemainingPlayers();

    updateEvictedPlayers();


    checkForWinner();

}



// ==============================
// CHECK WINNER
// ==============================

function checkForWinner() {

    if (houseguests.length === 1) {

        const winner =
            houseguests[0];


        addEvent(

            "👑 CONGRATULATIONS!\n\n" +

            winner.name +

            " is the winner of Big Brother!"

        );


        seasonStarted = false;

    }

}



// ==============================
// UPDATE GAME DISPLAY
// ==============================

function updateGameDisplay() {

    document.getElementById(
        "weekTitle"
    ).textContent =

        "Week " + currentWeek;


    document.getElementById(
        "hohDisplay"
    ).textContent =

        currentHOH || "None";


    document.getElementById(
        "nomineesDisplay"
    ).textContent =

        nominees.length > 0

        ? nominees.join(" & ")

        : "None";


    document.getElementById(
        "povDisplay"
    ).textContent =

        povWinner || "None";

}



// ==============================
// REMAINING PLAYERS
// ==============================

function updateRemainingPlayers() {

    const container =
        document.getElementById(
            "remainingPlayers"
        );


    container.innerHTML = "";


    houseguests.forEach(function(player) {

        const item =
            document.createElement("span");

        item.className =
            "player-item";

        item.textContent =
            player.name;


        container.appendChild(item);

    });

}



// ==============================
// EVICTED PLAYERS
// ==============================

function updateEvictedPlayers() {

    const container =
        document.getElementById(
            "evictedPlayers"
        );


    container.innerHTML = "";


    evictedHouseguests.forEach(function(player) {

        const item =
            document.createElement("span");

        item.className =
            "player-item evicted";

        item.textContent =
            player.name;


        container.appendChild(item);

    });

}



// ==============================
// EVENT LOG
// ==============================

function addEvent(message) {

    const eventLog =
        document.getElementById(
            "eventLog"
        );


    const event =
        document.createElement("div");

    event.className =
        "event";


    event.innerHTML =
        message.replace(
            /\n/g,
            "<br>"
        );


    eventLog.prepend(event);

}



// ==============================
// SAVE GAME
// ==============================

function saveGame() {

    const gameData = {

        houseguests:
            houseguests,

        evictedHouseguests:
            evictedHouseguests,

        activeTwists:
            activeTwists,

        currentWeek:
            currentWeek,

        currentHOH:
            currentHOH,

        nominees:
            nominees,

        povWinner:
            povWinner,

        seasonStarted:
            seasonStarted

    };


    localStorage.setItem(

        "bigBrotherSimulator",

        JSON.stringify(gameData)

    );


    alert(
        "Your season has been saved!"
    );

}



// ==============================
// LOAD GAME
// ==============================

function loadGame() {

    const savedGame =
        localStorage.getItem(
            "bigBrotherSimulator"
        );


    if (!savedGame) {

        alert(
            "No saved season was found!"
        );

        return;

    }


    const gameData =
        JSON.parse(savedGame);


    houseguests =
        gameData.houseguests;

    evictedHouseguests =
        gameData.evictedHouseguests;

    activeTwists =
        gameData.activeTwists;

    currentWeek =
        gameData.currentWeek;

    currentHOH =
        gameData.currentHOH;

    nominees =
        gameData.nominees;

    povWinner =
        gameData.povWinner;

    seasonStarted =
        gameData.seasonStarted;


    updateCastDisplay();

    updateRemainingPlayers();

    updateEvictedPlayers();

    updateGameDisplay();


    addEvent(
        "💾 Saved season loaded!"
    );

}



// ==============================
// RESET GAME
// ==============================

function resetGame() {

    const confirmReset =
        confirm(

            "Are you sure you want to delete everything?"

        );


    if (!confirmReset) {

        return;

    }


    houseguests = [];

    evictedHouseguests = [];

    activeTwists = [];

    currentWeek = 1;

    currentHOH = null;

    nominees = [];

    povWinner = null;

    seasonStarted = false;


    localStorage.removeItem(
        "bigBrotherSimulator"
    );


    document.getElementById(
        "eventLog"
    ).innerHTML =

        "<p>Your Big Brother season is ready to begin!</p>";


    updateCastDisplay();

    updateRemainingPlayers();

    updateEvictedPlayers();

    updateGameDisplay();


    alert(
        "Everything has been reset!"
    );

}
