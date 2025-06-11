import FIFO from '../algorithms/PageReplacement/FIFO.js'
import LRU from '../algorithms/PageReplacement/LRU.js'
import OPTIMAL from '../algorithms/PageReplacement/OPTIMAL.js'
import CLOCK from '../algorithms/PageReplacement/CLOCK.js'
import FCFS from '../algorithms/DiskScheduling/FCFS.js'
import SCAN from '../algorithms/DiskScheduling/SCAN.js'
import CSCAN from '../algorithms/DiskScheduling/CSCAN.js'

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
        case "FCFS":
            return FCFS(queue, headStart);
        case "SCAN":
            return SCAN(queue, headStart);
        case "CSCAN":
            return CSCAN(queue, headStart);
        default:
            return null;
    }
}