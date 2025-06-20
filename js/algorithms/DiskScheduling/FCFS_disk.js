'use strict'
  
function FCFS_disk(queue, headStart) {
    const steps = [];
    const path = [headStart];
    let current = headStart;
    let totalMove = 0;
    queue.forEach((track) => {
        steps.push({
            from: current,
            to: track,
            distance: Math.abs(track - current)
        });
        totalMove += Math.abs(track - current);
        current = track;
        path.push(track);
    });
    
    return {
        headStart,
        steps,
        path,
        totalMove
    };
}

export default FCFS_disk;
