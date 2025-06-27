'use strict';

function SJF(burstTime, arrivalTime = []) {
    let steps = [];
    let timeLine = [];
    let currentTime = 0;

    const n = burstTime.length;
    let isComplete = Array(n).fill(false);
    let waitingTime = Array(n).fill(0);
    let turnaroundTime = Array(n).fill(0);

    let totalWaiting = 0;
    let totalTurnaround = 0;
    let completed = 0;

    let queue = [];

    while (completed < n) {
        for (let i = 0; i < n; i++) {
            if (!isComplete[i] && arrivalTime[i] === currentTime) {
                queue.push(i);
            }
        }

        let selected = -1;
        let minBurst = Infinity;
        for (let i = 0; i < queue.length; i++) {
            let idx = queue[i];
            if (burstTime[idx] < minBurst) {
                minBurst = burstTime[idx];
                selected = idx;
            }
        }

        if (selected === -1) {
            timeLine.push({
                time: currentTime,
                running: null,
                ready: []
            });
            currentTime++;
        } else {
            let start = currentTime;
            let end = start + burstTime[selected];

            for (let t = start; t < end; t++) {
                for (let i = 0; i < n; i++) {
                    if (!isComplete[i] && arrivalTime[i] === t) {
                        queue.push(i);
                    }
                }

                let ready = queue.filter(i => !isComplete[i]).map(i => `P${i + 1}`);
                timeLine.push({
                    time: t,
                    running: `P${selected + 1}`,
                    ready
                });
            }

            currentTime = end;
            isComplete[selected] = true;
            completed++;

            let turnaround = end - arrivalTime[selected];
            let waiting = turnaround - burstTime[selected];

            totalTurnaround += turnaround;
            totalWaiting += waiting;
            turnaroundTime[selected] = turnaround;
            waitingTime[selected] = waiting;

            steps.push({
                process: `P${selected + 1}`,
                start,
                end,
                arrivalTime: arrivalTime[selected]
            });
            queue = queue.filter(i => i !== selected);
        }
    }

    return {
        steps,
        timeLine,
        avgWaitingTime: totalWaiting / n,
        avgTurnaroundTime: totalTurnaround / n,
        waitingTimes: waitingTime,
        turnaroundTimes: turnaroundTime
    };
}

export default SJF;
