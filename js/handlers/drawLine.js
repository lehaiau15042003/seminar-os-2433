'use strict'

import { renderRequest, renderTimeLine, renderGanttChart } from "./render.js";

function drawLine(canvasId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const margin = 50;
    const trackMax = 199;
    let scaleDisk = (width - 2 * margin) / trackMax;

    const maxTime = 26;
    let scaleProcess = (width - 2 * margin) / maxTime;

    const request = [];
    let headStart = null;
    let pathSteps = [];
    let mode = 'disk';
    let dataBurstTime = [];
    function draw() {
        ctx.clearRect(0, 0, width, height);
        if(mode === 'disk') {
            renderRequest(ctx, request, headStart, width, height, margin, scaleDisk, trackMax, pathSteps);
        }else if(mode === 'process') {
            renderTimeLine(ctx, width, height, margin, scaleProcess, maxTime);
            renderGanttChart(ctx,margin, scaleProcess, dataBurstTime);
        }
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

        setAlgo: (val) => {
            if(val === 'disk' || val === 'process') {
                mode = val;
                draw();
            }
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