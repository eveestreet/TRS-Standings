/* =========================
    CORES POR EQUIPE + ROLE
========================= */

const driverColors = {
    "Crimson Motorsport": {
        "Main Driver": "#7F0000",
        "Reserve Driver": "#7F0000"
    },
    "Keltech Racing Group": {
        "Main Driver": "#5A0028",
        "Reserve Driver": "#5A0028"
    },
    "Atlas GP": {
        "Main Driver": "#E5E5E5",
        "Reserve Driver": "#E5E5E5"
    },
    "Rennsport Performance": {
        "Main Driver": "#C09F78",
        "Reserve Driver": "#C09F78"
    },
    "Prisma Racing": {
        "Main Driver": "#1875C5",
        "Reserve Driver": "#1875C5"
    }
};


/* =========================
    DADOS DOS PILOTOS
========================= */
async function loadJSON(path) {
    const res = await fetch(path);
    return await res.json();
}

let drivers = [];
let races = [];

async function init() {
    drivers = await loadJSON("data/drivers.json");
    races = await loadJSON("data/races.json");

    renderDrivers(drivers);
    renderTeams();
    renderNextRace();
}

init();

/* =========================
    ELEMENTOS DO DOM
========================= */

const driversContainer = document.querySelector(".drivers");
const teamsContainer = document.querySelector(".teams");

const driverSortStat = document.getElementById("driverSortStat");
const driverSortOrder = document.getElementById("driverSortOrder");


/* =========================
    RENDER PILOTOS
========================= */

function renderDrivers(list) {
    driversContainer.innerHTML = "";

    list.forEach(d => {
        const card = document.createElement("div");
        card.classList.add(
            "driver",
            d.role === "Main Driver" ? "main-driver" : "reserve-driver"
        );

        const color = driverColors[d.team]?.[d.role] || "#777";
        card.style.setProperty("--driver-color", color);

        card.innerHTML = `
            <div class="driverName">${d.name}</div>
            <div class="driverRole">${d.role}</div>
            <div class="driverTeam">${d.team}</div>
            <div class="driverStats">
                <span>Points: ${d.points}</span>
                <span>Podiums: ${d.podiums}</span>
                <span>Race Wins: ${d.wins}</span>
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
                </div>
        `;

        driversContainer.appendChild(card);
    });
}

const info = document.getElementById("info");

info.innerHTML = `
    <div class="info">
    <h3>Standings information relevant as of 02/14/2026</h3>
    </div>
`;



/* =========================
    SORTING
========================= */

function sortDrivers() {
    const stat = driverSortStat.value;
    const order = driverSortOrder.value;

    const sorted = [...drivers].sort((a, b) => {

        // TEAM + NAME (A-Z)
        if (stat === "teamName") {
            const teamCompare = a.team.localeCompare(b.team);
            if (teamCompare !== 0) {
                return order === "asc" ? teamCompare : -teamCompare;
            }

            const nameCompare = a.name.localeCompare(b.name);
            return order === "asc" ? nameCompare : -nameCompare;
        }

        // NUMÉRICOS
        const aVal = a[stat] === "-" ? 0 : a[stat];
        const bVal = b[stat] === "-" ? 0 : b[stat];

        return order === "asc" ? aVal - bVal : bVal - aVal;
    });

    renderDrivers(sorted);
}

driverSortStat.addEventListener("change", sortDrivers);
driverSortOrder.addEventListener("change", sortDrivers);


/* =========================
    RENDER INICIAL
========================= */

renderDrivers(drivers);


/* =========================
    CONSTRUCTOR STANDINGS
========================= */

function renderTeams() {
    teamsContainer.innerHTML = "";

    const teams = {};

    drivers.forEach(d => {
        if (!teams[d.team]) {
            teams[d.team] = {
                name: d.team,
                teamPrincipal: d.principal,
                points: 0,
                podiums: 0,
                wins: 0,
                mainDrivers: [],
                reserveDrivers: []
            };
        }

        teams[d.team].points += d.points;
        teams[d.team].podiums += d.podiums;
        teams[d.team].wins += d.wins;

        if (d.role === "Main Driver") {
            teams[d.team].mainDrivers.push(d.name);
        } else {
            teams[d.team].reserveDrivers.push(d.name);
        }
    });

    Object.values(teams)
        .sort((a, b) => b.points - a.points)
        .forEach(t => {
            const card = document.createElement("div");
            card.classList.add("team");

            card.style.setProperty(
                "--team-color",
                driverColors[t.name]?.["Main Driver"] || "#777"
            );

            card.innerHTML = `
                <div class="teamHeader">
                    <strong>${t.name}</strong>
                    <span>${t.points} pts</span>
                    <span>${t.wins} wins</span>
                </div>

                <div class="teamPrincipal">
                    Principal: ${t.teamPrincipal}
                </div>

                <div class="teamDrivers">
                    <strong>Main Drivers:</strong>
                    <ul>
                        ${t.mainDrivers.map(d => `<li>${d}</li>`).join("")}
                    </ul>

                    <strong>Reserve Drivers:</strong>
                    <ul>
                        ${t.reserveDrivers.map(d => `<li>${d}</li>`).join("")}
                    </ul>
                </div>
            `;

            teamsContainer.appendChild(card);
        });
}




function getNextRace() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return races
        .map(r => ({ ...r, dateObj: new Date(r.date) }))
        .filter(r => r.dateObj >= today)
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
            ${race.dateObj.toLocaleDateString("en-GB")}
        </div>

        <div class="raceCountdown">
            ${daysLeft === 0 ? "Today!" : `${daysLeft} days to go`}
        </div>
        <img class="raceMap" src="${race.map}" alt="${race.track} map">
    `;
}

renderNextRace();