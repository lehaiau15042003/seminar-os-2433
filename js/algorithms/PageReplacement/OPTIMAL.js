'use strict'

function OPTIMAL(pages, frameSize) {
    let frame = [];
    let pageFault = 0;
    let steps = [];
    pages.forEach((page, idx) => {
        const isFault = !frame.includes(page);
        let replaceIndex = -1;
        if(isFault){
            pageFault++;
            if(frame.length < frameSize) {
                frame.push(page);
                replaceIndex = frame.length - 1;
            }else {
                let indexPage = -1;
                let farthest = -1;
                for(let i = 0; i < frame.length; i++) {
                    const value = frame[i];
                    const future = pages.slice(idx + 1).indexOf(value);
                    if(future === -1) {
                        indexPage = i;
                        break;
                    }else if(future > farthest) {
                        farthest = future;
                        indexPage = i;
                    }
                }
                frame[indexPage] = page;
                replaceIndex = indexPage;
            }
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

export default OPTIMAL;