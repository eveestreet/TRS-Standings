// This file is responsible for loading the data, rendering the drivers, teams, next race, and podiums on the page, and handling the sorting of drivers based on user input.
// It fetches the data from JSON files, processes it, and updates the DOM accordingly. The driver colors are defined in a constant object for easy access when rendering the driver cards.
const driverColors = {
    "Honda Racing Team": {
        "Main Driver": "#BE0D12",
        "Reserve Driver": "#BE0D12"
    },
    "Veridian Racing": {
        "Main Driver": "#017BB3",
        "Reserve Driver": "#017BB3"
    },
    "Makinami Holdings": {
        "Main Driver": "#D20963",
        "Reserve Driver": "#D20963"
    },
    "Emy Creations": {
        "Main Driver": "#9A01B1",
        "Reserve Driver": "#9A01B1"
    },
    "Acura Motorsports": {
        "Main Driver": "#FFFFFF",
        "Reserve Driver": "#FFFFFF"
    }
};

// Utility function to load JSON data from a given path. It uses the Fetch API to retrieve the data and returns it as a JavaScript object.
async function loadJSON(path) {
    const res = await fetch(path);
    return await res.json();
}

let drivers = [];
let races = [];
let teamsData = [];
let podiums = []

async function init() {
    drivers = await loadJSON("data/drivers.json");
    races = await loadJSON("data/races.json");
    teamsData = await loadJSON("data/teams.json");
    podiums = await loadJSON("data/results.json");

    sortDrivers();
    renderTeams();
    renderNextRace();
    renderPodiums();
}

init();

// DOM elements for drivers and teams containers, as well as the sorting controls for drivers. These elements are used to render the driver and team cards, and to handle user interactions for sorting the drivers based on different statistics.
const driversContainer = document.querySelector(".drivers");
const teamsContainer = document.querySelector(".teams");

const driverSortStat = document.getElementById("driverSortStat");
const driverSortOrder = document.getElementById("driverSortOrder");

// Function to render the list of drivers on the page. It creates a card for each driver, displaying their name, role, team, and statistics. The card's color is determined by the driver's team and role using the predefined driverColors object. Main drivers are highlighted with bold text for their role.
function renderDrivers(list) {
    driversContainer.innerHTML = "";

    list.forEach(d => {
        const card = document.createElement("div");
        card.classList.add(
            "driver",
            d.role === "Main Driver" ? "main-driver" : "reserve-driver"
        );

        const color = driverColors[d.team]?.[d.role] || "#FFF";
        card.style.setProperty("--driver-color", color);

        card.innerHTML = `
            <div class="driverName">${d.name}</div>
            <div class="driverRole">${d.role}</div>
            <div class="driverTeam">${d.team}</div>
            <div class="driverStats">
                <span>Points: ${d.points}</span>
                <span>Podiums: ${d.podiums}</span>
                <span>Race Wins: ${d.wins}</span>
                <span>Race Attendance: ${d.attendance}</span>
            </div>
        `;
        if (d.role === "Main Driver")
            card.innerHTML = `
            <div class="driverName">${d.name}</div>
            <div class="driverRole"><strong>${d.role}</strong></div>
            <div class="driverTeam">${d.team}</div>
            <div class="driverStats">
                <span>Points: ${d.points}</span>
                <span>Podiums: ${d.podiums}</span>
                <span>Race Wins: ${d.wins}</span>
                <span>Race Attendance: ${d.attendance}</span>
                </div>
        `;

        driversContainer.appendChild(card);
    });
}

const info = document.getElementById("info");

info.innerHTML = `
    <div class="info">
    <h3>Standings information relevant as of 05/24/2026</h3>
    </div>
`;
// Function to sort the drivers based on the selected statistic and order. It handles sorting by team name, driver name, and numerical statistics such as points, podiums, wins, and attendance. The sorting logic ensures that when sorting by team name, drivers are also sorted by their names within the same team.
function sortDrivers() {
    const stat = driverSortStat.value;
    const order = driverSortOrder.value;

    const sorted = [...drivers].sort((a, b) => {

        // Ordenar por equipe + nome
        if (stat === "teamName") {
            const teamCompare = a.team.localeCompare(b.team);

            if (teamCompare !== 0) {
                return order === "asc"
                    ? teamCompare
                    : -teamCompare;
            }

            const nameCompare = a.name.localeCompare(b.name);

            return order === "asc"
                ? nameCompare
                : -nameCompare;
        }

        // Ordenar por nome do piloto
        if (stat === "driverName") {
            const nameCompare = a.name.localeCompare(b.name);

            return order === "asc"
                ? nameCompare
                : -nameCompare;
        }

        // Estatísticas numéricas
        const aVal = a[stat] === "-" ? 0 : a[stat];
        const bVal = b[stat] === "-" ? 0 : b[stat];

        return order === "asc"
            ? aVal - bVal
            : bVal - aVal;
    });

    renderDrivers(sorted);
}

driverSortStat.addEventListener("change", sortDrivers);
driverSortOrder.addEventListener("change", sortDrivers);

