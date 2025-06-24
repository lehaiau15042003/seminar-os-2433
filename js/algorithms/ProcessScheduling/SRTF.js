'use strict'

function SRTF(burstTime) {
    let steps = [];
    let timeLine = [];
    let currentTime = 0;
    let arrivalTime = burstTime.map((_,i) => i);

    let start = [];
    let end = [];
    let isComplete = [];

    let waitingTime = [];
    let turnarroundTime = [];
    let remainingTime = [...burstTime];
    let totalresponseWaitingTime = 0;
    let totalTime = 0;
    let complete = 0;

    for(let i = 0; i < burstTime.length; i++) {
        start[i] = -1;
        remainingTime[i] = burstTime[i];
        isComplete[i] = false;
    }   

    while(complete < burstTime.length) {
        let idx = -1;
        let min = Number.MAX_SAFE_INTEGER;

        for(let i = 0; i < burstTime.length; i++) {
            if(arrivalTime[i] <= currentTime && !isComplete[i] && remainingTime[i] < min) {
                min = remainingTime[i];
                idx = i;
            }
        }
        if(idx === -1) {
            timeLine.push({
                time: currentTime,
                running: null,
                ready: []
            });
            currentTime++;
        }
        else {
            if(start[idx] === -1) {
                start[idx] = currentTime;
            }
            let queue = [];
            for (let j = 0; j < burstTime.length; j++) {
                if (j !== idx && arrivalTime[j] <= currentTime && !isComplete[j] && remainingTime[j] > 0) {
                    queue.push(`P${j + 1}`);
                }
            }
            timeLine.push({
                time: currentTime,
                running: `P${idx + 1}`,
                ready: queue
            });
            remainingTime[idx]--;
            currentTime++;
            if(remainingTime[idx] === 0) {
                end[idx] = currentTime;
                isComplete[idx] = true;
                complete++;
                let responseWaitingTime = start[idx] - arrivalTime[idx];
                let time = end[idx] - arrivalTime[idx];

                steps.push({
                    process: `P${idx + 1}`,
                    start: start[idx],
                    end: end[idx],
                    arrivalTime: arrivalTime[idx]
                });

                waitingTime.push(responseWaitingTime);
                turnarroundTime.push(time);
                totalresponseWaitingTime += responseWaitingTime;
                totalTime += time;
            }
        }
    }

    let avgResponseWatingTime = totalresponseWaitingTime / burstTime.length;
    let avgTime = totalTime / burstTime.length;
    return {
        steps,
        timeLine,
        avgResponseWatingTime,
        avgTime,
        waitingTimes: waitingTime,
        turnarroundTimes: turnarroundTime
    };
    
}

export default SRTF;