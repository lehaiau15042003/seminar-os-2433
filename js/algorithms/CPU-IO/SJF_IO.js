'use strict';

function SJF_IO(burstTimeList, arrivalTimeIO = [], IOUsing = []) {
    const n = burstTimeList.length;
    const processes = burstTimeList.map((bt, i) => ({
        id: `P${i + 1}`,
        burstTime: bt,
        arrivalTime: (arrivalTimeIO[i] >= 0 ? arrivalTimeIO[i] : 0) || 0,
        ioTime: (IOUsing[i] >= 0 ? IOUsing[i] : 0) || 0,
        remainingTime: bt,
        ioUsed: false, 
        isInIO: false, 
        ioEndTime: null, 
        isComplete: false
    }));

    let currentTime = 0; 
    let completed = 0; 
    const steps = []; 

    while (completed < n) {
        processes.forEach(p => {
            if (p.isInIO && p.ioEndTime === currentTime) {
                p.arrivalTime = currentTime;
                p.isInIO = false;
                p.ioEndTime = null;
            }
        });
        const available = processes.filter(p =>
            !p.isComplete &&
            !p.isInIO &&
            p.arrivalTime <= currentTime &&
            p.remainingTime > 0
        );

        if (available.length === 0) {
            currentTime++;
            continue;
        }

        const current = available.reduce((min, curr) =>
            curr.remainingTime < min.remainingTime ? curr : min
        );

        if (!current.ioUsed && current.ioTime > 0) {
            steps.push({
                process: current.id,
                start: currentTime,
                end: currentTime + current.ioTime,
                type: 'IO'
            });
            current.ioUsed = true;
            current.isInIO = true;
            current.ioEndTime = currentTime + current.ioTime;
            currentTime += current.ioTime;
        } else {
            const cpuDuration = current.remainingTime;
            steps.push({
                process: current.id,
                start: currentTime,
                end: currentTime + cpuDuration,
                type: 'CPU'
            });
            currentTime += cpuDuration;
            current.remainingTime = 0;
            current.isComplete = true;
            completed++;
        }
    }

    return { steps };
}

export default SJF_IO;