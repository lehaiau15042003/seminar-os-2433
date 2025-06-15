'use strict'

import drawBaseLine from "./drawBaseLine.js";
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

    function draw() {
        drawBaseLine(ctx, width, height, margin, trackMax, scale);
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

        setSteps: (steps) => {
            pathSteps = steps;
            draw();
        },

        drawBaseLine: () => {
            drawBaseLine(ctx, width, margin, trackMax, scale);
        },

        get headStart() {
            return headStart;
        },

        request
    };
}

export default drawLine;