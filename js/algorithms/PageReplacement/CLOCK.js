'use strict'

function CLOCK(pages, frameSize) {
    let frame = [];
    let pageFault = 0;
    let pointer = 0;
    let bit = new Array(frameSize).fill(0);
    let steps = [];
    pages.forEach((page, idx) => {
        const isFault = !frame.includes(page);
        let pageIndex = frame.indexOf(page);
        if(isFault){
            pageFault++;
            if(frame.length >= frameSize){
                while(true){
                    if(bit[pointer] === 0){
                        frame[pointer] = page;
                        pointer = (pointer + 1) % frameSize;
                        break;
                    }else if(bit[pointer] === 1){
                        bit[pointer] = 0;
                        pointer = (pointer + 1) % frameSize;
                    }   
                }
            }else {
                frame.push(page);
            }
        }else {
            bit[pageIndex] = 1;
        }
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

export default CLOCK;