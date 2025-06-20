'use strict'

function FCFS_process(burstTime) {
    let steps = [];
    let currentTime = 0;
    let totalresponseWaitingTime = 0;
    burstTime.forEach((bt, idx) => {
        let start = currentTime;
        let end = start + bt;
        let responseWaitingTime = end - start;
        steps.push({
            process: `P${idx + 1}`,
            start,
            end,
        });
        totalresponseWaitingTime += responseWaitingTime;
        currentTime = end;
    });
    console.log(totalresponseWaitingTime);
    return {
        steps,
        totalresponseWaitingTime,
        currentTime
    };
}

export default FCFS_process;