'use strict';

function SRTF(burstTime, arrivalTime = []) {
    let steps = [];
    let timeLine = [];

    let currentTime = 0;
    let remainingTime = [...burstTime];
    let start = Array(burstTime.length).fill(-1);
    let end = Array(burstTime.length).fill(0);
    let isComplete = Array(burstTime.length).fill(false);

    let responseTime = Array(burstTime.length).fill(-1);
    let waitingTime = Array(burstTime.length).fill(0);
    let turnaroundTime = Array(burstTime.length).fill(0);

    let totalResponseTime = 0;
    let totalWaitingTime = 0;
    let totalTurnaroundTime = 0;

    let complete = 0;
    let queue = [];

    let lastRunning = -1;
    let runStart = -1;

    while (complete < burstTime.length) {
        for (let i = 0; i < burstTime.length; i++) {
            if (arrivalTime[i] === currentTime && !isComplete[i] && !queue.includes(i)) {
                queue.push(i);
            }
        }
        let selected = -1;
        let minTime = Infinity;

        for (let i = 0; i < queue.length; i++) {
            let idx = queue[i];
            if (!isComplete[idx] && remainingTime[idx] < minTime) {
                minTime = remainingTime[idx];
                selected = idx;
            }
        }

        if (selected === -1) {
            timeLine.push({
                time: currentTime,
                running: null,
                ready: [],
                remainingTime: [...remainingTime]
            });
            currentTime++;
        }

        if (lastRunning !== selected) {
            if (lastRunning !== -1) {
                steps.push({
                    process: `P${lastRunning + 1}`,
                    start: runStart,
                    end: currentTime,
                    arrivalTime: arrivalTime[lastRunning]
                });
            }
            runStart = currentTime;
            lastRunning = selected;
        }

        if (start[selected] === -1) {
            start[selected] = currentTime;
            responseTime[selected] = currentTime - arrivalTime[selected];
            totalResponseTime += responseTime[selected];
        }

        let ready = [];
        if (start[selected] === currentTime) {
            ready = queue.map(i => `P${i + 1}`);
        } else {
            ready = queue.filter(i => i !== selected).map(i => `P${i + 1}`);
        }
        timeLine.push({
            time: currentTime,
            running: `P${selected + 1}`,
            ready: ready,
            remainingTime: [...remainingTime]
        });

        remainingTime[selected]--;
        currentTime++;

        if (remainingTime[selected] === 0) {
            end[selected] = currentTime;
            isComplete[selected] = true;
            complete++;

            let turnaround = end[selected] - arrivalTime[selected];
            let waiting = turnaround - burstTime[selected];

            turnaroundTime[selected] = turnaround;  
            waitingTime[selected] = waiting;

            totalTurnaroundTime += turnaround;
            totalWaitingTime += waiting;

            steps.push({
                process: `P${selected + 1}`,
                start: runStart,
                end: currentTime,
                arrivalTime: arrivalTime[selected]
            });

            runStart = -1;
            lastRunning = -1;

            let removeIndex = queue.indexOf(selected);
            if (removeIndex !== -1) {
                queue.splice(removeIndex, 1);
            }
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
