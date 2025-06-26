'use strict'

import { renderRequest, renderTimeLine } from "./render.js";

function drawLine(canvasId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const margin = 50;

    const trackMax = 199;
    let scaleDisk = (width - 2 * margin) / trackMax;

    let maxTime = 26;
    let scaleProcess = (width - 2 * margin) / maxTime;

    const request = [];
    let headStart = null;
    let pathSteps = [];
    let dataBurstTime = [];
    function draw() {
        ctx.clearRect(0, 0, width, height);
        renderRequest(ctx, request, headStart, width, height, margin, scaleDisk, trackMax, pathSteps);
    }

    return {
        draw,
        clear: () => {
            request.length = 0;
            headStart = null;
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

        setDataBurstTime: (val) => {
            dataBurstTime = val;
            draw();
        },
        request
    };
}

export default drawLine;