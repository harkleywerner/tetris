import Tetris from "./tetris.js";
import Controles from "./tetrisControles.js";



const comenzarJuego = async() => {
    const tetris = new Tetris()
    tetris.iniciarJuego()
    const tetrisControles = new Controles(tetris)
    tetrisControles.inciarControles()

}

comenzarJuego()


