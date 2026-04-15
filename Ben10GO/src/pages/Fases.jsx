import Perguntas from '../../public/data/perguntas.json';
import { useMemo, useState } from 'react';
import Mapa from '../components/Mapa/Mapa';
import CaixaQuestoes from '../components/CaixaQuestoes/CaixaQuestoes';
import './Fases.css';
import '../index.css';

export default function Fases(){
    const [selecionada, setSelec] = useState(null);
    const [unlockedIndex, setUnlockedIndex] = useState(0);
    const [solvedSet, setSolvedSet] = useState(() => new Set());

    const total = Perguntas.length;

    const handleOpen = (perg) => setSelec(perg);
    const handleClose = () => setSelec(null);

    const progresso = useMemo(() => {
        const solved = solvedSet.size;
        return {solved, total, percent: Math.round((solved/total) * 100)};
    }, [solvedSet, total]);

    const handleCorrect = (id) => {
        setSolvedSet((prev) => {
            const next = new Set(prev);
            next.add(id);
            return next;
        });
        const idx = Perguntas.findIndex((q) => q.id === id);
        if(idx > -1 && idx < Perguntas.length - 1){
            setUnlockedIndex((prev) => Math.max(prev, idx + 1));
        }
    };

    return(
        <main className='app'>
            <header className='appHeader'>
                <div className='headerTop'>
                    <div className='headerBrand'>
                        <img src="../../src/assets/images/gif2.gif" alt="Logo Animada Omnitrix" className="headerLogo" />
                        <h1 className='headerTitle'>Ben 10 <span>GO</span></h1>
                    </div>
                    
                    <div className='headerStats'>
                        <span className='progressLabel'>{progresso.solved} / {progresso.total}</span>
                    </div>
                </div>

                <div className='progressWrapper'>
                    <div
                        className='progressBar'
                        style={{width: `${progresso.percent}%`}}
                        role="progressbar"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={progresso.percent}
                        aria-label={`Progresso: ${progresso.solved} de ${progresso.total} resolvidas`}
                    />
                </div>
            </header>

            <Mapa
                questions={Perguntas}
                onOpen={handleOpen}
                unlockedIndex={unlockedIndex}
                solvedSet={solvedSet}
            />

            {selecionada && (
                <CaixaQuestoes
                    question={selecionada}
                    index={Perguntas.findIndex((q) => q.id === selecionada.id)}
                    total={total}
                    onClose={handleClose}
                    onCorrect={handleCorrect}
                />
            )}
        </main>
    );
}