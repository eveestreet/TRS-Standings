// =====================================
// Componente React responsável por
// demonstrar integração do framework
// com a API Open-Meteo.
// Utiliza os hooks:
// useState e useEffect.
// =====================================

const root = ReactDOM.createRoot(
    document.getElementById("react-root")
);

root.render(
    <WeatherWidget />
);

// Componente responsável por buscar
// e exibir dados climáticos em tempo real.
function WeatherWidget() {

    const [temp, setTemp] = React.useState(null);

    React.useEffect(() => {

        fetch(
            "https://api.open-meteo.com/v1/forecast?latitude=43.2506&longitude=5.7917&current=temperature_2m"
        )
            .then(r => r.json())
            .then(data => {
                setTemp(data.current.temperature_2m);
            });

    }, []);

    return (
        <div className="nextRaceCard">
            <h3>Weather Information (React)</h3>

            <p>
                Real-time weather data obtained through
                Open-Meteo API.
            </p>

            <p>Location: Le Castellet, France</p>
            <p>Temperature: {temp}°C</p>
        </div>
    );
}
root.render(
    <>
        <NextRaceReact />
        <WeatherWidget />
    </>
);
