'use strict'

import drawRequest from "./drawRequest.js";

function drawLine(canvasId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const margin = 50;
    const trackMax = 199;
    const scale = (width - 2 * margin) / trackMax;

    const request = [];
    let headStart = null;
    let pathSteps = [];
    
    function draw() {
        drawRequest(ctx, request, headStart, width, height, margin, scale, trackMax, pathSteps);
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

        setSteps: (steps) => {
            pathSteps = steps;
            draw();
        },

        get headStart() {
            return headStart;
        },

        request
    };
}

export default drawLine;