'use strict'

function LRU(pages, frameSize){
    let frame = [];
    let pageFault = 0;
    let steps = [];
    let map = new Map();
    pages.forEach((page, idx) => {
        let isFault = !frame.includes(page);
        let replaceIndex = -1;
        if(isFault) {
            pageFault++;
            if(frame.length < frameSize){
                frame.push(page);
                replaceIndex = frame.length - 1;
            }else {
                let indexPage = 0;
                let min = Infinity;
                for(let i = 0; i < frame.length; i++) {
                    let value = frame[i];
                    let lastUsed = map.get(value);
                    if(lastUsed < min) {
                        min = lastUsed;
                        indexPage = i;
                    }
                }
                frame[indexPage] = page;
                replaceIndex = indexPage;
            }
        }
        map.set(page, idx);

        let exponentIndex = frame.map(value => map.get(value) + 1);
        console.log(exponentIndex);

        steps.push({
            index: replaceIndex,
            page,
            frame: [...frame],
            isFault,
            exponentIndex
        });
    });
    return {
        pageFault,
        steps
    }
}


export default LRU; 