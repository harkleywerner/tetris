import Tetris from "./tetris.js"
import HtmlTetrisRender from "./HtmlTetrisRender.js"
import audiosTetris from "./audioTetris.js"
import propiedades from "./propiedades.js"

const {
    MAX_TABLA_X
} = propiedades



const htmlRender = new HtmlTetrisRender()

class Controles extends Tetris {
    constructor(tetrisEstado) {
        super()
        this.pieza = tetrisEstado.pieza
        this.player = tetrisEstado.player
        this.tablero = tetrisEstado.tablero
        this.intervalo = tetrisEstado.intervalo
    }


    constrolesTeclados() {
        window.addEventListener("keydown", (e) => {
            this.controles(e.key)
        })
    }

    controlesMouse() {

        const playArea = document.querySelector(".play-area")
        playArea.addEventListener("click", (e) => {
            this.controles("click")
        })

        playArea.addEventListener("mousemove", (e) => {
            const rect = playArea.getBoundingClientRect();
            const cordX = Math.round(e.clientX - rect.left)
            const widthIndividual = playArea.clientWidth / MAX_TABLA_X
            const largoFormaX = this.pieza.forma[0].length
            const operacion = Math.abs(largoFormaX - MAX_TABLA_X)

            super.lugar({ remove: true })
            super.lugar({ remove: true, colisionFutura: true })

            for (let x = 0; x < MAX_TABLA_X; x++) {
                const inicioX = widthIndividual * x;
                const finalX = inicioX + widthIndividual;

                if (cordX >= inicioX && cordX <= finalX) {

                    const validacion = x >= operacion ? operacion : x
                    const checking = this.checkeo({ dx: validacion - this.pieza.x })
                    if (checking == undefined) {
                        return
                    }
                    else {
                        this.pieza.x = validacion
                        break
                    }
                }

            }
            super.colisionFutura()
            this.controles("mousemove")
        })

    }

    controles(tipo) {

        if (["s", "a", "d", "click", "e", "f", "mousemove"].includes(tipo) && this.player.pausa) return

        switch (tipo) {
            case "Escape":
                
        console.log(this.player.pausa)
                super.pausa()
                break
            case "s":
                super.move({ dy: 1 })
                break;
            case "a":
                super.move({ dx: -1 })
                break;
            case "f":
                if (!this.player.sostenerForma) return
                super.lugar({ remove: true })
                super.lugar({ remove: true, colisionFutura: true })
                this.player.formaSostenida = this.pieza.rotacion
                this.player.indexSotenido = this.pieza.indice
                console.log(this.player.formaSostenida)
                this.player.sostenerForma = false
                htmlRender.bloquesSostenidosRender({ forma: this.player.formaSostenida[1], indice: this.player.indexSotenido })
                htmlRender.bloquesSiguientesRender(this.pieza.siguientesFormas)
                super.eliminarPieza()
                super.move()
                audiosTetris.bloqueSostenido.play()
                audiosTetris.bloqueSostenido.currentTime = 0
                break;
            case "d":
                super.move({ dx: 1 })
                break;
            case "click":
                super.lugar({ remove: true })
                this.pieza.y = this.pieza.colisionY
                super.lugar({ colisionFutura: true })
                super.move({ dy: 1 })
                break;
            case "mousemove":
                super.move()

                break
            case "r":
                super.lugar({ remove: true })
                super.lugar({ remove: true, colisionFutura: true })
                super.rotarPieza()
                super.colisionFutura()
                super.lugar({ colisionFutura: true })
                super.move()
                break;
        }

    }

    inciarControles() {
        this.controles()
        this.constrolesTeclados()
        this.controlesMouse()
    }

}

export default Controles