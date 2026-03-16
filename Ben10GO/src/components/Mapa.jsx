import './Mapa.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { useEffect, useState, useRef } from 'react';

import 'leaflet/dist/leaflet.css';


export default function Mapa() {

    const centroInicial = [-22.913933, -47.00000]   // default
    const local = [-22.9137900, -47.0681000];   //SENAI

    const [pontos, setPontos] = useState([]);
    const idRef = useRef(1);

    const [posicao, setPosicao] = useState(null); // posição do usuário
    const [erro, setErro] = useState("");

    const zoomInicial = posicao ? 15 : 13;

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

    function adicionarPontos({ lat, lng }) {
        const novo = {
            id: idRef.current++,
            lat,
            lng,
            distanciaM: calcularDistanciaM({ lat, lng }, local)
        };
        setPontos((prev) => [...prev, novo]);
    }

    function calcularDistanciaM(alvo, origem) {
        if (!origem) return null;
        const a = L.latLng(origem)
        const b = L.latLng(alvo.lat, alvo.lng)
        return a.distanceTo(b);
    }

    function formatarDist(metros) {
        if (metros == null) return "--";
        if (metros < 1000) return `${metros.toFixed(0)} m`;
        return `${(metros / 1000).toFixed(2)} Km`;
    }

    function limparPontos() {
        setPontos([]);
        idRef.current = 1;
    }

    const pontosOrdenados = [...pontos].sort((a, b) => {
        const da = a.distanciaM ?? Infinity;
        const db = b.distanciaM ?? Infinity;
        return da - db;
    })

    return (
        <section className='mapa'>
            <h1>Ben10 GO</h1>
            <p>Apareceu</p>

            {erro && <div>{erro}</div>}

            <section className='painel'>
                <div className='painelTopo'>
                    <h3>Pontos adicionados</h3>
                    <button className='botao' onClick={limparPontos}>Limpar pontos</button>
                </div>

                {pontos.length === 0 ? (
                    <p className='vazio'>Nenhum ponto foi adicionado ainda.</p>
                ) : (
                    <ul className='listaPontos'>
                        {pontosOrdenados.map((p) => (
                            <li key={p.id} className='pontos'>
                                <span>#{p.id}</span>
                                <span>{p.lat.toFixed(5)}, {p.lng.toFixed(5)}</span>
                                <span className='dist'> {formatarDist(p.distanciaM)} </span>
                            </li>
                        ))}

                    </ul>
                )}
            </section>

            <MapContainer
                center={posicao ? [posicao.lat, posicao.lng] : centroInicial}
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
                        position={local}>
                        <Popup>Você está aqui.</Popup>
                    </Marker>
                )}

                {pontos.map((p) => (
                    <Marker key={p.id} position={[p.lat, p.lng]}>
                        <Popup>
                            <div>
                                <span>Ponto: # {p.id}</span>
                                <span>Distância: {formatarDist(p.distanciaM)}</span>
                            </div>
                        </Popup>

                    </Marker>
                ))}

                <ClickHandler onAdd = {adicionarPontos}/>

            </MapContainer>

        </section>
    );
}

function ClickHandler({onAdd}){
    useMapEvents({
        click(e){
            const {lat, lng} = e.latlng;
            onAdd({lat, lng});
        }
    });

    return null;
}