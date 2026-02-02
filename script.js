/* =========================
    CORES POR EQUIPE + ROLE
========================= */

const driverColors = {
    "Crimson Motorsport": {
        "Main Driver": "#5A0028",
        "Reserve Driver": "#5A0028"
    },
    "Keltech Racing Group": {
        "Main Driver": "#7F0000",
        "Reserve Driver": "#7F0000"
    },
    "Atlas GP": {
        "Main Driver": "#E5E5E5",
        "Reserve Driver": "#E5E5E5"
    },
    "Rennsport Performance": {
        "Main Driver": "#C09F78",
        "Reserve Driver": "#D8BC78"
    },
    "Prisma Racing": {
        "Main Driver": "#1875C5",
        "Reserve Driver": "#1875C5"
    }
};


/* =========================
    DADOS DOS PILOTOS
========================= */

const drivers = [
    { name: "dogemastertrain", role: "Main Driver", team: "Crimson Motorsport", principal: "l0xW3z", points: 143, podiums: 7, attendance: 7 },
    { name: "Dragon_GhostBR", role: "Main Driver", team: "Rennsport Performance", principal: "DragonGhost", points: 109, podiums: 4, attendance: 6 },
    { name: "Rod4YOUTzy", role: "Main Driver", team: "Keltech Racing Group", principal: "IVatticus", points: 89, podiums: 3, attendance: 6 },
    { name: "naelpro321", role: "Reserve Driver", team: "Keltech Racing Group", principal: "IVatticus", points: 73, podiums: 2, attendance: 5 },
    { name: "IVatticus", role: "Main Driver", team: "Keltech Racing Group", principal: "IVatticus", points: 66, podiums: 2, attendance: 5 },
    { name: "Cynotex", role: "Reserve Driver", team: "Crimson Motorsport", principal: "l0xW3z", points: 55, podiums: 2, attendance: 4 },
    { name: "Speed4Rages1", role: "Main Driver", team: "Rennsport Performance", principal: "DragonGhost", points: 54, podiums: 1, attendance: 5 },
    { name: "eveestreet", role: "Main Driver", team: "Rennsport Performance", principal: "DragonGhost", points: 38, podiums: 0, attendance: 5 },
    { name: "leafXtra", role: "Main Driver", team: "Prisma Racing", principal: "Ejber", points: 32, podiums: 0, attendance: 7 },
    { name: "yoelan3", role: "Reserve Driver", team: "Keltech Racing Group", principal: "IVatticus", points: 29, podiums: 1, attendance: 2 },
    { name: "Icequixy", role: "Reserve Driver", team: "Crimson Motorsport", principal: "l0xW3z", points: 18, podiums: 0, attendance: 2 },
    { name: "agustin1608el", role: "Main Driver", team: "Prisma Racing", principal: "Ejber", points: 10, podiums: 0, attendance: 1 },
    { name: "KingDimAlt", role: "Main Driver", team: "Prisma Racing", principal: "Ejber", points: 10, podiums: 0, attendance: 1 },
    { name: "erby42", role: "Reserve Driver", team: "Prisma Racing", principal: "Ejber", points: 6, podiums: 0, attendance: 2 },
    { name: "AlpiGame68", role: "Main Driver", team: "Atlas GP", principal: "vidihun", points: 6, podiums: 0, attendance: 1 },
    { name: "kirillptts0", role: "Reserve Driver", team: "Prisma Racing", principal: "Ejber", points: 2.5, podiums: 0, attendance: 1 },
    { name: "Simply_Moha", role: "Reserve Driver", team: "Crimson Motorsport", principal: "l0xW3z", points: 2, podiums: 0, attendance: 1 },
    { name: "awsxcdrftfhhdsh", role: "Reserve Driver", team: "Atlas GP", principal: "vidihun", points: 1.5, podiums: 0, attendance: "-" },
    { name: "Car5608Super", role: "Reserve Driver", team: "Rennsport Performance", principal: "DragonGhost", points: 0, podiums: 0, attendance: "-" },
    { name: "Jasonarl2", role: "Reserve Driver", team: "Rennsport Performance", principal: "DragonGhost", points: 0, podiums: 0, attendance: "-" },
    { name: "hard_zera921", role: "Reserve Driver", team: "Rennsport Performance", principal: "DragonGhost", points: 0, podiums: 0, attendance: 1 },
    { name: "gogo_firendrob", role: "Main Driver", team: "Atlas GP", principal: "vidihun", points: 0, podiums: 0, attendance: "-" },
    { name: "kolla19", role: "Main Driver", team: "Atlas GP", principal: "vidihun", points: 0, podiums: 0, attendance: 1 },
    { name: "doggyuk", role: "Reserve Driver", team: "Atlas GP", principal: "vidihun", points: 0, podiums: 0, attendance: "-" },
    { name: "XShadowLucaX", role: "Reserve Driver", team: "Atlas GP", principal: "vidihun", points: 0, podiums: 0, attendance: "-" },
    { name: "romanreinsj", role: "Main Driver", team: "Prisma Racing", principal: "Ejber", points: 39, podiums: 1, attendance: 5 },
    { name: "isaacggkk0", role: "Main Driver", team: "Crimson Motorsport", principal: "l0xW3z", points: 25, podiums: 0, attendance: 4 },
    { name: "kyaeruu_1", role: "Reserve Driver", team: "Keltech Racing Group", principal: "IVatticus", points: 21, podiums: 1, attendance: 1 },
    { name: "vidihun", role: "Main Driver", team: "Keltech Racing Group", principal: "IVatticus", points: 4, podiums: 0, attendance: 1 },
    { name: "Sebaklasiu12", role: "Reserve Driver", team: "Keltech Racing Group", principal: "IVatticus", points: 4, podiums: 0, attendance: 1 }
];


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
                <span>Attendance: ${d.attendance}</span>
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
                <span>Attendance: ${d.attendance}</span>
            </div>
        `;

        driversContainer.appendChild(card);
    });
}


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

const teams = {};

drivers.forEach(d => {
    if (!teams[d.team]) {
        teams[d.team] = {
            team: d.team,
            teamPrincipal: d.principal,
            points: 0,
            mainDrivers: []
        };
    }

    teams[d.team].points += d.points;

    if (d.role === "Main Driver") {
        teams[d.team].mainDrivers.push(d.name);
    }
});

Object.values(teams)
    .sort((a, b) => b.points - a.points)
    .forEach(t => {
        const card = document.createElement("div");
        card.classList.add("team");

        card.style.setProperty(
            "--team-color",
            driverColors[t.team]?.["Main Driver"] || "#777"
        );

        card.innerHTML = `
            <div class="teamHeader">
                <strong>${t.team}</strong>
                <span>${t.points} pts</span>
            </div>
            <div class="teamPrincipal">Principal: ${t.teamPrincipal}</div>
            <div class="teamDrivers">
                <strong>Main Drivers:</strong>
                <ul>
                    ${t.mainDrivers.map(d => `<li>${d}</li>`).join("")}
                </ul>
            </div>
        `;

        teamsContainer.appendChild(card);
    });

const races = [
    { name: "English GP", track: "Silverstone", date: "2026-01-17", map: "img/Silverstone.png" },
    { name: "French GP", track: "Circuit Paul Ricard", date: "2026-01-24", map: "img/PaulRicard.png"},
    { name: "German GP", track: "Hockenheim", date: "2026-01-31", map:"img/Hockenheim.png" },
    { name: "Japanese GP", track: "Tsukuba", date: "2026-02-07", map: "img/Tsukuba.png" },
    { name: "Japanese GP", track: "Fuji", date: "2026-02-14", map:"img/Fuji.png" },
    { name: "United States GP", track: "Sebring", date: "2026-02-21", map: "img/Sebring.png" },
    { name: "Italian GP", track: "Monza", date: "2026-02-28", map:"img/Monza.png" }
]

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

