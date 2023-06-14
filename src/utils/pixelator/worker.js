import Pixelator from './core'

let id
let pixelator = null

addEventListener('message', (event) => {
    const message = event.data
    switch (message.type) {
        case 'generate':
            onGenerate(message)
            break
        case 'stop':
            onStop()
            break
    }
})

function onGenerate(message) {
    onStop()
    pixelator = new Pixelator(message.source, message.config)
    let lastCost = Infinity
    const update = () => {
        const now = performance.now()
        do {
            pixelator.fit()
        } while (performance.now() - now <= 10)
        const cost = pixelator.calculateCost()
        const message = {
            type: 'update',
            result: pixelator.toImageData(),
            finish: false,
        }
        if (lastCost - cost > 0) {
            id = (setTimeout)(update, 100)
        } else {
            id = null
            message.finish = true
        }
        postMessage(message)
        lastCost = cost
    }
    update()
}

function onStop() {
    if (id !== null) {
        cancelAnimationFrame(id)
        id = null
    }
}