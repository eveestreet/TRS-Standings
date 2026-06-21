// ================================
// TRS Season Standings Dashboard
// Projeto Final - Desenvolvimento Web
// Tecnologias:
// JavaScript, React, Bootstrap,
// Chart.js, Day.js, SweetAlert2,
// Open-Meteo API e LocalStorage
// ================================

// Define as cores utilizadas para cada equipe
// e para os tipos de pilotos.
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

// Coordenadas geográficas dos circuitos.
// Utilizadas para obter clima em tempo real
// através da API Open-Meteo.
const circuitLocations = {
    "Italian GP": {
        lat: 45.6156,
        lon: 9.2811,
        city: "Monza, Italy"
    },

    "United States GP": {
        lat: 26.4499,
        lon: -81.3537,
        city: "Sebring, USA"
    },

    "French GP": {
        lat: 43.2506,
        lon: 5.7917,
        city: "Le Castellet, France"
    },

    "Belgian GP": {
        lat: 50.4372,
        lon: 5.9714,
        city: "Spa, Belgium"
    },

    "German GP": {
        lat: 49.3278,
        lon: 8.5658,
        city: "Hockenheim, Germany"
    },

    "English GP": {
        lat: 52.0733,
        lon: -1.0147,
        city: "Silverstone, England"
    },

    "Japanese GP (Tsukuba)": {
        lat: 36.1036,
        lon: 140.0870,
        city: "Tsukuba, Japan"
    },

    "Japanese GP (Fuji International Speedway)": {
        lat: 35.3717,
        lon: 138.9270,
        city: "Fuji, Japan"
    }
};

// Carrega arquivos JSON locais.
// Caso ocorra erro, exibe alerta usando SweetAlert2.
async function loadJSON(path) {

    try {

        const res = await fetch(path);

        if (!res.ok) {
            throw new Error(`Failed to load ${path}`);
        }

        return await res.json();

    } catch (error) {

        console.error(error);

        Swal.fire({
            icon: "error",
            title: "Loading Error",
            text: error.message
        });

        return [];
    }
}

