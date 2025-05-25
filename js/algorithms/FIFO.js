'use strict'

function FIFO(pages, frameSize) {
    let frame = [];
    let pageFault = 0;

    for(let i = 0; i < pages.length; i++){
        let page = pages[i];
        if(!frame.includes(page)){
            if(frame.length >= frameSize){
                frame.shift();
            }
            frame.push(page);
            pageFault++;
            console.log(frame);
        }
    }
    
    return pageFault;
}

export default FIFO;