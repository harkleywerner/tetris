import { bloqueRandom } from "./listaDeBloques.js"

const MAX_TABLA_X = 15
const MAX_TABLA_Y = 20
const MAX_LVL = 10
const SCORE_INCIAL = 15000
const LIMITE_HOLD_POR_BLOQUE_COLOCADO = 2
const BloqueActualIndice = 0
const BloqueVacioIndice = -1
const BloqueFuturoIndice = 9
const BloqueIndices = [1, 2, 3, 4, 5, 6, 7]

const tableroDefault = Array.from({ length: MAX_TABLA_Y }, (_, index) => {
    return Array.from({ length: MAX_TABLA_X }, (_, i) => -1)
})



class Tetris {

    constructor() {
        this.tablero = JSON.parse(JSON.stringify(tableroDefault))

    }

    audioTetris() {
        this.colisionEffect = new Audio("./colision.mp3")
        this.tableroEffect = new Audio("./linea.mp3")
        this.selectEffect = new Audio("./select.mp3")
        this.pauseEffect = new Audio("./pause.mp3")
        this.gameStartEffect = new Audio("./renaudar.mp3")
        this.gameOverEffect = new Audio("./gameOver.mp3")
        this.bloqueSostenidoEffect = new Audio("./bloqueSostenido.mp3")
    }

