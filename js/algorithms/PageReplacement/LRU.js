'use strict'

function LRU(pages, frameSize){
    let frame = [];
    let pageFault = 0;
    for(let i = 0; i < pages.length; i++) {
        let page = pages[i];
        if(!frame.includes(page)) {
            pageFault++;
            if(frame.length >= frameSize){
                frame.shift();
            }
        }else {
            frame.splice(frame.indexOf(page), 1);
        }
        frame.push(page);
        console.log(frame);
    }
    return pageFault;
}


export default LRU; 