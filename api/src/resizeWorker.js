const gm = require("gm");
const {workerData, parentPort} = require("worker_threads");
//Resize photo to be 100 by 100 pixels
gm(workerData.source).resize(100, 100).write(workerData.destination, (error) => {
    if (error) {
        throw error;
    }
    parentPort.postMessage({resized: true});
});