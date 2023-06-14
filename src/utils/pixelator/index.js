import Pixelator from './Pixelator'
import PixelatorMain from './main'
import PixelatorWorker from './pixelator-worker'

export const createPixelator = onUpdate => Pixelator = window.Worker
    ? onUpdate => new PixelatorWorker(onUpdate)
    : onUpdate => new PixelatorMain(onUpdate)