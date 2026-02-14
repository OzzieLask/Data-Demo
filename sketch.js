/*
Olympian heights per sport

//US GOLD MEDALISTS 2016 HEIGHT

Get 4 column in csv, Sex
Get 6 column in csv, Height 
Get 14 column in csv, Sport
Get 16 column in csv, Medal
Show text for each sport name
Rectangle size based on height
Rectangle color based on sex
Use AI to make it cool

*/

let table;
let sex, athleteHeight, sport, medal;
let dataLoaded = false;

// Hover states and animation
let fHovered = false;
let mHovered = false;
let fLocked = false;
let mLocked = false;
let fBarHeight = 0;
let mBarHeight = 0;

// Camera/pan offset
let panOffset = 0;
let targetPanOffset = 0;

// Statistics
let femaleAvgHeight = 0;
let maleAvgHeight = 0;
let femaleTopSports = [];
let maleTopSports = [];



function fCircle() {
    // Drop shadow
    drawingContext.shadowBlur = 20;
    drawingContext.shadowColor = 'rgba(0, 0, 0, 0.3)';
    drawingContext.shadowOffsetX = 5;
    drawingContext.shadowOffsetY = 5;
    
    noStroke();
    fill(250, 150, 100);
    // Pulsing effect
    let pulse = sin(frameCount * 0.05) * 10 + 200;
    circle(width/4, height/2, pulse, pulse);
    
    // Reset shadow
    drawingContext.shadowBlur = 0;
}

function mCircle() {
    // Drop shadow
    drawingContext.shadowBlur = 20;
    drawingContext.shadowColor = 'rgba(0, 0, 0, 0.3)';
    drawingContext.shadowOffsetX = 5;
    drawingContext.shadowOffsetY = 5;
    
    noStroke();
    fill(100, 150, 250);
    // Pulsing effect
    let pulse = sin(frameCount * 0.05) * 10 + 200;
    circle(3*width/4, height/2, pulse, pulse);
    
    // Reset shadow
    drawingContext.shadowBlur = 0;
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  loadData();
}

function calculateStatistics() {
  // Calculate average heights
  let femaleHeights = [];
  let maleHeights = [];
  let femaleSports = {};
  let maleSports = {};
  
  for (let i = 0; i < table.getRowCount(); i++) {
    let h = parseFloat(athleteHeight[i]);
    if (isNaN(h)) continue;
    
    if (sex[i] === 'F') {
      femaleHeights.push(h);
      if (!femaleSports[sport[i]]) femaleSports[sport[i]] = [];
      femaleSports[sport[i]].push(h);
    } else if (sex[i] === 'M') {
      maleHeights.push(h);
      if (!maleSports[sport[i]]) maleSports[sport[i]] = [];
      maleSports[sport[i]].push(h);
    }
  }
  
  femaleAvgHeight = femaleHeights.reduce((a, b) => a + b, 0) / femaleHeights.length;
  maleAvgHeight = maleHeights.reduce((a, b) => a + b, 0) / maleHeights.length;
  
  // Calculate top 3 sports by average height
  femaleTopSports = getTop3Sports(femaleSports);
  maleTopSports = getTop3Sports(maleSports);
}

function getTop3Sports(sportsData) {
  let sportAvgs = [];
  for (let sportName in sportsData) {
    let avg = sportsData[sportName].reduce((a, b) => a + b, 0) / sportsData[sportName].length;
    sportAvgs.push({ name: sportName, avgHeight: avg });
  }
  sportAvgs.sort((a, b) => b.avgHeight - a.avgHeight);
  return sportAvgs.slice(0, 3);
}

function cmToFeetInches(cm) {
  let totalInches = cm / 2.54;
  let feet = Math.floor(totalInches / 12);
  let inches = Math.round(totalInches % 12);
  // Fix: if inches rounds to 12, add a foot
  if (inches === 12) {
    feet += 1;
    inches = 0;
  }
  return `${feet}'${inches}"`;
}

function drawBar(x, y, barHeight, avgHeight, topSports, isHovered, isFemale) {
  if (barHeight < 1) return;
  
  push();
  
  // Oscillation when not hovered
  let oscillation = 0;
  if (!isHovered && barHeight > 1) {
    oscillation = sin(frameCount * 0.03) * 5;
  }
  
  // Draw bar with drop shadow
  let barWidth = 60;
  let barY = y - 100 - barHeight + oscillation;
  
  // Drop shadow
  drawingContext.shadowBlur = 15;
  drawingContext.shadowColor = 'rgba(0, 0, 0, 0.3)';
  drawingContext.shadowOffsetX = 5;
  drawingContext.shadowOffsetY = 5;
  
  noStroke();
  if (isFemale) {
    fill(250, 150, 100, 200);
  } else {
    fill(100, 150, 250, 200);
  }
  rect(x - barWidth/2, barY, barWidth, barHeight);
  
  // Reset shadow for text
  drawingContext.shadowBlur = 0;
  drawingContext.shadowOffsetX = 0;
  drawingContext.shadowOffsetY = 0;
  
  // Draw average height label on bar
  fill(0);
  noStroke();
  textSize(16);
  textAlign(CENTER);
  text(cmToFeetInches(avgHeight), x, barY - 15 + oscillation);
  
  // Draw top 3 sports
  if (barHeight > avgHeight * 1.5) {
    textAlign(LEFT);
    textSize(12);
    let textX = x + barWidth/2 + 15;
    
    for (let i = 0; i < topSports.length; i++) {
      let textY = barY + 30 + (i * 25) + oscillation;
      fill(0);
      text(`${i + 1}. ${topSports[i].name}`, textX, textY);
      fill(100);
      textSize(10);
      text(cmToFeetInches(topSports[i].avgHeight), textX, textY + 12);
      textSize(12);
    }
  }
  
  pop();
}

