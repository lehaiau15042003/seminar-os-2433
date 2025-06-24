'use strict'

function SJF(burstTime, arrivalTime) {
    let steps = [];
    let timeLine = [];
    let currentTime = 0;

    let isComplete = [];

    let waitingTime = [];
    let turnaroundTime = [];
    let totalWaiting = 0;
    let totalTurnaround = 0;
    let complete = 0;

    for(let i = 0; i < burstTime.length; i++) {
        isComplete[i] = false;
    }

    while (complete < burstTime.length) {
        let idx = -1;
        let minBurst = Number.MAX_SAFE_INTEGER;

        for (let i = 0; i < burstTime.length; i++) {
            if (!isComplete[i] && arrivalTime[i] <= currentTime && burstTime[i] < minBurst) {
                minBurst = burstTime[i];
                idx = i;
            }
        }

        if (idx === -1) {
            timeLine.push({
                time: currentTime,
                running: null,
                ready: []
            });
            currentTime++;
        } else {
            let queue = [];
            for (let j = 0; j < burstTime.length; j++) {
                if (j !== idx && arrivalTime[j] <= currentTime && !isComplete[j]) {
                    queue.push(`P${j + 1}`);
                }
            }
            for (let t = 0; t < burstTime[idx]; t++) {
                timeLine.push({
                    time: currentTime + t,
                    running: `P${idx + 1}`,
                    ready: queue
                });
            }

            let start = currentTime;
            currentTime += burstTime[idx];
            let end = currentTime;
            isComplete[idx] = true;
            complete++;

            let turnaround = end - arrivalTime[idx];
            let waiting = turnaround - burstTime[idx];

            steps.push({
                process: `P${idx + 1}`,
                start,
                end,
                arrivalTime: arrivalTime[idx]
            });

            waitingTime.push(waiting);
            turnaroundTime.push(turnaround);
            totalWaiting += waiting;
            totalTurnaround += turnaround;
        }
    }

    return {
        steps,
        timeLine,
        avgWaitingTime: totalWaiting / burstTime.length,
        avgTurnaroundTime: totalTurnaround / burstTime.length,
        waitingTimes: waitingTime,
        turnaroundTimes: turnaroundTime
    };
}

export default SJF;
