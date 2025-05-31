import FIFO from '../PageReplacement/FIFO.js'
import LRU from '../PageReplacement/LRU.js'
import OPTIMAL from '../PageReplacement/OPTIMAL.js'
import CLOCK from '../PageReplacement/CLOCK.js'

export function runAlgorithms(pages, frameSize, algorithms){
    switch(algorithms) {
        case "FIFO":
            return FIFO(pages, frameSize);
        case "LRU":
            return LRU(pages, frameSize);
        case "OPTIMAL":
            return OPTIMAL(pages, frameSize);
        case "CLOCK":
            return CLOCK(pages, frameSize);
        default:
            return null;
    }
}