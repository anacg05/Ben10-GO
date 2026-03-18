import { useState } from "react"

import questoes from "../../public/data/perguntas.json"
import Caixaquestoes from "../components/CaixaQuestoes"
import Grid from "../components/Grid"
 
 
export default function Fases(){
 
    const [selecionada, setSelecionada] = useState (null);
 
    const handleOpen = (quest) => setSelecionada (quest);
    const handleClose = () => setSelecionada (null);
 
    return(
        <main className="app">
            <header>
                <h1>Ben10 GO </h1>
            </header>
 
            {selecionada && <p>{selecionada.prompt}</p>}
            <button onClick={ ()=>
                setSelecionada(questoes[0])}>
                    Abrir perguntas
 
            </button>
        </main>
    )
 
}