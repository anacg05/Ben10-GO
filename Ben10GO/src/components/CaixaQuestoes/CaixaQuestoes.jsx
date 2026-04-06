import { useRef, useState, useId, useEffect } from "react";
import './CaixaQuestoes.css';

export default function CaixaQuestoes({ question, index, total, onClose, onCorrect }) {
    const titleId = useId();
    const dialogoRef = useRef(null);
    const closeBtnRef = useRef(null);
    const pervFocused = useRef(null);

    const [resposta, setReposta] = useState("");
    const [feedback, setFeedBack] = useState({ type: "", msg: "" });
    const [isCorrect, setIsCorret] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!resposta) return;

        const respostaCorreta = Array.isArray(question.resposta) 
            ? question.resposta[0] 
            : question.resposta;

        if (resposta === respostaCorreta) {
            setIsCorret(true);
            setFeedBack({ type: "success", msg: "Dados genéticos confirmados! Novo alienígena libertado!" });
        } else {
            setIsCorret(false);
            setFeedBack({ type: "error", msg: "Sequência incorreta. Tente novamente." });
        }
    };

    useEffect(() => {
        pervFocused.current = document.activeElement;
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        closeBtnRef.current?.focus();

        const onKey = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);

        return () => {
            document.body.style.overflow = prevOverflow;
            window.removeEventListener("keydown", onKey);
            if (pervFocused.current instanceof HTMLElement) {
                pervFocused.current.focus();
            }
        };
    }, [onClose]);

    const imagemAlien = `../../src/assets/images/${question.imagem || 'img7.png'}`;
    
    const opcoesDisponiveis = question.opcoes || [];

    return (
        <div id={`dialogo-${question.id}`} role="dialog" aria-modal="true" aria-labelledby={titleId} className="dialogo" ref={dialogoRef}>
            <div className="dialogOverlay" onClick={onClose}></div>
            <div className="dialogCard">
                <header className="headerPergunta">
                    <div>
                        <h2 id={titleId} className="tituloPergunta">
                            {question.titulo}
                        </h2>
                        <span className="subtituloPergunta">Base de Dados {index + 1} de {total}</span>
                    </div>
                    <button ref={closeBtnRef} type="button" className="btnFecha" aria-label="Fechar" onClick={onClose}>X</button>
                </header>

                <div className="cardLayout">
                    <div className="cardInfo">
                        <p className="questionPrompt">{question.prompt}</p>

                        <form className="questionForm" onSubmit={handleSubmit}>
                            {opcoesDisponiveis.length > 0 ? (
                                <div className="optionsGrid">
                                    {opcoesDisponiveis.map((opcao) => (
                                        <button
                                            key={opcao}
                                            type="button"
                                            className={`optionBtn ${resposta === opcao ? "optionBtnSelected" : ""}`}
                                            onClick={() => setReposta(opcao)}
                                            disabled={isCorrect}
                                        >
                                            {opcao}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <p style={{ color: "red" }}>Aviso: Adicione o campo "opcoes" no perguntas.json</p>
                            )}

                            {feedback.msg && (
                                <div className={`questionFeedback ${feedback.type === "success" ? "questionFeedbackSuccess" : "questionFeedbackError"}`} aria-live="polite">
                                    {feedback.msg}
                                </div>
                            )}

                            {!isCorrect ? (
                                <div className="questionActions">
                                    <button type="submit" className="btn btnPrimary" disabled={!resposta}>
                                        Analisar DNA
                                    </button>
                                </div>
                            ) : (
                                <div className="questionActions">
                                    <button
                                        type="button"
                                        className="btn btnPrimary"
                                        onClick={() => {
                                            onCorrect(question.id);
                                            onClose();
                                        }}
                                    >
                                        Sincronizar Omnitrix
                                    </button>
                                </div>
                            )}
                        </form>
                        {question.dica && <p className="questionHint">Dica do Rastreador: {question.dica}</p>}
                    </div>

                    <div className="cardImageContainer">
                        <img src={imagemAlien} alt="Alien" className="alienCardImage" />
                    </div>
                </div>
            </div>
        </div>
    );
}