import Pixelator from './Pixelator'

export default class PixelatorWorker extends Pixelator {
    worker = new Worker(new URL('./work', import.meta.url))
    generating = false

    constructor(onUpdate) {
        super(onUpdate)
        this.worker.onmessage = (evt) => {
            const message = evt.data
            console.log(message);
            switch (message.type) {
                case 'update':
                    this.target = message.result
                    this.onUpdate(message.finish)
                    break
            }
        }
    }

    generate(source, config) {
        this.stop()
        this.config = config
        const message = {
            type: 'generate',
            source,
            config,
        }
        this.worker.postMessage(message)
        this.generating = true
    }

    stop() {
        if (this.generating) {
            const message = {
                type: 'stop',
            }
            this.worker.postMessage(message)
            this.generating = false
        }
    }

    dispose() {
        this.stop()
        this.worker.terminate()
    }
}