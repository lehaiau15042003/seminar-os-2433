'use strict'

function FCFS_process(burstTime, arrivalTime = []) {
    let steps = [];
    let timeLine = [];
    let currentTime = 0;
    let totalResponseWaitingTime = 0;
    let totalTime = 0;

    let waitingTime = [];
    let turnarroundTime = [];

    for(let i = 0; i < burstTime.length; i++) {
        let bt = burstTime[i];
        let arrival = arrivalTime[i];
        
        if(arrival > currentTime) {
            currentTime = arrival;
        }
        
        let start = currentTime;
        let end = start + bt;
        
        let responseWaitingTime = start - arrival;
        let time = end - arrival;

        steps.push({
            process: `P${i + 1}`,
            start,
            end,
            arrivalTime: arrival
        });

        for(let j = currentTime; j < end; j++) {
            let queue = [];
            for(let k = 0; k < burstTime.length; k++) {
                let finished = steps.some(s => s.process === `P${k + 1}` && s.end <= j);
                let arrived = arrivalTime[k] <= j;
                if(arrived && !finished && k !== i) {
                    queue.push(`P${k + 1}`);
                }
            }
            timeLine.push({
                time: j,
                running: `P${i + 1}`,
                ready: queue
            });
        }

        waitingTime.push(responseWaitingTime);
        turnarroundTime.push(time);
        totalResponseWaitingTime += responseWaitingTime;
        totalTime += time; 
        currentTime = end;
    }
    let avgResponseWaitingTime = totalResponseWaitingTime / burstTime.length;
    let avgTime = totalTime / burstTime.length;
    return {
        steps,
        timeLine,
        avgResponseWaitingTime,
        avgTime,
        waitingTimes: waitingTime,
        turnarroundTimes: turnarroundTime
    };
}

export default FCFS_process;