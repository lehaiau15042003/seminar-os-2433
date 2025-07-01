'use strict'

function FCFS_process(burstTime, arrivalTime = []) {
    let steps = [];
    let timeLine = [];
    let waitingTime = [];
    let turnaroundTime = [];

    let currentTime = 0;
    let totalResponseWaitingTime = 0;
    let totalTurnaroundlTime = 0;


    for(let i = 0; i < burstTime.length; i++) {
        let bt = burstTime[i];
        let arrival = arrivalTime[i];
        
        if(arrival > currentTime) {
            currentTime = arrival;
        }
        
        let start = currentTime;
        let end = start + bt;
        
        let responseWaitingTime = start - arrival;
        let turnaround = end - arrival;

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
            if(j === start) {
                queue.unshift(`P${i + 1}`);
            }
            timeLine.push({
                time: j,
                running: `P${i + 1}`,
                ready: queue
            });
        }

        waitingTime.push(responseWaitingTime);
        turnaroundTime.push(turnaround);
        totalResponseWaitingTime += responseWaitingTime;
        totalTurnaroundlTime += turnaround; 
        currentTime = end;
    }
    let avgResponseWaitingTime = totalResponseWaitingTime / burstTime.length;
    let avgTime = totalTurnaroundlTime / burstTime.length;
    return {
        steps,
        timeLine,
        avgResponseWaitingTime,
        avgTime,
        waitingTimes: waitingTime,
        turnaroundTimes: turnaroundTime
    };
}

export default FCFS_process;