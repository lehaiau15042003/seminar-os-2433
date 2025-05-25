import FIFO from './algorithms/FIFO.js'
import LRU from './algorithms/LRU.js'

let pages = [7,0,1,2,0,3,0,4,2,3,0,3,2,1,2,0,1,7,0,1];
console.log(FIFO(pages, 3));
console.log(LRU(pages, 3));