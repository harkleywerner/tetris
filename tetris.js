import HtmlTetrisRender from "./HtmlTetrisRender.js"
import { bloqueRandom } from "./listaDeBloques.js"
import audiosTetris from "./audioTetris.js"
import propiedades from "./propiedades.js"

const {
    MAX_TABLA_Y,
    MAX_TABLA_X,
    LIMITE_HOLD_POR_BLOQUE_COLOCADO,
    BloqueActualIndice,
    BloqueVacioIndice,
    BloqueFuturoIndice,
    BloqueIndices
} = propiedades


const htmlRender = new HtmlTetrisRender()

const tableroDefault = Array.from({ length: MAX_TABLA_Y }, (_, index) => {
    return Array.from({ length: MAX_TABLA_X }, (_, i) => -1)
})

class Tetris {
    constructor() {
        this.tablero = JSON.parse(JSON.stringify(tableroDefault))
        this.intervalo = null
    }

    estadisticas() {

        this.player = {
            score: 0,
            nivel: 1,
            bloquesColocados: 0,
            lineasRemovidas: 0,
            sostenerForma: true,
            formaSostenida: [],
            indexSotenido: null,
            pausa: false,
            finalizado: false
        }

    }



    generarBloquesRandom(contador, bloques = {}) {

        if (contador <= 0) return bloques
        const bloque = bloqueRandom()
        const objects = {
            ...bloques,
            [contador]: bloque
        }
        contador--;
        return this.generarBloquesRandom(contador, objects)
    }

    generarPieza() {

        const listado = this.generarBloquesRandom(4)
        const { indice, forma } = bloqueRandom()

        this.pieza = {
            y: 0,
            x: 3,
            indice: indice,
            colisionY: null,
            rotacionN: 1,
            rotacion: forma,
            forma: forma[1],
            siguientesFormas: listado,
        }
    }

    checkeoRotacion() {
        const rotaciones = this.pieza.rotacion

        const indexRotacion = this.pieza.rotacionN

        const largo = Object.keys(rotaciones).length

        const piezaY = this.pieza.y

        const piezaX = this.pieza.x

        const verificarIndices = indexRotacion + 1 <= largo ? indexRotacion + 1 : 1

        const bloqueFuturo = rotaciones[verificarIndices]

        for (let y = 0; y < bloqueFuturo.length; y++) {

            for (let x = 0; x < bloqueFuturo[y].length; x++) {

                if (piezaY + y >= MAX_TABLA_Y || BloqueIndices.includes(this.tablero[y + piezaY][x + piezaX]) || piezaX + x >= MAX_TABLA_X) {
                    return undefined
                }
            }
        }

        return true
    }

    rotarPieza() {

        const checking = this.checkeoRotacion()

        if (!checking) return

        const rotaciones = this.pieza.rotacion

        const indexRotacion = this.pieza.rotacionN

        const largo = Object.keys(rotaciones).length

        if (indexRotacion + 1 <= largo) {
            this.pieza.rotacionN = indexRotacion + 1
            this.pieza.forma = rotaciones[indexRotacion + 1]
        } else {
            this.pieza.rotacionN = 1
            this.pieza.forma = rotaciones[1]
        }
        return true
    }

    pausa() {
        htmlRender.pauseRender(this.player)
     
        if (this.player.pausa) {
            this.detenerIntervalo()
        }
        else this.iniciarIntervalo()

    }

    eliminarPieza() {

        const lista = this.pieza.siguientesFormas

        const nuevoBloque = bloqueRandom()

        const bloquesKeys = Object.keys(lista)

        const nuevoListado = {
            [bloquesKeys.length]: nuevoBloque
        }

        for (const key in lista) {
            if (key - 1 >= 1) {
                nuevoListado[key - 1] = lista[key]
            }
        }

        this.pieza.y = 0
        this.pieza.x = 3
        this.pieza.rotacionN = 1
        this.pieza.indice = lista[1].indice
        this.pieza.rotacion = lista[1].forma
        this.pieza.colisionY = null
        this.pieza.forma = lista[1].forma[1]
        this.pieza.siguientesFormas = nuevoListado

    }

    lugar({ remove = false, sticky = false, colisionFutura = false } = {}) {

        const pieza = this.pieza
        const forma = this.pieza.forma

        for (let y = 0; y < forma.length; y++) {

            for (let x = 0; x < forma[y].length; x++) {

                const nuevoX = pieza.x + x
                const nuevoY = pieza.y + y

                if (forma[y][x] == BloqueActualIndice) {
                    if (colisionFutura && [BloqueVacioIndice, BloqueFuturoIndice].includes(this.tablero[y + this.pieza.colisionY][nuevoX])) {
                        this.tablero[y + this.pieza.colisionY][nuevoX] = remove ? BloqueVacioIndice : BloqueFuturoIndice

                    } else {
                        this.tablero[nuevoY][nuevoX] = remove ? BloqueVacioIndice : sticky ? this.pieza.indice : forma[y][x]
                    }
                }
            }
        }
    }

