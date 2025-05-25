'use strict'

function OPTIMAL(pages, frameSize) {
    let frame = [];
    let pageFault = 0;
    for(let i = 0; i < pages.length; i++) {
        let page = pages[i];
        if(!frame.includes(page)){
            pageFault++;
            if(frame.length >= frameSize) {
                let farthest = -1;
                let index = -1;
                for(let j = 0; j < frame.length; j++) {
                    let temp = pages.slice(i + 1).indexOf(frame[j]);
                    if(temp === -1){
                        index = j;
                        break;
                    }else if(temp > farthest){
                        farthest = temp;
                        index = j;
                    }
                }
                frame.splice(index, 1);
            }
        }else {
            frame.splice(frame.indexOf(page), 1);
        }
        frame.push(page);
        console.log(frame);
    }
    return pageFault;
}

export default OPTIMAL;