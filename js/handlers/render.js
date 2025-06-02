export function renderPages(pages, pageDisplay){
    pageDisplay.innerHTML = '';
    pages.forEach(p => {
        const span = document.createElement('span');
        span.className = 'page-box';
        span.innerText = p;
        pageDisplay.appendChild(span);
    });
}

export function renderFrame(count, frameDisplay) {
    frameDisplay.innerHTML = '';
    for(let i=0; i < count; i++){
        const div = document.createElement('div');
        div.className = 'frame-rows';
        div.innerText = `${i + 1}`;
        frameDisplay.appendChild(div);
    }
}

export function renderSteps(steps, frameSize, frameDisplay, speed = 500) {
    frameDisplay.innerHTML = '';
    const rows = [];
    for(let i=0; i < frameSize; i++) {
        const row = document.createElement('div');
        row.className = 'row';
        frameDisplay.appendChild(row);
        rows.push(row);
    }

    let currentStep = 0;
    function showStep() {
        if(currentStep >= steps.length) return;

        const step = steps[currentStep];
        
        rows.forEach((row, i) => {
            const cell = document.createElement('div');
            cell.className = 'cell';

            if(step.frame[i] != undefined) {   
                if(!step.isFault) {
                    cell.innerText = "|";
                }else {
                    cell.innerText = step.frame[i];
                }
            }

            if(step.isFault && step.index === i){
                cell.classList.add('fault');
            }

            row.appendChild(cell)
        });

        currentStep++;
        setTimeout(showStep, speed);
        }

        showStep();
}
