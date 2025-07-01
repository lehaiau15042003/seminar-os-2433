'use strict'

function CLOCK(pages, frameSize) {
    let frame = [];
    let pageFault = 0;
    let pointer = 0;
    let bit = new Array(frameSize).fill(0);
    let steps = [];
    pages.forEach((page) => {
        let isFault = !frame.includes(page);
        let pageIndex = frame.indexOf(page);
        let replaceIndex = -1;
        let currentPointer = -1;
        let nextPointer = -1;
        if(isFault){
            pageFault++;
            if(frame.length < frameSize){
                frame.push(page)
                replaceIndex = frame.length - 1;
                currentPointer = replaceIndex;
                pointer = (replaceIndex + 1) % frameSize;
                nextPointer = pointer;
            }else {
                while(true){
                    if(bit[pointer] === 0){
                        currentPointer = pointer;
                        replaceIndex = currentPointer;
                        frame[pointer] = page;
                        pointer = (pointer + 1) % frameSize;
                        nextPointer = pointer;
                        break;
                    }else if(bit[pointer] === 1){
                        bit[pointer] = 0;
                        currentPointer = pointer;
                        pointer = (pointer + 1) % frameSize;
                        nextPointer = pointer;
                    }   
                }
            }
        }else {
            bit[pageIndex] = 1;
            nextPointer =pointer;
        }
        let saveBit = [...bit];
        console.log(frame);
        steps.push({
            index: replaceIndex,
            page,
            frame: [...frame],
            isFault,
            pointerIndex: currentPointer,
            nextPointer,
            saveBit
        });
    });
    return {
        pageFault,
        steps
    }
}

export default CLOCK;