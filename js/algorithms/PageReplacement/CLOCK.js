'use strict'

function CLOCK(pages, frameSize) {
    let frame = [];
    let pageFault = 0;
    let pointer = 0;
    let bit = new Array(frameSize).fill(0);
    let steps = [];
    pages.forEach((page) => {
        const isFault = !frame.includes(page);
        let pageIndex = frame.indexOf(page);
        let replaceIndex = -1;
        if(isFault){
            pageFault++;
            if(frame.length < frameSize){
                frame.push(page)
                replaceIndex = frame.length - 1;
            }else {
                while(true){
                    if(bit[pointer] === 0){
                        replaceIndex = pointer;
                        frame[pointer] = page;
                        pointer = (pointer + 1) % frameSize;
                        break;
                    }else if(bit[pointer] === 1){
                        bit[pointer] = 0;
                        pointer = (pointer + 1) % frameSize;
                    }   
                }
            }
        }else {
            bit[pageIndex] = 1;
        }
        console.log(frame);
        steps.push({
            index: replaceIndex,
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