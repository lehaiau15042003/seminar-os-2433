'use strict'

function SSTF(queue, headStart) {
    const steps = [];
    const path = [headStart];
    let current = headStart;
    let totalMove = 0;
    const remaining = [...queue];
    while(remaining.length > 0) {
        let nearIndex = 0;
        let minDistance = Math.abs(remaining[0] - current);
        
        remaining.forEach((track, i) => {
            const distance = Math.abs(track - current);
            if(distance < minDistance) {
                nearIndex = i;
                minDistance = distance;
            }
        }); 
        
        const nextTrack = remaining.splice(nearIndex, 1)[0];
        steps.push({
            from: current,
            to: nextTrack,
            distance: minDistance
        });
        
        totalMove += minDistance;
        current = nextTrack;
        path.push(current);
    }

    return {
        headStart,
        steps,
        path, 
        totalMove
    };
}

export default SSTF;