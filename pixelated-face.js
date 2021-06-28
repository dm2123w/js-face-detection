require("babel-core/register");
require("babel-polyfill");

const video = document.querySelector(".webcam");
const canvas = document.querySelector(".video");
const ctx = canvas.getContext("2d");
const faceCanvas = document.querySelector(".face");
const faceCtx = canvas.getContext("2d");
const faceDetector = new window.FaceDetector();

// Write a function that will populate the users video
async function populateVideo() {
    const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1920, height: 720 },
    });
    video.srcObject = stream;
    await video.play();
    // Size the canvases to be the same size as the video
    console.log(video.videoWidth, video.videoHeight);
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    faceCanvas.width = video.videoWidth;
    faceCanvas.height = video.videoHeight;
}

async function detect() {
    const faces = await faceDetector.detect(video);
    console.log(faces.length);
    // Ask the browser when the nex animation frame is, and tell it to run detect for us
    // requestAnimationFrame(detect);
}

function drawFace(face) {

}

populateVideo().then(detect);
