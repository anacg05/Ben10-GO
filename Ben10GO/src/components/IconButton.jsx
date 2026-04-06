export default function IconButton({
    question,
    onOpen,
    locked,
    solved
}) {
    const dialogId = `dialog-${question.id}`
    const iconeOmnitrix = `../../public/${question.icon}`
    const imagemAlien = `../../src/assets/images/${question.imagem}`
    
    const imagemAtual = solved ? imagemAlien : iconeOmnitrix
    
    const ariaInfo = locked
        ? `${question.titulo} (bloqueado, resolva a anterior para prosseguir)`
        : solved
        ? `${question.titulo} (resolvida)`
        : `${question.titulo} (disponível)`

    return (
        <li className="iconGridItem"> 
            <button
                type="button"
                className={`iconButton ${locked ? "iconButtonLocked" : ""} ${solved ? "iconButtonSolved" : ""}`}
                aria-haspopup="dialog"
                aria-controls={dialogId}
                aria-label={ariaInfo}
                onClick={() => onOpen(question)}
                disabled={locked}
                aria-disabled={locked || undefined}
            > 
                <figure className="iconFigure">
                    <img
                        src={imagemAtual}
                        alt={ariaInfo}
                        aria-hidden="true"
                        className={`iconButtonImg ${solved ? "imgAlienRevealed" : ""}`}
                    />
                    <span className="visuallyHidden">{question.titulo}</span>
                </figure>
            </button>
        </li>
    )
}