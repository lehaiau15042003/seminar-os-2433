'use strict'

import FIFO from './algorithms/PageReplacement/FIFO.js'
import LRU from './algorithms/PageReplacement/LRU.js'
import OPTIMAL from './algorithms/PageReplacement/OPTIMAL.js'
import CLOCK from './algorithms/PageReplacement/CLOCK.js'

//let pages = [7,0,1,2,0,3,0,4,2,3,0,3,2,1,2,0,1,7,0,1];
//console.log(FIFO(pages, 3));
//console.log(LRU(pages, 3));
//console.log(OPTIMAL(pages, 3));
//console.log(CLOCK(pages, 3));

let pages = [];
let frame = [];
window.onload = function() {
    const pageInput = document.querySelector('.pageInput');
    const pageDisplay = document.querySelector('.page');
    const frameSize = document.querySelector('.frameInput');
    const algorithms = document.querySelector('.pageReplacement').value;
    const frameDisplay = document.querySelector('.frame');

    pageInput.addEventListener('input', (event) => {
            const value = parseInt(pageInput.value, 10);
            if(!isNaN(value)){
                pages.push(value);
                renderPages();
                pageInput.value = '';
            }

            function renderPages(){
                pageDisplay.innerHTML = '';
                pages.forEach(p => {
                    const span = document.createElement('span');
                    span.className = 'page-box';
                    span.innerText = p;
                    pageDisplay.appendChild(span);
                });
            }
    });

    frameSize.addEventListener('input', (event) => {
        const value = parseInt(frameSize.value, 10);
        if(!isNaN(value)){
            frame.push(value);
            renderFrame(count);
            frameSize.value = '';
        }

        function renderFrame(count) {
            frame.innerHTML = '';
            for(let i=0; i < count; i++){
                const div = document.createElement('div');
                div.className = 'frame-rows';
                div.innerText = `Frame ${i + 1}`;
                frame.appendChild(div);
            }
        }
    });

    let res;
    switch(algorithms) {
        case "FIFO":
            res = FIFO(pages, frameSize);
            break;
        case "LRU":
            res = FIFO(pages, frameSize);
            break;
        case "OPTIMAL":
            res = OPTIMAL(pages, frameSize);
            break;
        case "CLOCK":
            res = CLOCK(pages, frameSize);
            break;
        default:
            res = "Thuật toán không hợp lệ";
    }
}
