
const colision = new Audio("./colision.mp3")
colision.currentTime = 0
colision.volume = 0.2

const audiosTetris = {
    colision,
    linea: new Audio("./linea.mp3"),
    pause: new Audio("./pause.mp3"),
    empezarJuego: new Audio("./renaudar.mp3"),
    terminarJuego: new Audio("./gameOver.mp3"),
    bloqueSostenido: new Audio("./bloqueSostenido.mp3"),
    levelUp: new Audio("./levelUp.mp3")
}



export default audiosTetris