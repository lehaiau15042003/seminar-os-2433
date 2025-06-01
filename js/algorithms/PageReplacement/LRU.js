'use strict'

function LRU(pages, frameSize){
    let frame = [];
    let pageFault = 0;
    let steps = [];
    pages.forEach((page, idx) => {
        const isFault = !frame.includes(page);
        if(isFault) {
            pageFault++;
            if(frame.length >= frameSize){
                frame.shift();
            }
        }else {
            frame.splice(frame.indexOf(page), 1);
        }
        frame.push(page);
        console.log(frame);
        steps.push({
            index: idx,
            page,
            frame: [...frame],
            isFault
        });
    });
    return {
        pageFault,
        steps
    }
}


export default LRU; 