async function loadData() {
  table = await loadTable('Data/dataset_olympics.csv', ',', 'header');
  console.log(table);

  sex = table.getColumn('Sex');
  athleteHeight = table.getColumn('Height');
  sport = table.getColumn('Sport');
  medal = table.getColumn('Medal');
  
  calculateStatistics();
  dataLoaded = true;
}

function draw() {
  background(220);
  
    textAlign(CENTER, CENTER);
    text("American Olympic Gold Medalists 2016 and Before - Average Heights", width/2, 50);

  if(dataLoaded && table){
    // Check hover states
    let fCenterX = width/4;
    let fCenterY = height/2;
    let mCenterX = 3*width/4;
    let mCenterY = height/2;
    let circleRadius = 100;
    
    // Check if hovering (or locked)
    let fHovering = dist(mouseX, mouseY, fCenterX, fCenterY) < circleRadius;
    let mHovering = dist(mouseX, mouseY, mCenterX, mCenterY) < circleRadius;
    
    fHovered = fLocked || fHovering;
    mHovered = mLocked || mHovering;
    
    // Calculate target pan offset based on whether any bars are showing
    if (fHovered || mHovered) {
      targetPanOffset = 150;
    } else {
      targetPanOffset = 0;
    }
    panOffset = lerp(panOffset, targetPanOffset, 0.08);
    
    // Apply pan transform
    push();
    translate(0, panOffset);
    
    // Animate bar heights
    let targetFHeight = fHovered ? femaleAvgHeight * 2 : 0;
    let targetMHeight = mHovered ? maleAvgHeight * 2 : 0;
    fBarHeight = lerp(fBarHeight, targetFHeight, 0.1);
    mBarHeight = lerp(mBarHeight, targetMHeight, 0.1);
    
    // Draw female section
    drawBar(fCenterX, fCenterY, fBarHeight, femaleAvgHeight, femaleTopSports, fHovered, true);
    
    // Ensure no shadow for text
    drawingContext.shadowBlur = 0;
    drawingContext.shadowOffsetX = 0;
    drawingContext.shadowOffsetY = 0;
    
    fill(0);
    textSize(14);
    textAlign(CENTER, CENTER);
    text("Female Athletes", fCenterX, fCenterY + 120);
    fCircle();
    
    // Draw male section
    drawBar(mCenterX, mCenterY, mBarHeight, maleAvgHeight, maleTopSports, mHovered, false);
    
    // Ensure no shadow for text
    drawingContext.shadowBlur = 0;
    drawingContext.shadowOffsetX = 0;
    drawingContext.shadowOffsetY = 0;
    
    fill(0);
    text("Male Athletes", mCenterX, mCenterY + 120);
    mCircle();
    
    pop();
  }
}

function mousePressed() {
  if (dataLoaded && table) {
    let fCenterX = width/4;
    let fCenterY = height/2 + panOffset;
    let mCenterX = 3*width/4;
    let mCenterY = height/2 + panOffset;
    let circleRadius = 100;
    
    // Toggle locked state when clicking on circles
    if (dist(mouseX, mouseY, fCenterX, fCenterY) < circleRadius) {
      fLocked = !fLocked;
    }
    if (dist(mouseX, mouseY, mCenterX, mCenterY) < circleRadius) {
      mLocked = !mLocked;
    }
  }
}


/*
Please edit my code so that hovering over fCircle() and/or mCircle() will show the average height of the athletes in that respective sex (fCircle for female, mCircle for male).
Data should be revealed as a bar, with the bar height representing the average height of the athletes. The bar should be displayed above the respective circle when hovered over. The bar should also have a label indicating the average height in Feet/Inches. Use Lerp to animate the bar height smoothly revealing and hiding itself when hovering and unhovering, as if it is coming out of the circles.
On the bar, include the top 3 tallest sports for that gender, with the sport names and their average heights displayed as text next to the bar. The sports should be listed in descending order of average height, with the tallest sport at the top. The text should be positioned to the right of the bar, and should be clearly legible against the background.
Use Sine/Cosine functions to create a subtle oscillation effect on the bar and text when they are not hovered, giving the visualization a dynamic and engaging feel indicating that it is interactible. The oscillation should be gentle and not distract from the information being presented.

to copilot
Please edit my code with the following behavior:
1. Hover Interaction
When the user hovers over:
- fCircle() → show data for female athletes
- mCircle() → show data for male athletes
2. Average‑Height Bar
When hovered:
- Display a vertical bar above the respective circle.
- The bar height should represent the average height of athletes of that sex.
- The bar should include a label showing the average height in Feet/Inches.
- The bar should animate smoothly using lerp() when appearing and disappearing, as if it is “growing out” of the circle.
3. Top‑3 Tallest Sports
On the bar, display:
- The top 3 tallest sports for that gender.
- Each entry should include:
- The sport name
- The average height for that sport
- List them in descending order (tallest at the top).
- Position the text to the right of the bar.
- Ensure the text is clearly readable against the background.
4. Idle Oscillation
When not hovered:
- Apply a gentle oscillation to both the bar and the text.
- Use sine/cosine functions to create a subtle floating motion.
- The effect should be:
- Soft
- Slow
- Non‑distracting
- Just enough to signal interactivity

*/