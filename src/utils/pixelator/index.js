import Pixelator from './Pixelator'
import PixelatorMain from './main'
import PixelatorWorker from './work'

export const createPixelator = onUpdate => {
    return new PixelatorMain(onUpdate)
}