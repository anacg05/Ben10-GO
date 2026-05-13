// Componente do botão do alien
export default function IconButton({
    question,
    onOpen,
    locked,
    solved
}) {

    // ID do dialog relacionado
    const dialogId = `dialog-${question.id}`

    // Caminho do ícone padrão
    const iconeOmnitrix = `../../public/${question.icon}`

    // Caminho da imagem do alien
    const imagemAlien = `../../src/assets/images/${question.imagem}`

    // Define qual imagem será exibida
    const imagemAtual = solved
        ? imagemAlien
        : iconeOmnitrix

    // Texto de acessibilidade
    const ariaInfo = locked
        ? `${question.titulo} (bloqueado, resolva a anterior para prosseguir)`
        : solved
            ? `${question.titulo} (resolvida)`
            : `${question.titulo} (disponível)`

    return (

        // Item da lista
        <li className="iconGridItem">

            {/* Botão do alien */}
            <button
                type="button"

                className={`
                    iconButton 
                    ${locked ? "iconButtonLocked" : ""} 
                    ${solved ? "iconButtonSolved" : ""}
                `}

                aria-haspopup="dialog"
                aria-controls={dialogId}
                aria-label={ariaInfo}

                // Abre o modal
                onClick={() => onOpen(question)}

                // Bloqueia o botão
                disabled={locked}
                aria-disabled={locked || undefined}
            >

                {/* Área da imagem */}
                <figure className="iconFigure">

                    {/* Imagem do botão */}
                    <img
                        src={imagemAtual}
                        alt={ariaInfo}
                        aria-hidden="true"

                        className={`
                            iconButtonImg 
                            ${solved ? "imgAlienRevealed" : ""}
                        `}
                    />

                    {/* Texto oculto para acessibilidade */}
                    <span className="visuallyHidden">
                        {question.titulo}
                    </span>
                </figure>
            </button>
        </li>
    )
}