    estadisticas() {
        {
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
    }



    visibilidadWindow() {
        document.addEventListener("visibilitychange", (e) => {

            if (document.visibilityState == "hidden") {
                if (!this.player.pausa) {
                    this.pausa()
                }
            }

        })
    }



    dibujarBarraDeNivel() {
        const barra = document.getElementById("barra-score")

        for (let y = 0; y < 10; y++) {
            const spanBarra = document.createElement("span")
            spanBarra.classList.add("barra-span")
            spanBarra.style.position = "absolute"
            spanBarra.style.left = `${(y) * 10}%`
            spanBarra.style.width = "44.1px"
            barra.appendChild(spanBarra)
        }
    }

    dibujarTablero() {
        const tablero = document.querySelector(".play-area")
        tablero.replaceChildren("")

        const fragmento = document.createDocumentFragment()
        for (let i = 0; i < this.tablero.length; i++) {
            const filaElemento = document.createElement("div")
            const fila = this.tablero[i]

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
                    columnaElemento.classList.add(`bloque${this.pieza.indice}`)
                }
                else if (columna == 9) {
                    columnaElemento.classList.add(`bloque-futuro${this.pieza.indice}`)
                    columnaElemento.classList.add(`bloque-futuro`)

                }


                columnaElemento.classList.add("bloque")

                columnaElemento.style.gridColumnStart = `${j + 1}`;
                columnaElemento.style.gridColumnEnd = `${j + 2}`;
                filaElemento.appendChild(columnaElemento)
            }
            fragmento.appendChild(filaElemento)
            tablero.appendChild(fragmento)
        }


    }


    dibujarFormasLaterales({ sostener = false } = {}) {
        const bloqueHold = document.getElementById(`${sostener ? "bloque-hold" : "next-bloque"}`)

        bloqueHold.replaceChildren("")

        const forma = sostener ? this.player.formaSostenida[1] : this.pieza.siguienteForma[1]
        const indice = sostener ? this.player.indexSotenido : this.pieza.siguienteIndice


        for (let y = 0; y < forma.length; y++) {
            const filaElemento = document.createElement("div")
            filaElemento.classList.add("row")
            filaElemento.classList.add("w-100")
            filaElemento.classList.add("d-flex")
            filaElemento.classList.add("justify-content-center")

            for (let x = 0; x < forma[y].length; x++) {

                const columnaElemento = document.createElement("div")

                if (forma[y][x] == 0) {
                    columnaElemento.classList.add(`bloque${indice}`)
                } else {
                    columnaElemento.classList.add("border-0")
                }

                columnaElemento.classList.add(`bloque`)
                columnaElemento.classList.add(`col-${1}`)
                filaElemento.appendChild(columnaElemento)

            }
            bloqueHold.appendChild(filaElemento)
        }


    }

    generarPieza() {

        const { indice, forma } = bloqueRandom()
        this.pieza = {
            y: 0,
            x: 3,
            indice: indice,
            colisionY: null,
            rotacionN: 1,
            rotacion: forma,
            forma: forma[1],
            siguienteForma: bloqueRandom().forma,
            siguienteIndice: bloqueRandom().indice
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
        const modal = document.getElementById('modal-pausa');
        const modalScore = document.getElementById("modal-score")
        modalScore.textContent = `Score : ${this.player.score * 100}`
        const modalBoostrap = new bootstrap.Modal(modal, { backdrop: 'static' });

        const pauseEffect = this.pauseEffect

        const playerPausa = this.player.pausa

        if (playerPausa) {
            this.intervaloDeMovimiento()
            modal.style.display = "none"
            modal.classList.remove("fade")
            pauseEffect.play()
        } else {
            pauseEffect.play()

            modalBoostrap.show();
            clearInterval(this.intervalo)
        }
        this.pauseEffect.currentTime = 0
        this.player.pausa = !playerPausa

    }

    controlerTeclado() {
        window.addEventListener("keydown", (e) => {
            this.controles(e.key)
        })
    }

    controlerMouse() {
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

            this.lugar({ remove: true })
            this.lugar({ remove: true, colisionFutura: true })

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



            this.colisionFutura()
            this.controles("mousemove")
        })

    }

    controles(tipo) {

        if (["s", "a", "d", "click", "e", "f", "mousemove"].includes(tipo) && this.player.pausa) return

        switch (tipo) {
            case "Escape":
                this.pausa()
                break
            case "s":
                this.move({ dy: 1 })
                break;
            case "a":
                this.move({ dx: -1 })
                break;
            case "f":

                if (!this.player.sostenerForma) return

                this.lugar({ remove: true })
                this.lugar({ remove: true, colisionFutura: true })
                this.player.formaSostenida = this.pieza.rotacion
                this.player.indexSotenido = this.pieza.indice
                this.player.sostenerForma = false
                this.dibujarFormasLaterales({ sostener: true })
                this.dibujarFormasLaterales()
                this.eliminarPieza()
                this.move()
                this.bloqueSostenidoEffect.play()
                this.bloqueSostenidoEffect.currentTime = 0
                break;
            case "d":
                this.move({ dx: 1 })
                break;
            case "click":
                this.lugar({ remove: true })
                this.pieza.y = this.pieza.colisionY
                this.lugar({ colisionFutura: true })
                this.move({ dy: 1 })
                break;
            case "mousemove":
                this.move()

                break
            case "r":
                this.lugar({ remove: true })
                this.lugar({ remove: true, colisionFutura: true })
                this.rotarPieza()
                this.colisionFutura()
                this.lugar({ colisionFutura: true })
                this.move()
                break;
        }

    }

    eliminarPieza() {

        this.pieza.y = 0
        this.pieza.x = 3
        this.pieza.rotacionN = 1
        this.pieza.indice = this.pieza.siguienteIndice
        this.pieza.rotacion = this.pieza.siguienteForma
        this.pieza.colisionY = null
        this.pieza.forma = this.pieza.siguienteForma[1]
        this.pieza.siguienteForma = bloqueRandom().forma,
            this.pieza.siguienteIndice = bloqueRandom().indice


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
                this.tableroEffect.play()
                this.tableroEffect.currentTime = 0
                this.tableroEffect.volume = 0.10

            }
        }


        if (lineasRemovidas >= 4) {
            this.player.score = this.player.score + 4
        }


        if (lineasRemovidas > 0) {
            console.log("s")
            const textLinea = document.querySelector(".text-linea-animation")
            textLinea.style.display = "block"
            textLinea.textContent = `+${lineasRemovidas * 100}`
            setTimeout(() => {
                textLinea.style.display = "none"

            },1500);
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

    dibujarBloqueColocados() {

        const bloqueColocados = document.getElementById("bloques-colocados")
        bloqueColocados.textContent = this.player.bloquesColocados
    }

    dibujarLineasRemovidas() {
        const bloqueColocados = document.getElementById("lineas-removidas")
        bloqueColocados.textContent = this.player.lineasRemovidas
    }

    detectarFinDeJuego() {

        if (this.tablero[0].some(item => BloqueIndices.includes(item))) {
            this.player.finalizado = true
            this.tablero = tableroDefault /*Verificar aca */
            this.gameOverEffect.play()
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
            this.colisionEffect.play()
            this.colisionEffect.currentTime = 0
            this.player.bloquesColocados = bloquesColacados + 1
            if (bloquesColacados % 4 == 0) this.player.sostenerForma = true
            this.dibujarBloqueColocados()
            this.dibujarLineasRemovidas()
            this.dibujarFormasLaterales()
            if (this.detectarFinDeJuego()) {
                return
            }
            this.dibujarTablero()
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
            this.dibujarTablero();
        }
    }

    intervaloDeMovimiento() {

        this.intervalo = setInterval(() => {
            // this.move({ dy: 1 })
        }, 1000 / this.player.nivel);

    }

    iniciarJuego() {
        this.audioTetris()
        this.estadisticas()
        this.generarPieza()
        this.dibujarFormasLaterales()
        this.move()
        this.intervaloDeMovimiento()
        this.controlerTeclado()
        this.controlerMouse()
        this.controles()
        this.visibilidadWindow()
        this.dibujarBarraDeNivel()
    }


}

const comenzarJuego = () => {

    const tetris = new Tetris()
    tetris.iniciarJuego()

}

comenzarJuego()
