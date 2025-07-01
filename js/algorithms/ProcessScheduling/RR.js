'use strict';

function RR(burstTime, quantum, arrivalTime = []) {
    let steps = [];
    let timeLine = [];
    let responseTime = new Array(burstTime.length).fill(-1);
    let waitingTime = new Array(burstTime.length).fill(0);
    let turnaroundTime = new Array(burstTime.length).fill(0);
    let isComplete = new Array(burstTime.length).fill(false);
    let remainingTime = [...burstTime];
    let temp = new Array(burstTime.length).fill(false);

    let queue = [];
    let currentTime = 0;
    let complete = 0;
    let totalResponse = 0;
    let totalWaitingTime = 0;
    let totalTurnaroundTime = 0;

    for (let i = 0; i < burstTime.length; i++) {
        if (arrivalTime[i] === 0) {
            queue.push(i);
            temp[i] = true;
        }
    }

    while (complete < burstTime.length) {
        if (queue.length === 0) {
            timeLine.push({ 
                time: currentTime, 
                running: null, 
                ready: [] 
            });
            currentTime++;

            for (let i = 0; i < burstTime.length; i++) {
                if (!temp[i] && arrivalTime[i] <= currentTime) {
                    queue.push(i);
                    temp[i] = true;
                }
            }
        }

        let idx = queue.shift();

        if (responseTime[idx] === -1) {
            responseTime[idx] = currentTime - arrivalTime[idx];
            totalResponse += responseTime[idx];
        }

        let execTime = Math.min(quantum, remainingTime[idx]);
        steps.push({
            process: `P${idx + 1}`,
            start: currentTime,
            end: currentTime + execTime
        });

        for (let t = 0; t < execTime; t++) {
            let readySnapshot = [...queue];
            timeLine.push({
                time: currentTime,
                running: idx,                 
                ready: readySnapshot,
                remainingTime: [...remainingTime]
            });
        
            currentTime++;
            remainingTime[idx]--;

            for (let i = 0; i < burstTime.length; i++) {
                if (!temp[i] && arrivalTime[i] === currentTime) {
                    queue.push(i);
                    temp[i] = true;
                }
            }
        }
        
        for (let i = 0; i < burstTime.length; i++) {
            if (!temp[i] && arrivalTime[i] <= currentTime) {
                queue.push(i);
                temp[i] = true;
            }
        }

        if (remainingTime[idx] === 0) {
            isComplete[idx] = true;
            complete++;
            turnaroundTime[idx] = currentTime - arrivalTime[idx];
            waitingTime[idx] = turnaroundTime[idx] - burstTime[idx];
            totalTurnaroundTime += turnaroundTime[idx];
            totalWaitingTime += waitingTime[idx];
        } else {
            queue.push(idx);
        }
    }

    return {
        steps,
        timeLine,
        waitingTimes: waitingTime,
        turnaroundTimes: turnaroundTime,
        responseTimes: responseTime,
        avgWaitingTime: totalWaitingTime / burstTime.length,
        avgTurnaroundTime: totalTurnaroundTime / burstTime.length,
        avgResponseTime: totalResponse / burstTime.length
    };
}

export default RR;
