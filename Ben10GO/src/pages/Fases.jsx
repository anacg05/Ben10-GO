// Importa os dados das perguntas
import Perguntas from '../../public/data/perguntas.json';

// Importa hooks do React
import { useMemo, useState } from 'react';

// Importa componentes
import Mapa from '../components/Mapa/Mapa';
import CaixaQuestoes from '../components/CaixaQuestoes/CaixaQuestoes';

// Importa estilos
import './Fases.css';
import '../index.css';

// Componente principal
export default function Fases() {

    // Questão atualmente selecionada
    const [selecionada, setSelec] = useState(null);

    // Índice máximo desbloqueado
    const [unlockedIndex, setUnlockedIndex] = useState(0);

    // Conjunto de questões resolvidas
    const [solvedSet, setSolvedSet] = useState(() => new Set());

    // Total de perguntas
    const total = Perguntas.length;

    // Abre uma questão
    const handleOpen = (perg) => setSelec(perg);

    // Fecha a questão
    const handleClose = () => setSelec(null);

    // Calcula progresso do jogador
    const progresso = useMemo(() => {

        // Quantidade resolvida
        const solved = solvedSet.size;

        // Retorna dados do progresso
        return {
            solved,
            total,
            percent: Math.round((solved / total) * 100)
        };

    }, [solvedSet, total]);

    // Marca questão como correta
    const handleCorrect = (id) => {
        // Atualiza lista de resolvidas
        setSolvedSet((prev) => {
            const next = new Set(prev);
            next.add(id);
            return next;
        });

        // Busca índice da questão
        const idx = Perguntas.findIndex((q) => q.id === id);

        // Libera próxima questão
        if (idx > -1 && idx < Perguntas.length - 1) {

            setUnlockedIndex((prev) =>
                Math.max(prev, idx + 1)
            );
        }
    };

    return (
        // Estrutura principal
        <main className='app'>
            {/* Cabeçalho */}
            <header className='appHeader'>
                {/* Parte superior */}
                <div className='headerTop'>

                    {/* Marca/logo */}
                    <div className='headerBrand'>
                        {/* Logo animada */}
                        <img
                            src="../../src/assets/images/gif2.gif"
                            alt="Logo Animada Omnitrix"
                            className="headerLogo"
                        />
                        {/* Título */}
                        <h1 className='headerTitle'>
                            Ben 10 <span>GO</span>
                        </h1>
                    </div>

                    {/* Estatísticas */}
                    <div className='headerStats'>
                        {/* Quantidade resolvida */}
                        <span className='progressLabel'>
                            {progresso.solved} / {progresso.total}
                        </span>
                    </div>
                </div>

                {/* Barra de progresso */}
                <div className='progressWrapper'>
                    <div
                        className='progressBar'
                        // Largura dinâmica
                        style={{
                            width: `${progresso.percent}%`
                        }}
                        // Acessibilidade
                        role="progressbar"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={progresso.percent}
                        aria-label={`
                            Progresso: 
                            ${progresso.solved} 
                            de 
                            ${progresso.total} 
                            resolvidas
                        `}
                    />
                </div>
            </header>

            {/* Componente do mapa */}
            <Mapa
                questions={Perguntas}
                onOpen={handleOpen}
                unlockedIndex={unlockedIndex}
                solvedSet={solvedSet}
            />

            {/* Modal de questões */}
            {selecionada && (
                <CaixaQuestoes
                    question={selecionada}
                    index={
                        Perguntas.findIndex(
                            (q) => q.id === selecionada.id
                        )
                    }
                    total={total}
                    onClose={handleClose}
                    onCorrect={handleCorrect}
                />
            )}
        </main>
    );
}