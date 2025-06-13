'use strict'

import drawRequest from "./drawRequest.js";

function drawLine(canvasId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const margin = 200;
    const trackMax = 199;
    const scale = (width - 2 * margin) / trackMax;

    const request = [];
    let headStart = null;

    
    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const track = Math.floor((x - margin) / scale);
        if(track >= 0 && track <= trackMax && !request.includes(track)) {
            request.push(track);
            draw();
        }
    });

    function draw() {
        drawRequest(ctx, request, headStart, width, height, margin, scale, trackMax);
    }

    return {
        draw,
        clear: () => {
            request.length = 0;
            draw();
        },

        setHeadStart: (val) => {
            headStart = val;
            draw();
        },

        addRequest: (val) => {
            if(!request.includes(val)) {
                request.push(val);
                draw();
            }
        },

        request
    };
}

export default drawLine;