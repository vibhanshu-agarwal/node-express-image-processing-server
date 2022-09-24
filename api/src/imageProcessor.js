const path = require("path");
const { Worker, isMainThread } = require("worker_threads");
const { tryCatch } = require("ramda");
const pathToResizeWorker = path.resolve(__dirname, "resizeWorker.js");
const pathToMonoChromeWorker = path.resolve(__dirname, "monochromeWorker.js");

//Create the upload path resolver function
function uploadPathResolver(filename) {
  return path.resolve(__dirname, "../uploads", filename);
}

module.exports = function imageProcessor(filename) {
  const sourcePath = uploadPathResolver(filename);
  const resizedDestination = uploadPathResolver("resized-" + filename);
  const monochromeDestination = uploadPathResolver("monochrome-" + filename);
  let resizeWorkerFinished = false;
  let monoChromeWorkerFinished = false;
  return new Promise((resolve, reject) => {
    if (isMainThread) {
      //Do something??
      try {
        const resizeWorker = new Worker(pathToResizeWorker, {
          workerData: { source: sourcePath, destination: resizedDestination },
        });
        const monochromeWorker = new Worker(pathToMonoChromeWorker, {
          workerData: { source: sourcePath, destination: monochromeDestination },
        });
        resizeWorker.on("message", (message) => {
          resizeWorkerFinished = true;
          if (monoChromeWorkerFinished) {
            resolve("resizeWorker finished processing");
          }
        });
        resizeWorker.on("error", (error) => {
          reject(new Error(error.message));
        });
        resizeWorker.on("exit", (code) => {
          if (code !== 0) {
            reject(new Error(`Exited with status code ${code}`));
          }
        });


        monochromeWorker.on("message", (message) => {
          monoChromeWorkerFinished = true;
          if (resizeWorkerFinished) {
            resolve("monochromeWorker finished processing");
          }
        });
        monochromeWorker.on("error", (error) => {
          reject(new Error(error.message));
        });
        monochromeWorker.on("exit", (code) => {
          if (code !== 0) {
            reject(new Error(`Exited with status code ${code}`));
          }
        });
      } catch (error) {
        reject(error);
      }
    } else {
      reject(new Error("not on main thread"));
    }
  });
};
