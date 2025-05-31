'use strict'

function FIFO(pages, frameSize) {
    let frame = [];
    let pageFault = 0;
    let pointer = 0;
    let steps = [];

    pages.forEach((page, idx) =>{
        if(!frame.includes(page)){
            if(frame.length < frameSize){
                frame.push(page);
            }else {
                frame[pointer] = page;
                pointer = (pointer + 1) % frameSize;
            }
            pageFault++;
            console.log(frame);
        }
        steps.push({
            index: idx,
            page,
            frame: [...frame],
            isFault: !frame.includes(page)
        });
    });
    
    return {
        pageFault,
        steps
    }
}

export default FIFO;