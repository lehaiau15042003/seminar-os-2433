'use strict'

export function pageInputFunc(pageInput, pageDisplay, pages, indexDisplay,renderPages, renderIndex) {
    pageInput.addEventListener('input', () => {
        const value = parseInt(pageInput.value, 10);
        if(!isNaN(value)){
            pages.push(value);
            renderPages(pages, pageDisplay);
            pageInput.value = '';
        }
        renderIndex(pages, indexDisplay);
    });

    pageInput.addEventListener('keydown', (e) => {
        if(e.key === 'Backspace' && pageInput.value === '') {
            pages.pop();
            renderPages(pages, pageDisplay);
            renderIndex(pages, indexDisplay);
        }
    });
}


export function frameInputFunc(frameInput, frameDisplay, renderFrame, bitDisplay, renderBit) {
    frameInput.addEventListener('input', () => {
        const value = parseInt(frameInput.value, 10);
        if(!isNaN(value) && value > 0){
            renderFrame(value,frameDisplay);
            renderBit(value, bitDisplay);
            frameInput.value = '';
        }
    });
}

export function queueInputFunc(queueInput, drawLineInstance) {
    queueInput.addEventListener('keydown', (e) => {
        if(e.key === ' ' ) {
            e.preventDefault();
            const currentValue = queueInput.value.trim();
            if(currentValue !== '') {
                queueInput.value = currentValue + ', ';
            }
        }
    });

    queueInput.addEventListener('keydown', (e) => {
        if(e.key === 'Enter') {
            e.preventDefault();
            const currentValue = queueInput.value.trim();
            if(currentValue !== '' ) {
                const numbers = currentValue.split(',').map(num => parseInt(num.trim(), 10)).filter(num => !isNaN(num));
                drawLineInstance.clear();
                numbers.forEach(track => {
                    drawLineInstance.request.push(track);
                });
                drawLineInstance.draw();
            }
        }
    });
}

export function headInputFunc(headInput, drawLineInstance) {
    headInput.addEventListener('keydown', (e) => {
        if(e.key === 'Enter') {
            e.preventDefault();
            const input = headInput.value.trim();
            if(input === '') return;
            const headStart = parseInt(input, 10);
            if(isNaN(headStart)) return;
            drawLineInstance.setHeadStart(headStart);
        }     
    });
}