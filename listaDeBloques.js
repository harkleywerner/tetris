
const listadoDeBloques =
    [

        {
            1: [
                [0, 0],
                [0, 0]
            ],
        },


        {
            1: [
                [0, 0, 0, 0]
            ],
            2: [
                [0],
                [0],
                [0],
                [0],
            ],

        },
        {
            1: [
                [0, -1],
                [0, -1],
                [0, 0]
            ],
            2: [
                [0, 0, 0],
                [0, -1, -1]
            ],
            3: [
                [0, 0],
                [-1, 0],
                [-1, 0]
            ],
        },
        {
            1: [
                [-1, 0, -1],
                [0, 0, 0]
            ],
            2: [

                [0, -1],
                [0, 0],
                [0, -1]

            ],
            3: [
                [0, 0, 0],
                [-1, 0, -1]
            ]
        },
        {
            1: [
                [0, 0, -1],
                [-1, 0, 0]
            ],
            2: [
                [-1, 0],
                [0, 0],
                [0, -1]
            ]
        },
        {
            1: [
                [-1, 0, 0],
                [0, 0, -1]
            ],
            2: [
                [0, -1],
                [0, 0],
                [-1, 0]
            ]
        },
        {
            1: [
                [-1, 0],
                [-1, 0],
                [0, 0]
            ],
            2: [
                [0, -1, -1],
                [0, 0, 0]
            ],
            3: [
                [0, 0],
                [0, -1],
                [0, -1]
            ],
        }

    ]


const bloqueRandom = () => {
    const random = Math.floor(Math.random() * Math.abs(listadoDeBloques.length))
    const bloque = listadoDeBloques[random]
    return {
        indice: random + 1,
        forma: bloque,

    }
}

export {
    bloqueRandom,

}
