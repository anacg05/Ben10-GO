// Importações principais
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// Imagem do relógio
import imgRelogio from '../../assets/images/img2.png';

// Estilos
import 'leaflet/dist/leaflet.css';
import './Mapa.css';

// Coordenadas base do mapa
const baseLat = -22.9137900;
const baseLng = -47.0681000;

// Ajustes de posição dos marcadores
const offsets = [
    { lat: -0.0003, lng: -0.0006 },
    { lat: -0.0006, lng: -0.0012 },
    { lat: -0.0014, lng: -0.0011 },
    { lat: -0.0017, lng: -0.0003 },
    { lat: -0.0011, lng: 0.0002 },
    { lat: -0.0008, lng: -0.0005 }
];

// Componente para monitorar o zoom do mapa
function ZoomTracker({ onZoom }) {
    const map = useMapEvents({
        zoom: () => {
            onZoom(map.getZoom());
        }
    });

    return null;
}

// Componente principal
export default function Mapa({ questions, onOpen, unlockedIndex, solvedSet }) {

    // Estado da posição do usuário
    const [posicao, setPosicao] = useState(null);

    // Estado de erro da geolocalização
    const [erro, setErro] = useState("");

    // Estado do zoom atual do mapa
    const [zoomAtual, setZoomAtual] = useState(18);

    // Estado para controlar o arrasto do Omnitrix
    const [isDragging, setIsDragging] = useState(false);

    // Obtém localização do usuário
    useEffect(() => {

        // Verifica suporte do navegador
        if (!("geolocation" in navigator)) {
            setErro("Seu navegador não tem suporte para geolocalização");
            return;
        }

        // Busca posição atual
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setPosicao({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                });
            },

            // Caso dê erro
            () => {
                setErro("Não foi possivel obter localização");
            },

            // Configurações da geolocalização
            {
                enableHighAccuracy: true,
                timeout: 8000,
                maximumAge: 0,
            }
        );

    }, []);

    // Cria ícone personalizado dos aliens
    const criarIcone = (question, locked, solved, zoom) => {

        // Caminho das imagens
        const iconeOmnitrix = `../../public/${question.icon}`;
        const imagemAlien = `../../src/assets/images/${question.imagem || 'img7.png'}`;

        // Define imagem atual
        const imagemAtual = solved ? imagemAlien : iconeOmnitrix;

        // Define classes CSS
        const containerClass = solved
            ? 'mapIcon mapIconSolved'
            : (locked ? 'mapIcon mapIconLocked' : 'mapIcon');

        const imgClass = solved
            ? 'mapIconImg imgAlienRevealed'
            : 'mapIconImg';

        // Calcula tamanho baseado no zoom
        const tamanhoCalculado = Math.max(48, 240 * Math.pow(1.5, zoom - 18));

        // Centro do ícone
        const centro = tamanhoCalculado / 2;

        // Retorna ícone customizado
        return L.divIcon({
            html: `
                <div 
                    class="${containerClass}" 
                    style="--size: ${tamanhoCalculado}px;" 
                    data-question-id="${question.id}" 
                    data-locked="${locked}"
                >
                    <img 
                        src="${imagemAtual}" 
                        class="${imgClass}" 
                        alt="${question.titulo}" 
                    />
                </div>
            `,
            className: '',
            iconSize: [tamanhoCalculado, tamanhoCalculado],
            iconAnchor: [centro, centro]
        });
    };

    // Detecta onde o Omnitrix foi solto
    const handleDragEnd = (event, info) => {

        // Coordenadas do drop
        const dropX = info.point.x;
        const dropY = info.point.y;

        // Elementos abaixo do dedo/mouse
        const elementosSobODedo = document.elementsFromPoint(dropX, dropY);

        // Percorre os elementos encontrados
        for (let elemento of elementosSobODedo) {

            // Dados do marcador
            const questionId = elemento.getAttribute('data-question-id');
            const isLocked = elemento.getAttribute('data-locked') === 'true';

            // Verifica se encontrou um marcador
            if (questionId) {

                // Se estiver desbloqueado
                if (!isLocked) {

                    const questaoAlvo = questions.find(
                        q => String(q.id) === String(questionId)
                    );

                    // Abre a questão
                    if (questaoAlvo) {
                        onOpen(questaoAlvo);
                    }

                } else {

                    // Caso esteja bloqueado
                    console.log("Este alien ainda está bloqueado!");
                }

                break;
            }
        }
    };

    return (
        <section className='mapaWrapper'>

            {/* Mensagem de erro */}
            {erro && <div className='mapaErro'>{erro}</div>}

            {/* Mapa principal */}
            <MapContainer
                center={[-22.9155, -47.0684]}
                zoom={18}
                scrollWheelZoom={true}
                className='mapaContainer'
                zoomControl={false}
            >

                {/* Atualiza zoom */}
                <ZoomTracker onZoom={setZoomAtual} />

                {/* Camada visual do mapa */}
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; OpenStreetMap contributors &copy; CARTO'
                />

                {/* Marcador da localização do usuário */}
                {posicao && (
                    <Marker
                        position={[posicao.lat, posicao.lng]}
                        icon={L.divIcon({
                            className: 'userTrackerMarker',
                            html: `<div class="trackerDot"></div>`,
                            iconSize: [24, 24],
                            iconAnchor: [12, 12]
                        })}
                    >
                        <Popup>Sua Localização</Popup>
                    </Marker>
                )}

                {/* Marcadores das questões */}
                {questions.map((q, idx) => {

                    // Verifica bloqueio
                    const locked = idx > unlockedIndex;

                    // Verifica se foi resolvida
                    const solved = solvedSet.has(q.id);

                    // Calcula posição
                    const qLat = baseLat + (offsets[idx]?.lat || 0);
                    const qLng = baseLng + (offsets[idx]?.lng || 0);

                    return (
                        <Marker
                            key={q.id}
                            position={[qLat, qLng]}
                            icon={criarIcone(q, locked, solved, zoomAtual)}
                        />
                    );
                })}
            </MapContainer>

            {/* Container do Omnitrix */}
            <div className="omnitrixContainer">

                {/* Dica de arrastar */}
                <div className={`dragHint ${isDragging ? 'escondido' : ''}`}>

                    {/* Ícone da seta */}
                    <svg
                        className="dragHintArrow"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M12 19V5M5 12l7-7 7 7" />
                    </svg>

                    {/* Texto da dica */}
                    <span className="dragHintText">
                        ARRASTE
                    </span>
                </div>

                {/* Imagem arrastável */}
                <motion.img
                    src={imgRelogio}
                    alt="Omnitrix Drag"
                    className="omnitrixDraggable"

                    // Ativa drag
                    drag

                    // Faz voltar ao local inicial
                    dragSnapToOrigin={true}

                    // Animação durante o arrasto
                    whileDrag={{
                        scale: 1.15,
                        cursor: "grabbing"
                    }}

                    // Movimento flutuante
                    animate={{
                        y: [0, -12, 0]
                    }}

                    // Configuração da animação
                    transition={{
                        y: {
                            duration: 2.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }
                    }}

                    // Quando toca no relógio
                    onPointerDown={() => setIsDragging(true)}

                    // Quando solta sem arrastar
                    onPointerUp={() => setIsDragging(false)}

                    // Quando inicia arrasto
                    onDragStart={() => setIsDragging(true)}

                    // Quando termina arrasto
                    onDragEnd={(event, info) => {
                        setIsDragging(false);
                        handleDragEnd(event, info);
                    }}
                />
            </div>
        </section>
    );
}