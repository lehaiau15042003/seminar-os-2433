'use strict';

function SRTF(burstTime, arrivalTime = []) {
    let steps = [];
    let timeLine = [];
    let currentTime = 0;

    let start = Array(burstTime.length).fill(-1);
    let end = Array(burstTime.length).fill(0);
    let isComplete = Array(burstTime.length).fill(false);
    let remainingTime = [...burstTime];

    let responseTime = Array(burstTime.length).fill(-1);
    let waitingTime = Array(burstTime.length).fill(0);
    let turnaroundTime = Array(burstTime.length).fill(0);

    let totalResponseTime = 0;
    let totalWaitingTime = 0;
    let totalTurnaroundTime = 0;
    let lastRunning = -1;
    let runStart = -1;
    let complete = 0;

    let readyQueue = [];

    while (complete < burstTime.length) {
        for (let j = 0; j < burstTime.length; j++) {
            if (
                arrivalTime[j] === currentTime &&
                !isComplete[j] &&
                !readyQueue.includes(j)
            ) {
                readyQueue.push(j);
            }
        }

        let idx = -1;
        let min = Number.MAX_SAFE_INTEGER;
        for (let i = 0; i < readyQueue.length; i++) {
            const pid = readyQueue[i];
            if (!isComplete[pid] && remainingTime[pid] < min) {
                min = remainingTime[pid];
                idx = pid;
            }
        }

        if (idx === -1) {
            timeLine.push({
                time: currentTime,
                running: null,
                highlight: false,
                ready: [...readyQueue],
                remainingTime: [...remainingTime]
            });
            currentTime++;
            continue;
        }

        const highlight = idx !== lastRunning;

        if (highlight) {
            if (lastRunning !== -1 && runStart !== -1 && runStart !== currentTime) {
                steps.push({
                    process: `P${lastRunning + 1}`,
                    start: runStart,
                    end: currentTime,
                    arrivalTime: arrivalTime[lastRunning]
                });
            }
            runStart = currentTime;
            lastRunning = idx;
        }

        if (start[idx] === -1) {
            start[idx] = currentTime;
            responseTime[idx] = currentTime - arrivalTime[idx];
            totalResponseTime += responseTime[idx];
        }

        timeLine.push({
            time: currentTime,
            running: idx,
            highlight,
            ready: [...readyQueue],
            remainingTime: [...remainingTime]
        });

        remainingTime[idx]--;
        currentTime++;

        if (remainingTime[idx] === 0) {
            end[idx] = currentTime;
            isComplete[idx] = true;
            complete++;

            const turnaround = end[idx] - arrivalTime[idx];
            const waiting = turnaround - burstTime[idx];

            turnaroundTime[idx] = turnaround;
            waitingTime[idx] = waiting;
            totalWaitingTime += waiting;
            totalTurnaroundTime += turnaround;

            if (runStart !== -1 && runStart !== currentTime) {
                steps.push({
                    process: `P${idx + 1}`,
                    start: runStart,
                    end: currentTime,
                    arrivalTime: arrivalTime[idx]
                });
            }

            runStart = -1;
            lastRunning = -1;
            readyQueue = readyQueue.filter(p => p !== idx);
        }
    }

    return {
        steps,
        timeLine,
        responseTimes: responseTime,
        waitingTimes: waitingTime,
        turnaroundTimes: turnaroundTime,
        avgResponseTime: totalResponseTime / burstTime.length,
        avgWaitingTime: totalWaitingTime / burstTime.length,
        avgTurnaroundTime: totalTurnaroundTime / burstTime.length
    };
}

export default SRTF;
