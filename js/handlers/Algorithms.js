import FIFO from '../algorithms/PageReplacement/FIFO.js'
import LRU from '../algorithms/PageReplacement/LRU.js'
import OPTIMAL from '../algorithms/PageReplacement/OPTIMAL.js'
import CLOCK from '../algorithms/PageReplacement/CLOCK.js'

import FCFS_disk from '../algorithms/DiskScheduling/FCFS_disk.js'
import SSTF from '../algorithms/DiskScheduling/SSTF.js'
import SCAN from '../algorithms/DiskScheduling/SCAN.js'
import CSCAN from '../algorithms/DiskScheduling/CSCAN.js'
import LOOK from '../algorithms/DiskScheduling/LOOK.js'
import CLOOK from '../algorithms/DiskScheduling/CLOOK.js'

import FCFS_process from '../algorithms/ProcessScheduling/FCFS_process.js'
import SJF from '../algorithms/ProcessScheduling/SJF.js'
import SRTF from '../algorithms/ProcessScheduling/SRTF.js'
import RR from '../algorithms/ProcessScheduling/RR.js'

import FCFS_IO from '../algorithms/CPU-IO/FCFS_IO.js'
import SJF_IO from '../algorithms/CPU-IO/SJF_IO.js'
import SRTF_IO from '../algorithms/CPU-IO/SRTF.js'
import RR_IO from '../algorithms/CPU-IO/RR_IO.js'

export function runAlgorithms({pages, frameSize, queue, headStart, direction, minTrack = 0, maxTrack, burstTime, arrivalTime, quantum, burstTimeList, arrivalTimeIO, IOUsing, algorithms: selectedAlgorithm}){
    switch(selectedAlgorithm) {
        case "FIFO":
            return FIFO(pages, frameSize);
        case "LRU":
            return LRU(pages, frameSize);
        case "OPTIMAL":
            return OPTIMAL(pages, frameSize);
        case "CLOCK":
            return CLOCK(pages, frameSize);
        case "FCFS_disk":
            return FCFS_disk(queue, headStart);
        case "SSTF":
            return SSTF(queue, headStart);
        case "SCAN":
            return SCAN(queue, headStart, direction, minTrack, maxTrack);
        case "CSCAN":
            return CSCAN(queue, headStart, direction, minTrack, maxTrack);
        case "LOOK":
            return LOOK(queue, headStart, direction);
        case "CLOOK":
            return CLOOK(queue, headStart, direction);
        case "FCFS_process":
            return FCFS_process(burstTime, arrivalTime);
        case "SJF":
            return SJF(burstTime, arrivalTime);
        case "SRTF":
            return SRTF(burstTime, arrivalTime);
        case "RR":
            return RR(burstTime, quantum, arrivalTime);
        case "FCFS_IO":
            return FCFS_IO(burstTimeList, arrivalTimeIO, IOUsing);
        case "SJF_IO":
            return SJF_IO(burstTimeList, arrivalTimeIO, IOUsing);
        case "SRTF_IO":
            return SRTF_IO(burstTimeList, arrivalTimeIO, IOUsing);
        case "RR_IO":
            return RR_IO(burstTimeList, arrivalTimeIO, quantum);
        default:
            return null;
    }
}