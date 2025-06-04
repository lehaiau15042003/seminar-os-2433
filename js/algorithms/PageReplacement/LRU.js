'use strict'

function LRU(pages, frameSize){
    let frame = [];
    let pageFault = 0;
    let steps = [];
    let map = new Map();
    pages.forEach((page, idx) => {
        const isFault = !frame.includes(page);
        let replaceIndex = -1;
        if(isFault) {
            pageFault++;
            if(frame.length < frameSize){
                frame.push(page);
                replaceIndex = frame.length - 1;
            }else {
                let indexPage = 0;
                let min = Infinity;
                frame.forEach((value, idx) => {
                    if(map.has(value) && map.get(value) < min) {
                        min = map.get(value);
                        indexPage = idx;
                    }
                });
                frame[indexPage] = page;
                replaceIndex = indexPage;
            }
        }
        map.set(page, idx);
        console.log(frame);

        const exponentIndex = frame.map(value => map.get(value) + 1);

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