    checkeo({ dx = 0, dy = 0 } = {}) {
        const forma = this.pieza.forma
        const ejesX = this.pieza.x
        const ejesY = this.pieza.y


        for (let y = 0; y < forma.length; y++) {

            for (let x = 0; x < forma[y].length; x++) {
                const nuevoX = x + dx + ejesX
                const nuevoY = y + dy + ejesY

                if (forma[y][x] == BloqueActualIndice) {

                    if (BloqueIndices.includes(this.tablero[y + ejesY][(x + ejesX) + dx]) || nuevoX < 0 || nuevoX >= MAX_TABLA_X) {
                        return undefined
                    }


                    if (nuevoY >= MAX_TABLA_Y || BloqueIndices.includes(this.tablero[nuevoY][nuevoX])) {
                        return false
                    }
                }
            }
        }

        return true
    }

    removerLineas() {

        let lineasRemovidas = 0

        for (let y = 0; y < this.tablero.length; y++) {
            const lineasCompletas = this.tablero[y].every(item => BloqueIndices.includes(item))
            if (lineasCompletas) {
                lineasRemovidas += 1
                this.tablero.splice(y, 1)
                this.tablero.unshift(Array.from({ length: MAX_TABLA_X }, () => -1))
                this.player.score = this.player.score + 1
                this.player.lineasRemovidas = this.player.lineasRemovidas + 1
                audiosTetris.linea.play()
                audiosTetris.linea.currentTime = 0
                audiosTetris.linea.volume = 0.10

            }
        }


        if (lineasRemovidas >= 4) {
            lineasRemovidas += 4
            this.player.score = this.player.score + 4
        }


        if (lineasRemovidas > 0) {

            const textLinea = document.querySelector(".text-linea-animation")
            textLinea.style.display = "block"
            textLinea.textContent = `+${lineasRemovidas * 100}`
            setTimeout(() => {
                textLinea.style.display = "none"

            }, 1500);
        }



    }


    colisionFutura() {
        const piezaY = this.pieza.y

        for (let i = 0; i < MAX_TABLA_Y; i++) {

            if (i >= piezaY) {
                const checking = this.checkeo({ dy: (i + 1) - this.pieza.y }) // +1 Simula que el bloque se esta moviendo uno mas para verificar los limites

                if (checking == false) {

                    return this.pieza.colisionY = i
                }
            }
        }
    }


    detectarFinDeJuego() {

        if (this.tablero[0].some(item => BloqueIndices.includes(item))) {
            this.player.finalizado = true
            this.tablero = tableroDefault /*Verificar aca */
            audiosTetris.terminarJuego.play()
            return true
        }
        return false
    }

    move({ dx = 0, dy = 0 } = {}) {

        if (this.player.finalizado) return

        const checking = this.checkeo({ dx, dy })

        if (checking == false) {
            const bloquesColacados = this.player.bloquesColocados
            this.lugar({ sticky: true })
            this.removerLineas()
            this.eliminarPieza()
            htmlRender.estadisticasRender(this.player)
            audiosTetris.colision.play()
            audiosTetris.colision.currentTime = 0
            this.player.bloquesColocados = bloquesColacados + 1
            if (bloquesColacados % LIMITE_HOLD_POR_BLOQUE_COLOCADO == 0) this.player.sostenerForma = true
            htmlRender.bloquesSiguientesRender(this.pieza.siguientesFormas)
            if (this.detectarFinDeJuego()) return
            htmlRender.tableroRender(this.tablero, this.pieza)
            this.move()
            return
        }

        if (checking) {
            this.lugar({ remove: true });
            this.lugar({ remove: true, colisionFutura: true })
            this.pieza.x = dx + this.pieza.x;
            this.pieza.y = dy + this.pieza.y;
            this.lugar();
            this.colisionFutura()
            this.lugar({ colisionFutura: true })
            htmlRender.tableroRender(this.tablero, this.pieza)
        }
    }

    iniciarIntervalo() {
     
        if (!this.intervalo) {
       
            this.intervalo = setInterval(() => {
               
                this.move({ dy: 1 })
            }, 1000 / this.player.nivel);
        }

    }

    detenerIntervalo() {
        console.log(this.test)
        if (this.intervalo) {
            clearInterval(this.intervalo)
            this.intervalo = null
        }

    }




    iniciarJuego() {
        this.estadisticas()
        this.generarPieza()
        htmlRender.bloquesSiguientesRender(this.pieza.siguientesFormas)
        htmlRender.tableroRender(this.tablero, this.pieza)
        this.iniciarIntervalo()
    }
}


export default Tetris