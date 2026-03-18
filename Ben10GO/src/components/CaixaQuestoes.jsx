import { useId, useRef, useState } from "react";


 
export default function CaixaQuestoes({ question, index, total, onClose, onCorret, }) {
 
    const titleId = useId();
    const dialogo = useRef(null);
    const closebtnRef = useRef(null);
    const prevFocused = useRef(null);
 
    const [resposta, setResposta] = useState("");
    const [feedback, setFeedback] = useState({ type: "info", msg: "" })
    const [isCorrect, setIsCorrect] = useState(false)
 
 
 
 
    return (
        <>
            <div id={`dialogo-${question.id}`} role="dialog" aria-modal="true" aria-labelledby="{titleId}" className="dialogo" ref={dialogRef}>
                <header className="headerQuestão">
                    <h2 id={titleId} className="questaoTitulo">
                        {question.titulo}
                        <span className="questaoSubtitulo">
                            Pergunta {index + 1} de {total}
                        </span>
                    </h2>
 
                    <button
                        ref={closebtnRef}
                        type="button"
                        className="questaoFechar"
                        aria-label={`Fechar pergunta: ${question.titulo}`}
                        onClick={onClose}
                    >
                        Fechar
                    </button>
 
                </header>
 
            </div>
 
        </>
    )
 
};