// Consulta a API Open-Meteo e retorna
// temperatura atual e código climático.
async function getWeather(lat, lon) {

    try {

        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`
        );

        const data = await response.json();

        return {
            temperature: data.current.temperature_2m,
            weatherCode: data.current.weather_code
        };

    } catch (error) {

        console.error(error);

        return null;
    }
}

// Converte os códigos retornados pela API
// em descrições legíveis para o usuário.
function getWeatherDescription(code) {

    const weatherCodes = {
        0: "Clear Sky",
        1: "Mostly Clear",
        2: "Partly Cloudy",
        3: "Cloudy",
        45: "Fog",
        48: "Dense Fog",
        51: "Light Drizzle",
        61: "Rain",
        63: "Moderate Rain",
        65: "Heavy Rain",
        80: "Rain Showers",
        95: "Thunderstorm"
    };

    return weatherCodes[code] || "Unknown";
}

let drivers = [];
let races = [];
let teamsData = [];
let podiums = []

// Inicializa a aplicação carregando
// todos os arquivos de dados e renderizando
// os componentes da interface.
async function init() {
    drivers = await loadJSON("data/drivers.json");
    races = await loadJSON("data/races.json");
    teamsData = await loadJSON("data/teams.json");
    podiums = await loadJSON("data/results.json");

    // Recupera as preferências de ordenação
    // salvas anteriormente pelo usuário.
    const savedStat =
        localStorage.getItem("driverSortStat");

    const savedOrder =
        localStorage.getItem("driverSortOrder");

    driverSortStat.value =
        localStorage.getItem("driverSortStat")
        || "points";

    driverSortOrder.value =
        localStorage.getItem("driverSortOrder")
        || "desc";

    sortDrivers();
    renderTeams();
    renderNextRace();
    renderPodiums();
    renderRankingChart();
}

init();

const driversContainer = document.querySelector(".drivers");
const teamsContainer = document.querySelector(".teams");

const driverSortStat = document.getElementById("driverSortStat");
const driverSortOrder = document.getElementById("driverSortOrder");


// Cria dinamicamente os cards dos pilotos
// e aplica a cor correspondente à equipe.
function renderDrivers(list) {
    driversContainer.innerHTML = "";

    list.forEach(d => {
        const card = document.createElement("div");
        card.classList.add(
            "driver",
            "shadow-sm",
            "mb-3",
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
    <h3>Standings information relevant as of 06/21/2026</h3>
    </div>
`;

// Ordena os pilotos conforme os filtros
// selecionados pelo usuário.
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

// Salva a preferência de ordenação
// para futuras visitas ao sistema.
driverSortStat.addEventListener("change", () => {

    localStorage.setItem(
        "driverSortStat",
        driverSortStat.value
    );

    sortDrivers();
});

driverSortOrder.addEventListener("change", () => {

    localStorage.setItem(
        "driverSortOrder",
        driverSortOrder.value
    );

    sortDrivers();
});

// Gera os cards das equipes mostrando
// pontuação, vitórias e pilotos.
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
            card.classList.add(
                "team",
                "shadow",
                "mb-3"
            );

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

// Cria o gráfico de classificação
// utilizando Chart.js.
function renderRankingChart() {

    const equipes = [...teamsData]
        .sort((a, b) => b.points - a.points);

    const labels = equipes.map((equipe, i) => {

        const posicao =
            i === 0 ? "🥇" :
                i === 1 ? "🥈" :
                    i === 2 ? "🥉" :
                        `${i + 1}º`;

        return `${posicao} ${equipe.name}`;
    });

    const dados = equipes.map(e => e.points);

    const cores = equipes.map((_, i) => {
        if (i === 0) return "#ffd000cd";
        if (i === 1) return "#707070";
        if (i === 2) return "#c96704";
        return "#4e79a7";
    });

    const bordas = equipes.map((_, i) =>
        i < 3 ? "#FFFFFF" : "#333333"
    );

    const ctx =
        document.getElementById("graficoCorrida").getContext("2d");

    new Chart(ctx, {
        type: "bar",

        data: {
            labels,

            datasets: [{
                label: "Points",
                data: dados,

                backgroundColor: cores,
                borderColor: bordas,
                borderWidth: 3
            }]
        },

        plugins: [ChartDataLabels],

        options: {
            responsive: true,

            animation: {
                duration: 100,
                easing: "easeOutBounce"
            },

            plugins: {

                title: {
                    display: true,
                    text: "Championship Standings",
                    color: "#FFFFFF",
                    font: {
                        size: 18
                    }
                },

                legend: {
                    labels: {
                        color: "#FFFFFF"
                    }
                },

                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return `${context.raw} points`;
                        }
                    }
                },

                datalabels: {
                    color: "#FFFFFF",
                    anchor: "end",
                    align: "top",

                    font: {
                        weight: "bold",
                        size: 14
                    },

                    formatter: value => value
                }
            },

            scales: {
                x: {
                    ticks: {
                        color: "#FFFFFF"
                    }
                },

                y: {
                    beginAtZero: true,

                    ticks: {
                        color: "#FFFFFF"
                    },

                    grid: {
                        color: "rgba(255,255,255,0.1)"
                    }
                }
            }
        }
    });
}

// Localiza a próxima corrida do calendário
// com base na data atual.
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

// Exibe informações da próxima corrida,
// incluindo clima em tempo real obtido pela API.
async function renderNextRace() {
    const container = document.getElementById("nextRace");
    const race = getNextRace();

    if (!race) {
        container.innerHTML = `<p>Season finished 🏁</p>`;
        return;
    }

    const location = circuitLocations[race.name];

    const weather = location
        ? await getWeather(location.lat, location.lon)
        : null;

    const daysLeft = dayjs(race.dateObj)
        .diff(dayjs(), "day");

    container.innerHTML = `

        <div class="raceName">${race.name}</div>

        <div class="raceTrack">
            ${race.track}
            ${location ? `• ${location.city}` : ""}
        </div>

        <div class="raceDate">
            ${race.dateObj.toLocaleDateString("en-US")}
        </div>

        <div class="raceCountdown">
            ${daysLeft === 0 ? "Today!" : `${daysLeft} days to go`}
        </div>

        <div class="raceWeather">
    ${weather
            ? `🌡️ ${weather.temperature}°C • ${getWeatherDescription(weather.weatherCode)}`
            : "🌡️ Weather unavailable"
        }
    </div>

        <img class="raceMap"
            src="${race.map}"
            alt="${race.track} map">
    `;
}

// Renderiza todos os resultados da temporada.
function renderPodiums() {

    const firstHalfContainer = document.getElementById("resultsFHalf");
    const secondHalfContainer = document.getElementById("resultsSecHalf");

    firstHalfContainer.innerHTML = "";
    secondHalfContainer.innerHTML = "";

    renderHalf(podiums.slice(0, 8), firstHalfContainer, 1);
    renderHalf(podiums.slice(8, 16), secondHalfContainer, 9);
}

// Renderiza uma seção específica dos resultados
// (primeira ou segunda metade do campeonato).
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
