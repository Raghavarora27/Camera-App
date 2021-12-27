let video = document.querySelector("video");
let RecordBtn = document.querySelector("#record");
let mediaRecorder;
let chunks = [];
let captureBtn = document.querySelector("#capture");
let IsRecording = false;
let recDiv = RecordBtn.querySelector("div");
let capDiv = captureBtn.querySelector("div");
let body = document.querySelector("body");
let appliedFilter;
let minZoom = 1;
let maxZoom = 3;
let zoomInBtn = document.querySelector(".zoom-in");
let zoomOutBtn = document.querySelector(".zoom-out");
let currZoom = 1;
let filters = document.querySelectorAll(".filter");

zoomInBtn.addEventListener("click", function () {
  if (currZoom < maxZoom) currZoom = currZoom + 0.1;

  video.style.transform = `scale(${currZoom})`;
});

zoomOutBtn.addEventListener("click", function () {
  if (currZoom > minZoom) currZoom = currZoom - 0.1;

  video.style.transform = `scale(${currZoom})`;
});

for (let i = 0; i < filters.length; i++) {
  filters[i].addEventListener("click", function (e) {
    removeFilter();
    appliedFilter = e.currentTarget.style.backgroundColor;
    let div = document.createElement("div");
    div.style.backgroundColor = appliedFilter;
    div.classList.add("filter-div");
    body.append(div);
  });
}

// StartBtn.addEventListener("click", function () {
//   mediaRecorder.start();
// });
// StopBtn.addEventListener("click", function () {
//   mediaRecorder.stop();
// });

RecordBtn.addEventListener("click", function (e) {
  if (IsRecording) {
    mediaRecorder.stop();
    IsRecording = false;
    recDiv.classList.remove("record-animation");
  } else {
    mediaRecorder.start();
    appliedFilter = "";
    removeFilter();
    currZoom = 1;
    video.style.transform = `scale(${currZoom})`;
    IsRecording = true;
    recDiv.classList.add("record-animation");
  }
});

captureBtn.addEventListener("click", function () {
  if (IsRecording) return;
  capDiv.classList.add("capture-animation");
  setInterval(function () {
    capDiv.classList.remove("capture-animation");
  }, 1000);

  // jo bhi image screen par dikha rha h usse save karwana h
  let canvas = document.createElement("canvas");
  canvas.height = video.videoHeight;
  canvas.width = video.videoWidth;
  let tool = canvas.getContext("2d");

  //origin shift

  tool.translate(canvas.width / 2, canvas.height / 2);
  tool.scale(currZoom, currZoom);
  tool.translate(-canvas.width / 2, -canvas.height / 2);
  tool.drawImage(video, 0, 0);

  if (appliedFilter) {
    tool.fillStyle = appliedFilter;
    tool.fillRect(0, 0, canvas.width, canvas.height);
  }

  let link = canvas.toDataURL(); // canvas pe jo bhi hoga uska url banke aajayega // canvas ki img ko link me convert kardia
  let a = document.createElement("a");
  a.href = link;
  a.download = "pic.png";
  a.click();
  a.remove(0);
  canvas.remove();
});

// promise Based -> kyoki yeh function permission ka wait karta hai
// user se camera or mic ki persmission laake dede
// yeh ek object return karta h media stream type ka jisme aapke tracks hote hai jisme audio video files hoti hai
// aab in files ko use kaise karna hai vo neeche function me likha h
navigator.mediaDevices
  .getUserMedia({ video: true, audio: true })
  .then(function (MediaStream) {
    mediaRecorder = new MediaRecorder(MediaStream); /// mediaStream me camera ka input aarha h
    // object           // object blueprint
    // dataavailable is a event jo chuncks/tukdo me data mil rha h , humme vo sare thukde jood ke video banani padgegi
    mediaRecorder.addEventListener("dataavailable", function (e) {
      chunks.push(e.data);
    });

    mediaRecorder.addEventListener("stop", function (e) {
      let blob = new Blob(chunks, { type: "video/mp4" }); // blob is a large binary file /// yeh sare chunks ko jodke ek mp4 file
      // banenge
      chunks = [];
      let a = document.createElement("a");
      let url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = "video.mp4";
      a.click();
      a.remove();
    });
    video.srcObject = MediaStream;
  })
  .catch(function (err) {
    console.log(err);
  });

function removeFilter() {
  let filter = document.querySelector(".filter-div");
  if (filter) filter.remove();
}
