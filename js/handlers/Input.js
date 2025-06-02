export function pageInputFunc(pageInput, pageDisplay, pages, renderPages) {
    pageInput.addEventListener('input', () => {
        const value = parseInt(pageInput.value, 10);
        if(!isNaN(value)){
            pages.push(value);
            renderPages(pages, pageDisplay);
            pageInput.value = '';
        }
    });

    pageInput.addEventListener('keydown', (e) => {
        if(e.key === 'Backspace' && pageInput.value === '') {
            pages.pop();
            renderPages(pages, pageDisplay);
        }
    });
}


export function frameInputFunc(frameInput, frameDisplay, renderFrame) {
    frameInput.addEventListener('input', () => {
        const value = parseInt(frameInput.value, 10);
        if(!isNaN(value) && value > 0){
            renderFrame(value,frameDisplay);
            frameInput.value = '';
        }
    });
}