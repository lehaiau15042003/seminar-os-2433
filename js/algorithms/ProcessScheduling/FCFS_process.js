'use strict'

function FCFS_process(burstTime, arrivalTime = []) {
    let steps = [];
    let timeLine = [];
    let currentTime = 0;

    let totalresponseWaitingTime = 0;
    let totalTime = 0;

    let waitingTime = [];
    let turnarroundTime = [];

    burstTime.forEach((bt, idx) => {
        let arrival = arrivalTime[idx];
        let start = currentTime;
        let end = start + bt;
        
        let responseWaitingTime = start - arrival;
        let time = end - arrival;

        steps.push({
            process: `P${idx + 1}`,
            start,
            end,
            arrivalTime: arrival
        });

        for(let i = currentTime; i < end; i++) {
            let queue = [];
            for(let j = 0; j < burstTime.length; j++) {
                let finished = steps.some(s => s.process === `P${j + 1}` && s.end <= i);
                let arrived = arrivalTime[j] <= i;
                if(arrived && !finished && j !== idx) {
                    queue.push(`P${j + 1}`);
                }
            }
            timeLine.push({
                time: i,
                running: `P${idx + 1}`,
                ready: queue
            });
        }

        waitingTime.push(responseWaitingTime);
        turnarroundTime.push(time);
        totalresponseWaitingTime += responseWaitingTime;
        totalTime += time; 
        currentTime = end;
    });
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

export default FCFS_process;