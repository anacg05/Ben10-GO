import { useRef, useState, useId, useEffect } from "react";

export default function CaixaQuestoes({ question, index, total, onClose, onCorrect, }) {

    const titleId = useId();
    const dialogoRef = useRef(null);
    const closeBtnRef = useRef(null);
    const pervFocused = useRef(null);

    const [resposta, setReposta] = useState("");
    const [feedback, setFeedBack] = useState({ type: "info", msg: "" });
    const [isCorrect, setIsCorret] = useState(false);

    const normalize = (s) => (s ?? "")
        .toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[.,;:!?()\"'`^~]/g, "")
        .trim()
        .toLowerCase()

    const handleSubmit = (e) => {
        e.preventDefault()

        const user = normalize(resposta)
        const ok = (question.resposta || []).some(
            (ans) => normalize(ans) === user
        )
        if (ok) {
            setIsCorret(true)
            setFeedBack({ type: "success", msg: "Resposta correta! Proxima pergunta liberada!" })
        } else {
            setIsCorret(false)
            setFeedBack({ type: "error", msg: "Não foi dessa vez. Tente novamente" })
        }
    }

    useEffect(() => {
        pervFocused.current = document.activeElement;
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        closeBtnRef.current?.focus();

        const onKey = (e) => {
            if (e.key === "Escape") onClose();
        }
        window.addEventListener("keydown", onKey);

        return () => {
            document.body.style.overflow = prevOverflow;
            window.removeEventListener("keydown", onKey);
            if (pervFocused.current instanceof HTMLElement) {
                pervFocused.current.focus()
            }
        };
    }, [onClose]);

    return (
        <>
            <div id={`dialogo-${question.id}`} role="dialog" aria-modal="true" aria-labelledby={titleId} className="dialogo" ref={dialogoRef}>
                <header className="header-pergunta">
                    <h2 id={titleId} className="tituloPergunta">
                        {question.titulo}
                        <span className="subtituloPergunta">Pergunta {index + 1} de {total}</span>
                    </h2>

                    <button ref={closeBtnRef} type="button" className="btnFecha" aria-label={`Fechar pergunta: ${question.titulo}`} onClick={onClose}></button>
                </header>
            </div>

            <div className="dialog-card">
                <p className="question-prompt">{question.prompt}</p>

                <form className="question-form" onSubmit={handleSubmit}>
                    <label htmlFor="resposta" className="question-label">
                        Sua resposta:
                    </label>
                    <input
                        id="resposta"
                        className="question-input"
                        type="text"
                        autoComplete="off"
                        aria-describedby="feedback"
                        aria-invalid={feedback.type === "error" ? "true" : "false"}
                        value={resposta}
                        onChange={(e) => setReposta(e.target.value)}
                        disabled={isCorrect}
                        placeholder="Escreva sua resposta aqui"

                    />

                    <div id="feedback" className={`question-feedback question-feedback--${feedback.type}`}
                        aria-live="polite">
                        {feedback.msg}
                    </div>

                    {!isCorrect ? (
                        <div className="question-actions">
                            <button type="submit" className="btn btn-primary">
                                Confirmar
                            </button>
                            <button type="button" className="btn" onClick={onClose}>
                                Voltar
                            </button>
                        </div>
                    ) : (
                        <div className="question-actions">
                            <button
                                type="button"
                                className="btn btn-success"
                                onClick={() => {
                                    onCorrect(question.id)
                                    onClose();
                                }}
                                aria-label="Avançar para a próxima pergunta">
                                Avançar
                            </button>
                        </div>
                    )}
                </form>

                {question.dica && <p className="question-hint"> Dica: {question.dica}</p>}

            </div>
        </>
    )

}