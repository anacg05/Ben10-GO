import './Mapa.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useEffect, useState } from 'react';

import 'leaflet/dist/leaflet.css';


export default function Mapa(){

    const centroInicial = [-22.913933, -47.00000]   // default
    const [posicao, setPosicao] = useState(null); // posição do usuário
    const [erro, setErro] = useState("");

    useEffect(()=>{
        if(!("geolocation" in navigator)){
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

    const zoomInicial = posicao ? 15 : 13;

    return(
        <section className='mapa'>
            <h1>Ben10 GO</h1>
            <p>Apareceu</p>

            {erro && <div>{erro}</div>}

            <MapContainer
                center = {posicao? [posicao.lat, posicao.lng] : centroInicial}
                zoom={zoomInicial}
                scrollWheelZoom={true}
                className='mapaContainer'

            >
                <TileLayer
                    attribution='&copy; OpenStreetMap'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {posicao && (
                    <Marker
                        position={[posicao.lat, posicao.lng]}>
                            <Popup>Você está aqui.</Popup>
                    </Marker>
                )}
                
            </MapContainer>
        </section>
    )






}