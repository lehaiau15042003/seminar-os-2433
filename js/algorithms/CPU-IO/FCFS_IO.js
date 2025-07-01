'use strict';

function SJF_IO(burstTimeList, arrivalTimeIO = [], IOUsing = []) {
    const maxTime = 10000;
    let steps = [];
    let timeLine = [];
    let currentTime = 0;
    let results = [];
    let processes = burstTimeList.map((bursts, i) => ({
        id: `P${i + 1}`,
        bursts: [...bursts],
        arrival: arrivalTimeIO[i] || 0,
        usingIO: IOUsing[i] || 0,
        index: 0,
        done: false,
        firstResponse: -1,
        lastEnd: -1,
        waiting: 0
    }));

    while (processes.some(p => !p.done) && currentTime < maxTime) {
        let readyQueue = processes.filter(p => !p.done && p.arrival <= currentTime);
        console.log(`Time: ${currentTime}, Ready Queue:`, readyQueue.map(p => p.id), `Completed: ${processes.filter(p => p.done).length}`);

        if (readyQueue.length === 0) {
            const nextArrival = Math.min(...processes.filter(p => !p.done).map(p => p.arrival));
            if (nextArrival > currentTime && Number.isFinite(nextArrival)) {
                currentTime = nextArrival;
                console.log(`Fast-forward to next arrival: ${currentTime}`);
                continue;
            }
            console.error('No processes will ever arrive:', processes);
            return { error: 'No processes available within reasonable time' };
        }

        readyQueue.sort((a, b) => {
            const aNextCPU = a.index % 2 === 0 ? a.bursts[a.index] : (a.bursts[a.index + 1] || Infinity);
            const bNextCPU = b.index % 2 === 0 ? b.bursts[b.index] : (b.bursts[b.index + 1] || Infinity);
            return aNextCPU - bNextCPU;
        });
        let process = readyQueue[0];
        let i = process.index;
        let type = i % 2 === 0 ? 'CPU' : 'IO';
        let duration = process.bursts[i];
        let start = currentTime;
        let end = start + duration;

        if (type === 'CPU' && process.firstResponse === -1) {
            process.firstResponse = start - process.arrival;
        }

        if (type === 'CPU') {
            let lastCPU = steps
                .filter(s => s.process === process.id && s.type === 'CPU')
                .slice(-1)[0];
            if (lastCPU) {
                process.waiting += start - lastCPU.end;
            } else {
                process.waiting += start - process.arrival;
            }
        }

        steps.push({
            process: process.id,
            type,
            start,
            end,
            usingIO: type === 'IO' ? !!process.usingIO : false
        });

        currentTime = end;
        process.index++;

        if (process.index >= process.bursts.length) {
            process.done = true;
            process.lastEnd = end;
            results.push({
                process: process.id,
                r: process.firstResponse,
                w: process.waiting,
                t: end - process.arrival
            });
        } else {
            if (type === 'IO') {
                process.arrival = currentTime;
            }
        }
        timeLine.push(currentTime);
    }

    if (currentTime >= maxTime) {
        console.error('Time limit exceeded:', { currentTime, completed: processes.filter(p => p.done).length });
        return { error: 'Time limit exceeded, possible infinite loop' };
    }

    let total = results.length;
    let avg_r = total ? results.reduce((sum, p) => sum + p.r, 0) / total : 0;
    let avg_w = total ? results.reduce((sum, p) => sum + p.w, 0) / total : 0;
    let avg_t = total ? results.reduce((sum, p) => sum + p.t, 0) / total : 0;

    console.log(`Average Response Time: ${avg_r}`);
    console.log(`Average Waiting Time: ${avg_w}`);
    console.log(`Average Turnaround Time: ${avg_t}`);

    return {
        steps,
        timeLine,
        results,
        average: {
            r: avg_r,
            w: avg_w,
            t: avg_t
        }
    };
}

export default SJF_IO;