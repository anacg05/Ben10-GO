import './Mapa.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';

const baseLat = -22.9137900;
const baseLng = -47.0681000;

const offsets = [
    { lat: -0.0002, lng: -0.0004 },
    { lat: -0.0004, lng: -0.0008 },
    { lat: -0.0009, lng: -0.0007 },
    { lat: -0.0011, lng: -0.0002 },
    { lat: -0.0007, lng: 0.0001 },
    { lat: -0.0005, lng: -0.0003 }
];

function ZoomTracker({ onZoom }) {
    const map = useMapEvents({
        zoom: () => {
            onZoom(map.getZoom());
        }
    });
    return null;
}

export default function Mapa({ questions, onOpen, unlockedIndex, solvedSet }) {
    const [posicao, setPosicao] = useState(null);
    const [erro, setErro] = useState("");
    const [zoomAtual, setZoomAtual] = useState(18);

    useEffect(() => {
        if (!("geolocation" in navigator)) {
            setErro("Seu navegador não tem suporte para geolocalização");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setPosicao({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                });
            },
            () => {
                setErro("Não foi possivel obter localização");
            },
            {
                enableHighAccuracy: true,
                timeout: 8000,
                maximumAge: 0,
            }
        );
    }, []);

    const criarIcone = (question, locked, solved, zoom) => {
        const iconeOmnitrix = `../../public/${question.icon}`;
        const imagemAlien = `../../src/assets/images/${question.imagem || 'img7.png'}`; 
        const imagemAtual = solved ? imagemAlien : iconeOmnitrix;

        const containerClass = solved ? 'mapIcon mapIconSolved' : (locked ? 'mapIcon mapIconLocked' : 'mapIcon');
        const imgClass = solved ? 'mapIconImg imgAlienRevealed' : 'mapIconImg';

        const tamanhoCalculado = Math.max(64, 210 * Math.pow(1.5, zoom - 18));
        const centro = tamanhoCalculado / 2;

        return L.divIcon({
            html: `
                <div class="${containerClass}" style="--size: ${tamanhoCalculado}px;">
                    <img src="${imagemAtual}" class="${imgClass}" alt="${question.titulo}" />
                </div>
            `,
            className: '', 
            iconSize: [tamanhoCalculado, tamanhoCalculado],
            iconAnchor: [centro, centro]
        });
    };

    return (
        <section className='mapaWrapper'>
            {erro && <div className='mapaErro'>{erro}</div>}

            <MapContainer
                center={[baseLat, baseLng]}
                zoom={18}
                scrollWheelZoom={true}
                className='mapaContainer'
                zoomControl={false}
            >
                <ZoomTracker onZoom={setZoomAtual} />
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />

                {posicao && (
                    <Marker position={[posicao.lat, posicao.lng]}>
                        <Popup>Você está aqui</Popup>
                    </Marker>
                )}

                {questions.map((q, idx) => {
                    const locked = idx > unlockedIndex;
                    const solved = solvedSet.has(q.id);
                    
                    const qLat = baseLat + (offsets[idx]?.lat || 0);
                    const qLng = baseLng + (offsets[idx]?.lng || 0);

                    return (
                        <Marker 
                            key={q.id} 
                            position={[qLat, qLng]}
                            icon={criarIcone(q, locked, solved, zoomAtual)}
                            eventHandlers={{
                                click: () => {
                                    if (!locked) onOpen(q);
                                }
                            }}
                        />
                    );
                })}
            </MapContainer>
        </section>
    );
}