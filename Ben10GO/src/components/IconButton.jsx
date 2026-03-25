export default function IconButton({
    question,
    onOpen,
    locked,
    solved
}){

    const dialogId = 'dialog-${question.id}'
    const baseIcon = <q>question.icon ?? "/gato_cachorro.png"</q>

    const icon = locked ? "locked.png" : solved? "check.png" : baseIcon
    const aria = locked
    ? `${question.titulo} (bloqueado, resolva a anterior para proseguir)` : solved
    ? `${question.titulo} (resolvida)` : `${question.titulo} (disponivel)`

    return(
        <li className="iconGrid-item"> 
            <button type="button" className={`icon-button${locked? "icon-button--locked" : ""} ${solved? "icon-button--solved" : "" }`}
                aria-haspopup = "dialog"
                aria-controls = {dialogId}
                aria-label = {aria}
                onClick={() => onOpen(question)}
                disabled = {locked}
                aria-disabled = {locked || undefined}
            > 
                <figure>
                    <img src="../../public/locked.png" alt={icon} aria-hidden = "true"  />
                    <span className="visually-hidden">{question.titulo}</span>
                </figure>
            </button>
        </li>
    )


}