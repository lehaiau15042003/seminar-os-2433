function FIFO(pages, frameSize) {
    let frame = [];
    let pageFault = 0;

    for(let i = 0; i < pages.length; i++){
        let page = pages[i];
        if(!frame.includes(page)){
            if(frame.length >= frameSize){
                frame.shift();
            }
            frame.push(page);
            pageFault++;
            console.log(frame);
        }
    }
    
    return pageFault;
}

pages = [7,0,1,2,0,3,0,4,2,3,0,3,2,1,2,0,1,7,0,1];
console.log(FIFO(pages, 3));