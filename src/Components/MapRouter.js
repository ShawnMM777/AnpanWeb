import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MapRouter = () => {
    const navigate = useNavigate();
    const [fromLocation, setFromLocation] = useState('');
    const [toLocation, setToLocation] = useState('');
    const [selectedFromPoint, setSelectedFromPoint] = useState(null);
    const [selectedToPoint, setSelectedToPoint] = useState(null);
    const [routeInfo, setRouteInfo] = useState(null);
    const [isCalculating, setIsCalculating] = useState(false);
    const [weatherData, setWeatherData] = useState({});
    const [loadingWeather, setLoadingWeather] = useState(true);
    const [showCityInfo, setShowCityInfo] = useState(false);
    const [selectedCityInfo, setSelectedCityInfo] = useState(null);
    const handleRoutesSave = () => {
    navigate('/Drafts');
  };
  const payment = () => {navigate('/payment');}

const japanCities = [
        {
            id: 'tokyo',
            name: 'Tokyo',
            x: 68,
            y: 45,
            prefecture: 'Tokyo',
            lat: 35.6762,
            lon: 139.6503,
            population: '14.0M',
            established: '1457',
            area: '2,194 km²',
            climate: 'Humid subtropical',
            description: 'The bustling capital and largest metropolitan area of Japan, known for its cutting-edge technology, vibrant culture, and endless entertainment.',
            attractions: ['Tokyo Skytree','Senso-ji Temple','Imperial Palace','Shibuya Crossing','Tsukiji Outer Market','Meiji Shrine','Tokyo Disneyland'],
            specialties: ['Sushi','Ramen','Tempura','Monjayaki','Chanko-nabe'],
            districts: ['Shibuya - Fashion & Entertainment','Shinjuku - Business & Nightlife','Harajuku - Youth Culture','Ginza - Luxury Shopping','Asakusa - Traditional Culture'],
            bestTimeToVisit: 'Spring (Mar-May) & Fall (Sep-Nov)',
            averageStay: '3-5 days'
},
        {
            id: 'osaka',
            name: 'Osaka',
            x: 58,
            y: 55,
            prefecture: 'Osaka',
            lat: 34.6937,
            lon: 135.5023,
            population: '2.7M',
            established: '1496',
            area: '225 km²',
            climate: 'Humid subtropical',
            description: 'Known as "Japan\'s Kitchen" for its incredible food culture, Osaka is a vibrant commercial hub with friendly locals and rich history.',
            attractions: [
                'Osaka Castle',
                'Universal Studios Japan',
                'Dotonbori District',
                'Sumiyoshi Taisha',
                'Shitennoji Temple',
                'Osaka Aquarium Kaiyukan','Kuromon Ichiba Market'],
            specialties: [
                'Takoyaki',
                'Okonomiyaki',
                'Kushikatsu',
                'Kitsune Udon',
                'Butaman'
            ],
            districts: [
                'Dotonbori - Entertainment & Food',
                'Namba - Shopping & Dining',
                'Shinsekai - Retro Atmosphere',
                'Sumiyoshi - Traditional Shrines',
                'Tennoji - Modern Development'
            ],
            bestTimeToVisit: 'Spring (Mar-May) & Fall (Sep-Nov)',
            averageStay: '2-3 days'
        },
        
        {
            id: 'kyoto',
            name: 'Kyoto',
            x: 58,
            y: 52,
            prefecture: 'Kyoto',
            lat: 35.0116,
            lon: 135.7681,
            population: '1.5M',
            established: '794',
            area: '827 km²',
            climate: 'Humid subtropical',
            description: 'The former imperial capital, Kyoto is the cultural heart of Japan with over 2,000 temples and shrines, traditional architecture, and preserved districts.',
            attractions: [
                'Fushimi Inari Shrine',
                'Kinkaku-ji (Golden Pavilion)',
                'Arashiyama Bamboo Grove',
                'Kiyomizu-dera Temple',
                'Gion District',
                'Philosopher\'s Path',
                'Nijo Castle'
            ],
            specialties: [
                'Kaiseki Cuisine',
                'Matcha & Wagashi',
                'Tofu Cuisine',
                'Kyoto-style Sushi',
                'Yudofu'
            ],
            districts: [
                'Gion - Geisha District',
                'Arashiyama - Bamboo & Temples',
                'Higashiyama - Historic Preservation',
                'Fushimi - Sake Breweries',
                'Pontocho - Traditional Dining'
            ],
            bestTimeToVisit: 'Spring (Cherry Blossoms) & Fall (Autumn Colors)',
            averageStay: '3-4 days'
        },
        {
            id: 'yokohama',
            name: 'Yokohama',
            x: 69,
            y: 47,
            prefecture: 'Kanagawa',
            lat: 35.4478,
            lon: 139.6425,
            population: '3.7M',
            established: '1859',
            area: '438 km²',
            climate: 'Humid subtropical',
            description: 'Japan\'s second-largest city and major port, known for its international atmosphere, modern skyline, and historic Chinatown.',
            attractions: [
                'Yokohama Chinatown',
                'Minato Mirai 21',
                'Red Brick Warehouse',
                'Cosmo World',
                'Sankei-en Garden',
                'Cup Noodles Museum',
                'Yokohama Landmark Tower'
            ],
            specialties: [
                'Shumai',
                'Chinese Cuisine',
                'Napolitan Pasta',
                'Beef Stew',
                'Beer (Kirin Brewery)'
            ],
            districts: [
                'Minato Mirai - Modern Waterfront',
                'Chinatown - Chinese Culture',
                'Kohoku New Town - Residential',
                'Noge - Traditional Shopping',
                'Motomachi - Foreign Settlement'
            ],
            bestTimeToVisit: 'Year-round (mild climate)',
            averageStay: '1-2 days'
        },
        {
            id: 'nagoya',
            name: 'Nagoya',
            x: 60,
            y: 48,
            prefecture: 'Aichi',
            lat: 35.1815,
            lon: 136.9066,
            population: '2.3M',
            established: '1610',
            area: '326 km²',
            climate: 'Humid subtropical',
            description: 'Industrial powerhouse and transportation hub, famous for automotive industry, unique cuisine, and magnificent castle.',
            attractions: [
                'Nagoya Castle',
                'Atsuta Shrine',
                'Toyota Commemorative Museum',
                'Osu Kannon Temple',
                'SCMAGLEV Railway Park',
                'Nagoya Port Aquarium',
                'Tokugawa Art Museum'
            ],
            specialties: [
                'Hitsumabushi (Grilled Eel)',
                'Miso Katsu',
                'Tebasaki (Chicken Wings)',
                'Kishimen Noodles',
                'Miso Nikomi Udon'
            ],
            districts: [
                'Sakae - Entertainment District',
                'Osu - Electronics & Pop Culture',
                'Marunouchi - Business Center',
                'Kanayama - Transportation Hub',
                'Atsuta - Historical Area'
            ],
            bestTimeToVisit: 'Spring & Fall',
            averageStay: '1-2 days'
        },
        {
            id: 'sapporo',
            name: 'Sapporo',
            x: 60,
            y: 15,
            prefecture: 'Hokkaido',
            lat: 43.0642,
            lon: 141.3469,
            population: '2.0M',
            established: '1868',
            area: '1,121 km²',
            climate: 'Humid continental',
            description: 'Capital of Hokkaido, famous for beer, snow festival, fresh seafood, and beautiful natural surroundings with distinct four seasons.',
            attractions: [
                'Sapporo Snow Festival',
                'Sapporo Beer Garden',
                'Susukino District',
                'Odori Park',
                'Maruyama Park',
                'Shiroi Koibito Park',
                'Mount Moiwa'
            ],
            specialties: [
                'Fresh Seafood',
                'Genghis Khan (Grilled Lamb)',
                'Sapporo Ramen',
                'Dairy Products',
                'Sapporo Beer'
            ],
            districts: [
                'Susukino - Entertainment Quarter',
                'Odori - Central Park Area',
                'Maruyama - Upscale Residential',
                'Chitose - Airport Area',
                'Jozankei - Hot Springs'
            ],
            bestTimeToVisit: 'Winter (Snow Festival) & Summer',
            averageStay: '2-3 days'
        },
        {
            id: 'fukuoka',
            name: 'Fukuoka',
            x: 45,
            y: 72,
            prefecture: 'Fukuoka',
            lat: 33.5904,
            lon: 130.4017,
            population: '1.6M',
            established: '1889',
            area: '343 km²',
            climate: 'Humid subtropical',
            description: 'Gateway to Asia, known for its youthful energy, street food culture, ancient temples, and proximity to Korea and China.',
            attractions: [
                'Dazaifu Tenmangu',
                'Fukuoka Castle Ruins',
                'Canal City Hakata',
                'Ohori Park',
                'Kushida Shrine',
                'Nakasu District',
                'Momochihama Tower'
            ],
            specialties: [
                'Hakata Ramen',
                'Mentaiko (Spicy Cod Roe)',
                'Mizutaki (Chicken Hot Pot)',
                'Yatai (Street Food Stalls)',
                'Castella Cake'
            ],
            districts: [
                'Hakata - Traditional & Business',
                'Tenjin - Shopping & Entertainment',
                'Nakasu - Nightlife & Yatai',
                'Momochihama - Seaside Area',
                'Dazaifu - Historical Temples'
            ],
            bestTimeToVisit: 'Spring & Fall',
            averageStay: '2-3 days'
        },
        {
            id: 'kobe',
            name: 'Kobe',
            x: 58,
            y: 56,
            prefecture: 'Hyogo',
            lat: 34.6901,
            lon: 135.1956,
            population: '1.5M',
            established: '1889',
            area: '557 km²',
            climate: 'Humid subtropical',
            description: 'Cosmopolitan port city nestled between mountains and sea, world-famous for Kobe beef and international atmosphere.',
            attractions: [
                'Kobe Harborland',
                'Mount Rokko',
                'Arima Onsen',
                'Chinatown (Nankinmachi)',
                'Kitano Foreign District',
                'Meriken Park',
                'Ikuta Shrine'
            ],
            specialties: [
                'Kobe Beef',
                'Sake (Nada District)',
                'Chinese Cuisine',
                'Western-style Sweets',
                'Sobameshi (Fried Noodles & Rice)'
            ],
            districts: [
                'Sannomiya - Downtown Center',
                'Kitano - Foreign Residences',
                'Harborland - Waterfront',
                'Nada - Sake Brewing',
                'Arima - Hot Springs Resort'
            ],
            bestTimeToVisit: 'Year-round',
            averageStay: '1-2 days'
        },
        {
            id: 'sendai',
            name: 'Sendai',
            x: 65,
            y: 32,
            prefecture: 'Miyagi',
            lat: 38.2682,
            lon: 140.8694,
            population: '1.1M',
            established: '1600',
            area: '786 km²',
            climate: 'Humid subtropical',
            description: 'The "City of Trees" and largest city in Tohoku region, known for its beautiful nature, historical sites, and resilience.',
            attractions: [
                'Zuihoden Mausoleum',
                'Sendai Castle Ruins',
                'Jozenji-dori Avenue',
                'Matsushima Bay',
                'Akiu Onsen',
                'Sendai Mediatheque',
                'Rinnai Temple'
            ],
            specialties: [
                'Gyutan (Beef Tongue)',
                'Zunda Mochi',
                'Sendai Miso',
                'Sasakamaboko',
                'Hagi no Tsuki (Moon Cake)'
            ],
            districts: [
                'Aoba-ku - City Center',
                'Taihaku-ku - Akiu Hot Springs',
                'Miyagino-ku - Coastal Area',
                'Wakabayashi-ku - Agricultural',
                'Izumi-ku - Residential'
            ],
            bestTimeToVisit: 'Spring & Fall',
            averageStay: '1-2 days'
        },
        {
            id: 'hiroshima',
            name: 'Hiroshima',
            x: 50,
            y: 60,
            prefecture: 'Hiroshima',
            lat: 34.3853,
            lon: 132.4553,
            population: '1.2M',
            established: '1589',
            area: '905 km²',
            climate: 'Humid subtropical',
            description: 'A city of peace and remembrance, known for its moving history, beautiful Miyajima Island, and delicious local cuisine.',
            attractions: [
                'Peace Memorial Park',
                'Miyajima Island (Itsukushima Shrine)',
                'Hiroshima Castle',
                'Shukkeien Garden',
                'Atomic Bomb Dome',
                'Hiroshima Museum of Art',
                'Mazda Museum'
            ],
            specialties: [
                'Hiroshima-style Okonomiyaki',
                'Oysters',
                'Anago (Sea Eel)',
                'Momiji Manju',
                'Hiroshima Tsukemen'
            ],
            districts: [
                'Naka-ku - Peace Memorial',
                'Minami-ku - Residential',
                'Nishi-ku - Coastal Area',
                'Higashi-ku - Mountains',
                'Hatsukaichi - Miyajima Access'
            ],
            bestTimeToVisit: 'Spring & Fall',
            averageStay: '2-3 days'
        }
    ];

    // Route information database
    const routeData = {
        'tokyo-osaka': { distance: '515 km', time: '3h 30m', transport: 'Shinkansen', cost: '¥13,320' },
        'tokyo-kyoto': { distance: '476 km', time: '3h 15m', transport: 'Shinkansen', cost: '¥12,710' },
        'osaka-kyoto': { distance: '55 km', time: '45m', transport: 'Express Train', cost: '¥560' },
        'tokyo-yokohama': { distance: '30 km', time: '25m', transport: 'JR Line', cost: '¥290' },
        'tokyo-nagoya': { distance: '366 km', time: '2h 40m', transport: 'Shinkansen', cost: '¥10,560' },
        'tokyo-sapporo': { distance: '830 km', time: '4h 30m', transport: 'Flight', cost: '¥25,000' },
        'tokyo-fukuoka': { distance: '1,175 km', time: '5h 30m', transport: 'Shinkansen', cost: '¥23,390' },
        'osaka-hiroshima': { distance: '340 km', time: '2h 30m', transport: 'Shinkansen', cost: '¥9,420' },
        'kyoto-hiroshima': { distance: '385 km', time: '2h 45m', transport: 'Shinkansen', cost: '¥10,230' }
    };

    // Fetch weather data for a specific city
    const fetchCityWeather = async (city) => {
        try {
            // Mock weather data for demonstration
            return {
                cityId: city.id,
                temp: Math.floor(Math.random() * 25) + 5,
                feelsLike: Math.floor(Math.random() * 25) + 5,
                description: ['clear sky', 'few clouds', 'scattered clouds', 'light rain'][Math.floor(Math.random() * 4)],
                icon: ['01d', '02d', '03d', '10d'][Math.floor(Math.random() * 4)],
                main: ['Clear', 'Clouds', 'Rain'][Math.floor(Math.random() * 3)],
                humidity: Math.floor(Math.random() * 40) + 40,
                windSpeed: Math.floor(Math.random() * 20) + 5,
                pressure: Math.floor(Math.random() * 50) + 1000,
                visibility: Math.floor(Math.random() * 5) + 5,
                sunrise: new Date(),
                sunset: new Date(),
                city: city.name,
                country: 'JP'
            };
        } catch (error) {
            console.error(`Weather fetch failed for ${city.name}:`, error);
            return null;
        }
    };

    // Load weather data for all cities
    useEffect(() => {
        const loadAllWeatherData = async () => {
            setLoadingWeather(true);
            const weatherResults = {};

            for (const city of japanCities) {
                const weather = await fetchCityWeather(city);
                if (weather) weatherResults[city.id] = weather;
            }

            setWeatherData(weatherResults);
            setLoadingWeather(false);
        };

        loadAllWeatherData();
    }, []);

    const getWeatherIcon = (iconCode) => {
        const iconMap = {
            '01d': '☀️', '01n': '🌙', // clear sky
            '02d': '⛅', '02n': '☁️', // few clouds
            '03d': '☁️', '03n': '☁️', // scattered clouds
            '04d': '☁️', '04n': '☁️', // broken clouds
            '09d': '🌧️', '09n': '🌧️', // shower rain
            '10d': '🌦️', '10n': '🌧️', // rain
            '11d': '⛈️', '11n': '⛈️', // thunderstorm
            '13d': '❄️', '13n': '❄️', // snow
            '50d': '🌫️', '50n': '🌫️'  // mist
        };
        return iconMap[iconCode] || '🌤️';
    };

    const getTemperatureColor = (temp) => {
        if (temp <= 0) return '#1976d2'; // blue
        if (temp <= 10) return '#2196f3'; // light blue
        if (temp <= 20) return '#4caf50'; // green
        if (temp <= 30) return '#ff9800'; // orange
        return '#f44336'; // red
    };

    const handleCityClick = (city, isFrom = true) => {
        if (isFrom) {
            setSelectedFromPoint(city);
            setFromLocation(city.name);
        } else {
            setSelectedToPoint(city);
            setToLocation(city.name);
        }
    };

    const handleCityInfoClick = (city) => {
        setSelectedCityInfo(city);
        setShowCityInfo(true);
    };

    const calculateRoute = () => {
        if (!selectedFromPoint || !selectedToPoint) {
            alert('Please select both From and To locations');
            return;
        }

        if (selectedFromPoint.id === selectedToPoint.id) {
            alert('From and To locations cannot be the same');
            return;
        }

        setIsCalculating(true);

        setTimeout(() => {
            const routeKey = `${selectedFromPoint.id}-${selectedToPoint.id}`;
            const reverseRouteKey = `${selectedToPoint.id}-${selectedFromPoint.id}`;

            let route = routeData[routeKey] || routeData[reverseRouteKey];

            if (!route) {
                const distance = Math.floor(Math.random() * 800) + 100;
                const time = Math.floor(distance / 150) + 'h ' + Math.floor(Math.random() * 60) + 'm';
                const cost = '¥' + (Math.floor(distance * 20) + Math.floor(Math.random() * 5000));

                route = {
                    distance: distance + ' km',
                    time: time,
                    transport: distance > 500 ? 'Shinkansen' : 'Express Train',
                    cost: cost
                };
            }

            setRouteInfo({
                from: selectedFromPoint.name,
                to: selectedToPoint.name,
                fromWeather: weatherData[selectedFromPoint.id],
                toWeather: weatherData[selectedToPoint.id],
                ...route
            });

            setIsCalculating(false);
        }, 1500);
    };

    const clearRoute = () => {
        setFromLocation('');
        setToLocation('');
        setSelectedFromPoint(null);
        setSelectedToPoint(null);
        setRouteInfo(null);
    };

    const swapLocations = () => {
        const tempFrom = selectedFromPoint;
        const tempFromName = fromLocation;

        setSelectedFromPoint(selectedToPoint);
        setFromLocation(toLocation);
        setSelectedToPoint(tempFrom);
        setToLocation(tempFromName);
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #e8f5e8 0%, #b3e5fc 100%)',
            padding: '20px',
            fontFamily: 'Arial, sans-serif'
        }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h1 style={{
                    fontSize: '2.5rem',
                    color: '#1976d2',
                    marginBottom: '10px',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}>MAP OF JAPAN</h1>
                <p style={{ fontSize: '1.1rem', color: '#666' }}>
                    CHECK DISTANCE BETWEEN CITIES AND WEATHER ALWAYS SAFE AND ENJOYABLE
                </p>
            </div>

            <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: '350px 1fr',
                gap: '30px',
                alignItems: 'start'
            }}>
                <div style={{
                    background: 'white',
                    borderRadius: '15px',
                    padding: '25px',
                    boxShadow: '0 5px 20px rgba(0, 0, 0, 0.1)',
                    position: 'sticky',
                    top: '20px'
                }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '15px',
                        marginBottom: '20px',
                        alignItems: 'center'
                    }}>
                        <div style={{ width: '100%' }}>
                            <label style={{
                                display: 'block',
                                fontWeight: '600',
                                color: '#333',
                                marginBottom: '5px',
                                fontSize: '0.9rem'
                            }}>From:</label>
                            <input
                                type="text"
                                value={fromLocation}
                                placeholder="Select departure city on map"
                                readOnly
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: `2px solid ${selectedFromPoint ? '#4caf50' : '#e0e0e0'}`,
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    background: selectedFromPoint ? '#e8f5e8' : '#f8f9fa',
                                    boxSizing: 'border-box'
                                }}
                            />
                            {selectedFromPoint && weatherData[selectedFromPoint.id] && (
                                <div style={{ marginTop: '5px', fontSize: '0.9rem', color: '#666' }}>
                                    {getWeatherIcon(weatherData[selectedFromPoint.id].icon)}
                                    {weatherData[selectedFromPoint.id].temp}°C
                                </div>
                            )}
                        </div>

                        <button
                            onClick={swapLocations}
                            title="Swap locations"
                            style={{
                                background: '#2196f3',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                cursor: 'pointer',
                                fontSize: '1.2rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '10px 0'
                            }}
                        >
                            ⇄
                        </button>

                        <div style={{ width: '100%' }}>
                            <label style={{
                                display: 'block',
                                fontWeight: '600',
                                color: '#333',
                                marginBottom: '5px',
                                fontSize: '0.9rem'
                            }}>To:</label>
                            <input
                                type="text"
                                value={toLocation}
                                placeholder="Select destination city on map"
                                readOnly
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: `2px solid ${selectedToPoint ? '#4caf50' : '#e0e0e0'}`,
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    background: selectedToPoint ? '#e8f5e8' : '#f8f9fa',
                                    boxSizing: 'border-box'
                                }}
                            />
                            {selectedToPoint && weatherData[selectedToPoint.id] && (
                                <div style={{ marginTop: '5px', fontSize: '0.9rem', color: '#666' }}>
                                    {getWeatherIcon(weatherData[selectedToPoint.id].icon)}
                                    {weatherData[selectedToPoint.id].temp}°C
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                        <button
                            onClick={calculateRoute}
                            disabled={!selectedFromPoint || !selectedToPoint || isCalculating}
                            style={{
                                flex: 1,
                                padding: '12px',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: '600',
                                cursor: !selectedFromPoint || !selectedToPoint || isCalculating ? 'not-allowed' : 'pointer',
                                background: !selectedFromPoint || !selectedToPoint || isCalculating ? '#cccccc' : '#4caf50',
                                color: 'white'
                            }}
                        >
                            {isCalculating ? 'Calculating...' : 'Calculate Route'}
                        </button>
                        <button
                            onClick={clearRoute}
                            style={{
                                flex: 1,
                                padding: '12px',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                background: '#f44336',
                                color: 'white'
                            }}
                        >
                            Clear
                        </button>
                    </div>

                    <div style={{
                        background: '#f8f9fa',
                        borderRadius: '8px',
                        padding: '15px',
                        textAlign: 'center'
                    }}>
                        <p style={{ margin: 0, color: '#666', fontSize: '0.9rem', fontWeight: '500' }}>
                            {!selectedFromPoint
                                ? "Click a city to select departure point"
                                : !selectedToPoint
                                    ? "Click a city to select destination"
                                    : "Ready to calculate route"
                            }
                        </p>
                    </div>
                </div>

                <div style={{
                    background: 'white',
                    borderRadius: '15px',
                    padding: '20px',
                    boxShadow: '0 5px 20px rgba(0, 0, 0, 0.1)',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        position: 'relative',
                        width: '100%',
                        maxWidth: '800px',
                        margin: '0 auto',
                        aspectRatio: '4/3'
                    }}>
                        <svg viewBox="0 0 100 100" style={{
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            top: 0,
                            left: 0
                        }}>
                            <path
                                d="M25,20 L30,15 L35,18 L40,16 L45,20 L50,18 L55,15 L60,12 L65,15 L70,18 L75,20 L78,25 L80,30 L82,35 L80,40 L78,45 L75,50 L72,55 L70,60 L68,65 L65,68 L60,70 L55,72 L50,75 L45,72 L40,70 L35,68 L30,65 L25,60 L22,55 L20,50 L18,45 L20,40 L22,35 L24,30 L25,25 Z"
                                fill="#f0f8ff"
                                stroke="#2196F3"
                                strokeWidth="0.5"
                            />

                            <ellipse cx="60" cy="15" rx="8" ry="5" fill="#e3f2fd" stroke="#2196F3" strokeWidth="0.3" />
                            <ellipse cx="45" cy="75" rx="6" ry="8" fill="#e3f2fd" stroke="#2196F3" strokeWidth="0.3" />
                            <circle cx="35" cy="95" r="2" fill="#e3f2fd" stroke="#2196F3" strokeWidth="0.3" />
                        </svg>

                        {japanCities.map(city => {
                            const cityWeather = weatherData[city.id];
                            return (
                                <div
                                    key={city.id}
                                    style={{
                                        position: 'absolute',
                                        transform: 'translate(-50%, -50%)',
                                        cursor: 'pointer',
                                        zIndex: 10,
                                        left: `${city.x}%`,
                                        top: `${city.y}%`
                                    }}
                                    onClick={() => {
                                        if (!selectedFromPoint) {
                                            handleCityClick(city, true);
                                        } else if (!selectedToPoint && selectedFromPoint.id !== city.id) {
                                            handleCityClick(city, false);
                                        } else if (selectedFromPoint && selectedToPoint) {
                                            clearRoute();
                                            handleCityClick(city, true);
                                        }
                                    }}
                                    title={`${city.name}, ${city.prefecture}`}
                                >
                                    <div
                                        style={{
                                            width: selectedFromPoint?.id === city.id || selectedToPoint?.id === city.id ? '16px' : '12px',
                                            height: selectedFromPoint?.id === city.id || selectedToPoint?.id === city.id ? '16px' : '12px',
                                            borderRadius: '50%',
                                            background: selectedFromPoint?.id === city.id ? '#4caf50' :
                                                selectedToPoint?.id === city.id ? '#f44336' : '#2196f3',
                                            border: '2px solid white',
                                            boxShadow: selectedFromPoint?.id === city.id ? '0 0 0 4px rgba(76, 175, 80, 0.3)' :
                                                selectedToPoint?.id === city.id ? '0 0 0 4px rgba(244, 67, 54, 0.3)' :
                                                    '0 2px 8px rgba(0, 0, 0, 0.3)',
                                            borderColor: cityWeather ? getTemperatureColor(cityWeather.temp) : 'white'
                                        }}
                                    ></div>

                                    <div style={{
                                        position: 'absolute',
                                        top: '-30px',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        background: 'rgba(0, 0, 0, 0.8)',
                                        color: 'white',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontSize: '0.8rem',
                                        whiteSpace: 'nowrap',
                                        opacity: selectedFromPoint?.id === city.id || selectedToPoint?.id === city.id ? 1 : 0,
                                        pointerEvents: 'none'
                                    }}>
                                        {city.name}
                                        {cityWeather && !loadingWeather && (
                                            <div style={{ fontSize: '0.7rem' }}>
                                                {getWeatherIcon(cityWeather.icon)} {cityWeather.temp}°C
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleCityInfoClick(city);
                                        }}
                                        title="View city information"
                                        style={{
                                            position: 'absolute',
                                            top: '-8px',
                                            right: '-8px',
                                            width: '20px',
                                            height: '20px',
                                            borderRadius: '50%',
                                            border: 'none',
                                            background: '#ff9800',
                                            color: 'white',
                                            fontSize: '10px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        ℹ️
                                    </button>
                                </div>
                            );
                        })}

                        {selectedFromPoint && selectedToPoint && (
                            <svg style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                pointerEvents: 'none',
                                zIndex: 5
                            }} viewBox="0 0 100 100">
                                <line
                                    x1={selectedFromPoint.x}
                                    y1={selectedFromPoint.y}
                                    x2={selectedToPoint.x}
                                    y2={selectedToPoint.y}
                                    stroke="#FF5722"
                                    strokeWidth="0.5"
                                    strokeDasharray="2,1"
                                    style={{
                                        filter: 'drop-shadow(0 0 3px rgba(255, 87, 34, 0.5))'
                                    }}
                                />
                            </svg>
                        )}
                    </div>
                </div>
            </div>

            {/* Route Information Panel */}
            {routeInfo && (
                <div style={{
                    position: 'fixed',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'white',
                    borderRadius: '15px',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                    zIndex: 1000,
                    maxWidth: '600px',
                    width: '90%'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '20px 25px 0 25px'
                    }}>
                        <h3 style={{ margin: 0, color: '#333', fontSize: '1.3rem' }}>Route Information</h3>
                        <button
                            onClick={() => setRouteInfo(null)}
                            style={{
                                background: 'none',
                                border: 'none',
                                fontSize: '1.5rem',
                                color: '#999',
                                cursor: 'pointer',
                                padding: 0,
                                width: '30px',
                                height: '30px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '50%'
                            }}
                        >
                            ×
                        </button>
                    </div>

                    <div style={{ padding: '20px 25px 25px 25px' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '20px',
                            fontSize: '1.2rem',
                            fontWeight: '600'
                        }}>
                            <div>
                                <span style={{ color: '#4caf50' }}>{routeInfo.from}</span>
                                {routeInfo.fromWeather && (
                                    <div style={{ fontSize: '0.8rem', color: '#666' }}>
                                        {getWeatherIcon(routeInfo.fromWeather.icon)} {routeInfo.fromWeather.temp}°C
                                    </div>
                                )}
                            </div>

                            <span style={{ margin: '0 15px', color: '#2196f3', fontSize: '1.5rem' }}>→</span>

                            <div>
                                <span style={{ color: '#f44336' }}>{routeInfo.to}</span>
                                {routeInfo.toWeather && (
                                    <div style={{ fontSize: '0.8rem', color: '#666' }}>
                                        {getWeatherIcon(routeInfo.toWeather.icon)} {routeInfo.toWeather.temp}°C
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                            gap: '15px',
                            marginBottom: '20px'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '10px',
                                background: '#f8f9fa',
                                borderRadius: '8px'
                            }}>
                                <div style={{ fontSize: '1.2rem' }}>📏</div>
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: '#666', fontWeight: '500' }}>Distance</div>
                                    <div style={{ fontSize: '0.9rem', color: '#333', fontWeight: '600' }}>{routeInfo.distance}</div>
                                </div>
                            </div>

                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '10px',
                                background: '#f8f9fa',
                                borderRadius: '8px'
                            }}>
                                <div style={{ fontSize: '1.2rem' }}>⏱️</div>
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: '#666', fontWeight: '500' }}>Travel Time</div>
                                    <div style={{ fontSize: '0.9rem', color: '#333', fontWeight: '600' }}>{routeInfo.time}</div>
                                </div>
                            </div>

                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '10px',
                                background: '#f8f9fa',
                                borderRadius: '8px'
                            }}>
                                <div style={{ fontSize: '1.2rem' }}>🚄</div>
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: '#666', fontWeight: '500' }}>Transport</div>
                                    <div style={{ fontSize: '0.9rem', color: '#333', fontWeight: '600' }}>{routeInfo.transport}</div>
                                </div>
                            </div>

                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '10px',
                                background: '#f8f9fa',
                                borderRadius: '8px'
                            }}>
                                <div style={{ fontSize: '1.2rem' }}>💰</div>
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: '#666', fontWeight: '500' }}>Est. Cost</div>
                                    <div style={{ fontSize: '0.9rem', color: '#333', fontWeight: '600' }}>{routeInfo.cost}</div>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button style={{
                                flex: 1,
                                padding: '12px',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                background: '#2196f3',
                                color: 'white'
                            }} onClick={payment}>
                                Book This Route
                            </button>
                            <button style={{
                                flex: 1,
                                padding: '12px',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                background: '#ff9800',
                                color: 'white'
                            }} onClick={handleRoutesSave}>
                                Save Route
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* City Information Modal */}
            {showCityInfo && selectedCityInfo && (
                <div
                    onClick={() => setShowCityInfo(false)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 2000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px'
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: 'white',
                            borderRadius: '15px',
                            maxWidth: '800px',
                            width: '100%',
                            maxHeight: '90vh',
                            overflow: 'auto'
                        }}
                    >
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '25px 30px',
                            borderBottom: '1px solid #eee'
                        }}>
                            <div>
                                <h2 style={{ margin: 0, color: '#333', fontSize: '2rem' }}>{selectedCityInfo.name}</h2>
                                <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '1.1rem' }}>{selectedCityInfo.prefecture} Prefecture</p>
                            </div>
                            <button
                                onClick={() => setShowCityInfo(false)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '1.8rem',
                                    color: '#999',
                                    cursor: 'pointer',
                                    padding: '5px',
                                    borderRadius: '50%'
                                }}
                            >
                                ×
                            </button>
                        </div>

                        <div style={{ padding: '30px' }}>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: '20px',
                                marginBottom: '30px'
                            }}>
                                <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                                    <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}>Population</div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: '600', color: '#333' }}>{selectedCityInfo.population}</div>
                                </div>
                                <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                                    <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}>Established</div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: '600', color: '#333' }}>{selectedCityInfo.established}</div>
                                </div>
                                <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                                    <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}>Area</div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: '600', color: '#333' }}>{selectedCityInfo.area}</div>
                                </div>
                                <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                                    <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}>Climate</div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: '600', color: '#333' }}>{selectedCityInfo.climate}</div>
                                </div>
                            </div>

                            <div style={{ marginBottom: '30px' }}>
                                <h3 style={{ color: '#333', marginBottom: '15px' }}>About {selectedCityInfo.name}</h3>
                                <p style={{ color: '#666', lineHeight: '1.6', fontSize: '1rem' }}>{selectedCityInfo.description}</p>
                            </div>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                                gap: '30px',
                                marginBottom: '30px'
                            }}>
                                <div>
                                    <h4 style={{ color: '#333', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        🏛️ Top Attractions
                                    </h4>
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                        {selectedCityInfo.attractions.map((attraction, index) => (
                                            <li key={index} style={{
                                                padding: '8px 0',
                                                borderBottom: '1px solid #f0f0f0',
                                                color: '#666'
                                            }}>
                                                • {attraction}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h4 style={{ color: '#333', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        🍜 Local Specialties
                                    </h4>
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                        {selectedCityInfo.specialties.map((specialty, index) => (
                                            <li key={index} style={{
                                                padding: '8px 0',
                                                borderBottom: '1px solid #f0f0f0',
                                                color: '#666'
                                            }}>
                                                • {specialty}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div style={{ marginBottom: '30px' }}>
                                <h4 style={{ color: '#333', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    🏘️ Main Districts
                                </h4>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                                    gap: '15px'
                                }}>
                                    {selectedCityInfo.districts.map((district, index) => (
                                        <div key={index} style={{
                                            background: '#f8f9fa',
                                            padding: '15px',
                                            borderRadius: '8px',
                                            border: '1px solid #e0e0e0'
                                        }}>
                                            <div style={{ fontSize: '0.95rem', color: '#666' }}>{district}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: '20px',
                                background: '#f8f9fa',
                                padding: '20px',
                                borderRadius: '10px'
                            }}>
                                <div>
                                    <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}>Best Time to Visit</div>
                                    <div style={{ fontSize: '1rem', fontWeight: '600', color: '#333' }}>{selectedCityInfo.bestTimeToVisit}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}>Recommended Stay</div>
                                    <div style={{ fontSize: '1rem', fontWeight: '600', color: '#333' }}>{selectedCityInfo.averageStay}</div>
                                </div>
                                {weatherData[selectedCityInfo.id] && (
                                    <div>
                                        <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}>Current Weather</div>
                                        <div style={{ fontSize: '1rem', fontWeight: '600', color: '#333' }}>
                                            {getWeatherIcon(weatherData[selectedCityInfo.id].icon)} {weatherData[selectedCityInfo.id].temp}°C
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {loadingWeather && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    background: 'white',
                    padding: '15px 20px',
                    borderRadius: '10px',
                    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    zIndex: 1000
                }}>
                    <div style={{
                        width: '20px',
                        height: '20px',
                        border: '2px solid #f3f3f3',
                        borderTop: '2px solid #2196f3',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }}></div>
                    <p style={{ margin: 0, color: '#666' }}>Loading weather data...</p>
                </div>
            )}

            <style>
                {`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}
            </style>
        </div>
    );
};

export default MapRouter;