'use strict'

function OPTIMAL(pages, frameSize) {
    let frame = [];
    let pageFault = 0;
    let steps = [];
    pages.forEach((page, idx) => {
        let isFault = !frame.includes(page);
        let replaceIndex = -1;
        if(isFault) {
            pageFault++;
            if(frame.length < frameSize) {
                frame.push(page);
                replaceIndex = frame.length - 1;
            }else {
                let indexPage = -1;
                let farthest = -1;
                for(let i = 0; i < frame.length; i++) {
                    let value = frame[i];
                    let future = -1;
                    
                    for(let j = idx + 1; j < pages.length; j++) {
                        if(pages[j] === value) {
                            future = j;
                            break;
                        }
                    }

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

        let futureIndex = [];
        for(let i = 0; i < frame.length; i++) {
            let future = -1;
            for(let j = idx + 1; j < pages.length; j++) {
                if(pages[j] === frame[i]) {
                    future = j;
                    break;
                }
            }
            futureIndex.push(future === -1 ? '∞' : future + 1);
        }

        steps.push({
            index: replaceIndex,
            page,
            frame: [...frame],
            isFault,
            exponentIndex: futureIndex
        });
    });

    return {
        pageFault,
        steps
    }
}

export default OPTIMAL;