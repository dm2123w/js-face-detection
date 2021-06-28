require("babel-core/register");
require("babel-polyfill");

const video = document.querySelector(".webcam");
const canvas = document.querySelector(".video");
const ctx = canvas.getContext("2d");
const faceCanvas = document.querySelector(".face");
const faceCtx = faceCanvas.getContext("2d");
const faceDetector = new window.FaceDetector();
const SIZE = 10;

// Write a function that will populate the users video
async function populateVideo() {
    const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1920, height: 720 },
    });
    video.srcObject = stream;
    await video.play();
    // Size the canvases to be the same size as the video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    faceCanvas.width = video.videoWidth;
    faceCanvas.height = video.videoHeight;
}

async function detect() {
    const faces = await faceDetector.detect(video);
    // Ask the browser when the nex animation frame is, and tell it to run detect for us
    faces.forEach(drawFace);
    faces.forEach(censor);
    requestAnimationFrame(detect);
}

function drawFace(face) {
    const { width, height, top, left } = face.boundingBox;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#ffc600";
    ctx.lineWidth = 2;
    ctx.strokeRect(left, top, width, height);
}

function censor({ boundingBox: face }) {
    faceCtx.imageSmoothingEnabled = false;
    faceCtx.clearRect(0, 0, faceCanvas.width, faceCanvas.height);
    // draw the small face
    faceCtx.drawImage(
        // 5 source args
        video, // where does the source come from?
        face.x, // where do we start the source pull from?
        face.y,
        face.width,
        face.height,
        // 4 draw args
        face.x, // where should we start drawing the x and y?
        face.y,
        SIZE,
        SIZE
    );
    // draw the small face back on, but scale up
    faceCtx.drawImage(
        faceCanvas, // source
        face.x, // where do we start the source pull from?
        face.y,
        SIZE,
        SIZE,
        // Drawing args
        face.x,
        face.y,
        face.width,
        face.height
    );
}

populateVideo().then(detect);
