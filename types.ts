interface Driver {
    name: string;
    team: string;
    role: string;
    points: number;
    podiums: number;
    wins: number;
    attendance: number;
}

interface Team {
    name: string;
    principal: string;
    points: number;
    wins: number;
}

interface Race {
    name: string;
    track: string;
    date: string;
    map: string;
}

interface Result {
    race: string;
    podium: string[];
    fastestLap: string;
}

interface CircuitLocation {
    lat: number;
    lon: number;
    city: string;
}