// Function to render the list of teams on the page. It creates a card for each team, displaying the team name, points, wins, principal, and lists of main and reserve drivers. The card's color is determined by the team's main driver's color using the predefined driverColors object.
function renderTeams() {
    teamsContainer.innerHTML = "";

    teamsData
        .sort((a, b) => b.points - a.points)
        .forEach(team => {

            // pega pilotos ativos dessa equipe
            const activeDrivers = drivers.filter(d => d.team === team.name);

            const mainDrivers = activeDrivers
                .filter(d => d.role === "Main Driver")
                .map(d => d.name);

            const reserveDrivers = activeDrivers
                .filter(d => d.role === "Reserve Driver")
                .map(d => d.name);

            const card = document.createElement("div");
            card.classList.add("team");

            card.style.setProperty(
                "--team-color",
                driverColors[team.name]?.["Main Driver"] || "#FFF"
            );

            card.innerHTML = `
                <div class="teamHeader">
                    <strong>${team.name}</strong>
                    <span>${team.points} pts</span>
                    <span>${team.wins} wins</span>
                </div>

                <div class="teamPrincipal">
                    Principal: ${team.principal}
                </div>

                <div class="teamDrivers">
                    <strong>Main Drivers:</strong>
                    <ul>
                        ${mainDrivers.map(d => `<li>${d}</li>`).join("")}
                    </ul>

                    <strong>Reserve Drivers:</strong>
                    <ul>
                        ${reserveDrivers.map(d => `<li>${d}</li>`).join("")}
                    </ul>
                </div>
            `;

            teamsContainer.appendChild(card);
        });
}

// Function to get the next race based on the current date. It processes the list of races, calculates the deadline for each race (set to 15:00 UTC), and filters out races that have already passed.
// It then sorts the remaining races by date and returns the next upcoming race.
function getNextRace() {
    const now = new Date();

    return races
        .map(r => {
            const raceDate = new Date(r.date);

            const deadline = new Date(raceDate);
            deadline.setUTCHours(15, 0, 0, 0);

            return { ...r, dateObj: raceDate, deadline };
        })
        .filter(r => r.deadline >= now)
        .sort((a, b) => a.dateObj - b.dateObj)[0];
}

function renderNextRace() {
    const container = document.getElementById("nextRace");
    const race = getNextRace();

    if (!race) {
        container.innerHTML = `<p>Season finished 🏁</p>`;
        return;
    }

    const daysLeft = Math.ceil(
        (race.dateObj - new Date()) / (1000 * 60 * 60 * 24)
    );

    container.innerHTML = `

        <div class="raceName">${race.name}</div>
        <div class="raceTrack">${race.track}</div>

        <div class="raceDate">
            ${race.dateObj.toLocaleDateString("en-US")}
        </div>

        <div class="raceCountdown">
            ${daysLeft === 0 ? "Today!" : `${daysLeft} days to go`}
        </div>
        <img class="raceMap" src="${race.map}" alt="${race.track} map">
    `;
}

// Function to render the podium results for each race. It divides the races into two halves and renders them in separate containers. For each race with available results, it creates a card displaying the round number, race name, podium finishers, and fastest lap. If results are not available for a race, it renders a card with placeholders. The cards are styled differently based on whether results are available or not.
function renderPodiums() {

    const firstHalfContainer = document.getElementById("resultsFHalf");
    const secondHalfContainer = document.getElementById("resultsSecHalf");

    firstHalfContainer.innerHTML = "";
    secondHalfContainer.innerHTML = "";

    renderHalf(podiums.slice(0, 8), firstHalfContainer, 1);
    renderHalf(podiums.slice(8, 16), secondHalfContainer, 9);
}

// Helper function to render a half of the podium results. It takes a list of races, a container to render into, and the starting round number. It creates cards for each race, displaying the round number, race name, podium finishers, and fastest lap if results are available. If results are not available, it renders a card with placeholders. The cards are styled differently based on the availability of results.
function renderHalf(list, container, startRound) {

    list.forEach((race, index) => {

        const hasResult =
            race.podium[0] !== "" &&
            race.podium[1] !== "" &&
            race.podium[2] !== "";

        const card = document.createElement("div");

        if (hasResult) {

            card.classList.add("resultCard");

            card.innerHTML = `
                <div class="resultRace">
                    Round ${startRound + index} — ${race.race}
                </div>

                <div class="resultPodium">
                    <div class="podium1">🥇 ${race.podium[0]}</div>
                    <div class="podium2">🥈 ${race.podium[1]}</div>
                    <div class="podium3">🥉 ${race.podium[2]}</div>
                    <div class="fastestLap"> 🟪 Fastest Lap: ${race.fastestLap}</div>
                </div>
            `;

        } else {

            card.classList.add("undefCard");

            card.innerHTML = `
                <div class="resultRace">
                    Round ${startRound + index} — ${race.race}
                </div>

                <div class="resultPodium">
                    <div class="podium1">🥇</div>
                    <div class="podium2">🥈</div>
                    <div class="podium3">🥉</div>
                    <div class="fastestLap">🟪</div>
                </div>
            `;

        }

        container.appendChild(card);
    });

}