let video;
let poseNet;
let poses = [];

function setup() {
  createCanvas(windowWidth, windowHeight);

  // 鏡頭
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  // PoseNet
  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on("pose", gotPoses);
}

function modelReady() {
  console.log("PoseNet ready");
}

function gotPoses(results) {
  poses = results;
}

function draw() {
  background(0);

  // ===== 中央框大小 =====
  let boxW = 640;
  let boxH = 480;

  let x = (width - boxW) / 2;
  let y = (height - boxH) / 2;

  // ===== 框標題 =====
  fill(255);
  textSize(24);
  textAlign(CENTER, CENTER);
  text("414730050 曹苡萱", width / 2, y - 30);

  // ===== 框外框 =====
  noFill();
  stroke(255);
  strokeWeight(3);
  rect(x, y, boxW, boxH);

  // ===== 鏡頭畫面（放進框）=====
  image(video, x, y, boxW, boxH);

  // ===== 骨架 + 花（疊在框內）=====
  push();
  translate(x, y);
  scale(boxW / video.width, boxH / video.height);

  drawSkeleton();
  drawFlowers();

  pop();
}

// ================= 骨架 =================
function drawSkeleton() {
  stroke(0, 255, 0);
  strokeWeight(2);

  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;

    for (let j = 0; j < skeleton.length; j++) {
      let a = skeleton[j][0];
      let b = skeleton[j][1];

      line(a.position.x, a.position.y,
           b.position.x, b.position.y);
    }
  }
}

// ================= 花朵 =================
function drawFlowers() {
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i].pose;

    drawFlower(pose.rightWrist);
    drawFlower(pose.leftWrist);
    drawFlower(pose.nose);
    drawFlower(pose.rightAnkle);
    drawFlower(pose.leftAnkle);
  }
}

function drawFlower(part) {
  if (!part || part.confidence < 0.2) return;

  push();
  translate(part.x, part.y);

  noStroke();

  fill("#FFF0AC");
  for (let i = 0; i < 6; i++) {
    ellipse(0, -10, 12, 18);
    rotate(PI / 3);
  }

  fill("#FFECF5");
  ellipse(0, 0, 10, 10);

  pop();
}

// ===== 視窗自動全螢幕 =====
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
