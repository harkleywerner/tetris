import audiosTetris from "./audioTetris.js"
import propiedades from "./propiedades.js"

const {
    BloqueIndices,
    BloqueActualIndice,
} = propiedades


class HtmlTetrisRender {


    estadisticasRender(player) {
        document.querySelector(".score-numero").textContent = player.score * 100
        document.querySelector(".nivel-numero").textContent = `${player.nivel}/10`
        document.querySelector(".linea-numero").textContent = player.lineasRemovidas
    }

    tableroRender(tablero, pieza) {
        const tableroHTML = document.querySelector(".play-area")
        tableroHTML.replaceChildren("")

        const fragmento = document.createDocumentFragment()
        for (let i = 0; i < tablero.length; i++) {
            const filaElemento = document.createElement("div")
            const fila = tablero[i]

            if (i == 0) {
                filaElemento.classList.add("final")
            } else {
                filaElemento.classList.add("filas")
            }

            for (let j = 0; j < fila.length; j++) {
                const columna = fila[j]
                const columnaElemento = document.createElement("div")

                if (BloqueIndices.includes(columna)) {
                    columnaElemento.classList.add(`bloque${columna}`)
                }
                else if (BloqueActualIndice == columna) {
                    columnaElemento.classList.add(`bloque${pieza.indice}`)
                }
                else if (columna == 9) {
                    columnaElemento.classList.add(`bloque-futuro${pieza.indice}`)
                    columnaElemento.classList.add(`bloque-futuro`)

                }
                columnaElemento.classList.add("bloque")

                columnaElemento.style.gridColumnStart = `${j + 1}`;
                columnaElemento.style.gridColumnEnd = `${j + 2}`;
                filaElemento.appendChild(columnaElemento)
            }
            fragmento.appendChild(filaElemento)
            tableroHTML.appendChild(fragmento)
        }
    }

    bloquesSostenidosRender({ forma, indice }) {


        const elemento = "bloque-hold"
        const bloqueSiguientes = document.getElementById(elemento)
        bloqueSiguientes.replaceChildren("")

        this.formasLateralesRender({ forma, indice, elemento })
    }

    bloquesSiguientesRender(siguientesFormas) {

        const elemento = "next-bloque"
        const bloqueSiguientes = document.getElementById(elemento)
        bloqueSiguientes.replaceChildren("")

        for (const key in siguientesFormas) {
            const forma = siguientesFormas[key].forma[1]
            const indice = siguientesFormas[key].indice
            this.formasLateralesRender({ forma, indice, elemento })
        }
    }

    formasLateralesRender({ forma, indice, elemento }) {

        const elementoRender = document.getElementById(elemento)
        const newElement = document.createElement("div")

        for (let y = 0; y < forma.length; y++) {
            const filaElemento = document.createElement("div")
            filaElemento.classList.add("row")
            filaElemento.classList.add("aling-items-center")
            filaElemento.classList.add("justify-content-center")


            for (let x = 0; x < forma[y].length; x++) {

                const columnaElemento = document.createElement("div")

                if (forma[y][x] == 0) {
                    columnaElemento.classList.add(`bloque${indice}`)
                } else {
                    columnaElemento.classList.add("border-0")
                }

                columnaElemento.classList.add(`bloque`)
                columnaElemento.classList.add(`col-${2}`)
                filaElemento.appendChild(columnaElemento)
            }

            newElement.appendChild(filaElemento)
            newElement.classList.add("container")

        }

        elementoRender.appendChild(newElement)
    }


    pauseRender(player) {
        const modal = document.getElementById('modal-pausa');
        const modalScore = document.getElementById("modal-score")
        modalScore.textContent = `Score : ${player.score * 100}`
        const modalBoostrap = new bootstrap.Modal(modal, { backdrop: 'static' });

   
        const pauseEffect = audiosTetris.pause
        pauseEffect.currentTime = 0

        if (player.pausa) {
            pauseEffect.play()
            modalBoostrap.show();
        } else {
            modal.style.display = "none"
            modal.classList.remove("fade")
            pauseEffect.play()

        }

    }


}


export default HtmlTetrisRender