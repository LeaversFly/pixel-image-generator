import Pixelator from './Pixelator'
import PixelatorMain from './main'
import PixelatorWorker from './pixelator-worker'

export const createPixelator = onUpdate => {
    return new PixelatorWorker(onUpdate)
}