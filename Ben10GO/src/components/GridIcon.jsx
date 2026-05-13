// Importa o componente do botão
import IconButton from "./IconButton"

// Componente principal
export default function GridIcon({
    questions,
    onOpen,
    modalOpen,
    unlockedIndex,
    solvedSet
}) {

    return (

        // Container da grade de ícones
        <section
            aria-hidden={modalOpen || undefined}
            inert={modalOpen ? "" : undefined}
            className="iconGrid-container"
        >

            {/* Lista de ícones */}
            <ul className="icon-grid">

                {/* Percorre todas as questões */}
                {questions.map((q, idx) => {

                    // Verifica se está bloqueado
                    const locked = idx > unlockedIndex;

                    // Verifica se foi resolvido
                    const solved = solvedSet.has(q.id);

                    return (
                        // Botão do alien
                        <IconButton
                            key={q.id}
                            question={q}
                            onOpen={onOpen}
                            locked={locked}
                            solved={solved}
                        />
                    )
                })}
            </ul>
        </section>
    )
}