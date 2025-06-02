'use strict'

function FIFO(pages, frameSize) {
    let frame = [];
    let pageFault = 0;
    let pointer = 0;
    let steps = [];
    pages.forEach((page) =>{
        const isFault = !frame.includes(page);
        let replaceIndex = -1;
        if(isFault){
            if(frame.length < frameSize){
                frame.push(page);
                replaceIndex = frame.length - 1;
            }else {
                replaceIndex = pointer;
                frame[pointer] = page;
                pointer = (pointer + 1) % frameSize;
            }
            pageFault++;
            console.log(frame);
        }
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

export default FIFO;