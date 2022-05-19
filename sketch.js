
// image paths
let imgFiles = ['./trackers/botEye.png' , './trackers/caged.png', './trackers/drill_cauldron.png', './trackers/drill.png', './trackers/intergalactic_goop.png', './trackers/patterMarkerzSqr.png', './trackers/plant_tornado.png', './trackers/soupy_cauldron.png', './trackers/soupy_cloth.png', './trackers/spikey_discs.png', './trackers/TimeMrkr.png'];
// array for the images
let images = [];
// array to hold the tracker objects 
let Trackers = [];

let bkgImg;

// how long each move is
let cycleLength = 200;
let cyclePos =0;//holds the position
let changePos = 0;//holds the number of changes
// number of trackers to be made
let numTrackers = 4;

let puased = false;
let puasedTimer = 0;
let pausedLen = 30;

let titleImg, QrImg; 


function setup() {
  createCanvas(windowWidth, windowHeight);
  background(220);

  bkgImg = loadImage("./normals.png");
  QrImg = loadImage("./qr-code.png");


  titleImg = loadImage("./normals.png");

  // load images from files to images list
  for(let i=0; i<imgFiles.length; i++){

    let path = imgFiles[i];
    let thisImg = loadImage(path);
    append(images, thisImg);
  }

  // create tracker array
  for ( let i=0; i<numTrackers; i++){
    // find a random image
    let thisImg = random(images);
    // creat a tracor with that image and details for the curves to follow
    let tracker = { 
      img: thisImg,
      size:150,
      start: createVector(0,0),
      end: createVector(200,width/2),
      startCntrl: createVector(600,100),
      endCntrl: createVector(500,width/2),
      pos: createVector(0,0),
      vel: createVector(0,0)
    }
    // append that to the array
    append(Trackers, tracker);
  }
  // randomise the trackers to start
  RandomTracker();

  background(0,255);
}


function draw() {
  background(0,1);

  // what step in the loop are we
  let moduloCycle = cyclePos%cycleLength;

  // if at the end change for the next loop
  if(moduloCycle == 0 && puased==false){
    
    RandomTracker();
  }
  else if(puasedTimer<pausedLen){
    puasedTimer++;
  }
  else{
    puased=false;
  }

  // find where we are in the loop 
  let cycleFrac = moduloCycle/cycleLength; 

  // loop over thet trackers
  for(let i=0; i<Trackers.length; i++){
    
    // get this tracker
    let thisTrkr = Trackers[i];

    // set its x,y pos by lerping over the curve with curve point at the position in the loop
    let x = curvePoint(thisTrkr.startCntrl.x, thisTrkr.start.x, thisTrkr.end.x, thisTrkr.endCntrl.x, cycleFrac);
    let y = curvePoint(thisTrkr.startCntrl.y, thisTrkr.start.y, thisTrkr.end.y, thisTrkr.endCntrl.y, cycleFrac);
    /*
    thisTrkr.vel.x += ( x- thisTrkr.pos.x );
    thisTrkr.vel.y += ( y- thisTrkr.pos.y );

  

    for(let j=0; j<Trackers.length; j++){
      if(i==j) continue;
      // get this tracker
      let thatTrkr = Trackers[j];
      
      let distance = dist(thisTrkr.pos.x, thisTrkr.pos.y,thatTrkr.pos.x, thatTrkr.pos.y );

     let theirSize = (thatTrkr.size+thatTrkr.size)*1.2;

      if(distance<theirSize){

        let theirSepX =  thisTrkr.pos.x - thatTrkr.pos.x ;
        let theirSepY =  thisTrkr.pos.y - thatTrkr.pos.y ;

        let theirSclr = 1-(distance/theirSize); 

        theirSepX*= theirSclr;
        theirSepY*=theirSclr;

        thisTrkr.vel.x += theirSepX;
        thatTrkr.vel.y += theirSepY;

      }

    }

    thisTrkr.vel.x*=0.01;
    thisTrkr.vel.y*=0.01;

    thisTrkr.pos.x+=thisTrkr.vel.x;
    thisTrkr.pos.y+=thisTrkr.vel.y;
    */
    
    thisTrkr.pos.x=x;
    thisTrkr.pos.y=y;



    push();
    let size = thisTrkr.size*2.5;
    translate(thisTrkr.pos.x +(thisTrkr.size/2), thisTrkr.pos.y+(thisTrkr.size/2));
    rotate(radians(frameCount+i));
    image(bkgImg, -size/2,-size/2, size,size);
    pop(); 

  }
  for(let i=0; i<Trackers.length; i++){


    let thisTrkr = Trackers[i];
    // draw an image at that point 
    image(thisTrkr.img, thisTrkr.pos.x, thisTrkr.pos.y, thisTrkr.size,thisTrkr.size);

  }
  
  if(!puased){
    // move it one more step
    cyclePos++;
  }

  image(QrImg, 0, height-150, 150, 150);

}
// sets a new destination and when off screen changes the img
function RandomTracker(){

  //add to the position offset randomly
  changePos+= round(random(1,Trackers.length-1));

  // loop over the markers
  for(let i=0; i<Trackers.length; i++){

    // this tracker in the loop
    let thisTrkr = Trackers[i];
    // ass this is at the end set the new start to the end
    thisTrkr.start = thisTrkr.end;

    // if it is in the midle set the end to offscreen
    if(thisTrkr.end.x == width/2){

      puased=true;
      puasedTimer=0;

      // set endx to this trackers size
      let endX = thisTrkr.size;
      // if rand greater than 1
      if(random(2)>1){
        // set to off right of screen
        endX = width + endX*0.4;
      }
      else{
        // else off left of screen
        endX =  -endX*1.5;
      }

      // get the y position from the sorter, offset with the tracke num + offset
      let endY =  sortedY(thisTrkr, i+changePos);

      // set the new end pos
      thisTrkr.end = createVector(endX,endY);
      // randomize the two controls to give them random bends
      thisTrkr.startCntrl =  createVector(random(width),random(height));
      thisTrkr.endCntrl = createVector(random(width),random(height));
    
      

    }
    else{//else the markers are ofscreen 

      image(titleImg, (width/2)-(titleImg.width/2), (height/2)-(titleImg.height/2));
      puased=false;
      
      let imageIndx = (i+changePos)%images.length;
      // set to random image
      thisTrkr.img = images[imageIndx];
      //endx to middle of screen
      let endX = width/2;
      // endy to sorted pos
      let endy = sortedY(thisTrkr, i+changePos);
      // set the end point
      thisTrkr.end = createVector(endX,endy);
      // randomise the controll for random curves
      thisTrkr.startCntrl =  createVector(random(width),random(height));
      thisTrkr.endCntrl = createVector(random(width),random(height));
      // call flipsides function to maybe flip it
      flipSides(thisTrkr);
    }
  }
  // check if there are any crossovers and sort it out!
  crossoverCheck();
}

// places them randomly within their i division
function sortedY(trkr, i){
  // modulo i over num of trackers
  i = i%numTrackers;
  // find the fraction of screen per marker
  let yDivs = (height*0.8)/numTrackers;
  // set min pos by multiply the div by i
  let yMin = (yDivs*i)+(height*0.1);
  // set max by adding one more division minus the size of the image
  let yMax = (yDivs+yMin)-trkr.size;
  // return a random value between the two;
  return random(yMin, yMax);
}


// flips images that have multiple on one side
function flipSides(trkr){
 //bool to see if there are other images on the same side
    let moreThanOne = false;
    // loop over trackers
      for(let j=0; j<Trackers.length; j++){
        // get the tracker
        let thisTracker = Trackers[j];
        // is it in the same side?
        if( trkr.start.x == thisTracker.start.x ){
          //check the bool true
          moreThanOne = true;
        
        }
      }
      // if theres more than one
      if(moreThanOne){

          // and random is greater than 1
          if(random(2)>1){
            let endX = trkr.size;
            if(trkr.start == -endX){//if the image is of to the left
              // set to off right of screen
            // set to off right of screen
            endX = width + endX*0.4;
           }
           else{
           // else off left of screen
           endX =  -endX*1.5;
            }
            // set the end pos x
            trkr.start.x = endX;
          } 

      }
    
}

function crossoverCheck(){

  //loop trackers
  for(let i=0; i<Trackers.length; i++){
    // get a tracker
  let trkr = Trackers[i];
    // loop trackers again
    for(let j=0; j<Trackers.length; j++){
      // get the second loops tracker
      let thisTracker = Trackers[j];
      // if they are the same tracker skip this loop
      if(i==j){
        continue;
      }
      // if they are in the same x pos/side/place
      if( trkr.start.x == thisTracker.start.x ){
        // this bits a bit dodgy i think!!!!!
        let crossOver = false;
        if(trkr.start.y>thisTracker.start.y && trkr.end.y<thisTracker.end.y){
          crossOver=true;
        }
        else if(trkr.start.y<thisTracker.start.y && trkr.end.y>thisTracker.end.y){
          crossOver=true;
        }

        //get the distance between the start points and the end points
        let startDist = trkr.start.y - thisTracker.start.y;
        let endDist = trkr.end.y - thisTracker.end.y;

        //if the startdistance is greater than the difference of distance (probably wrong)
        if(crossOver){
          // swap the end points
          let oldEnd = thisTracker.end;
          thisTracker.end = trkr.end;
          trkr.end = oldEnd;
        }
      }

    }


  }


}


// obsolete recursive function
function randomY(trkr){

  let randY =  random(height-trkr.size);

  let failed = false;

  for(let i=0; i<Trackers.length; i++){

    let thisTrkr = Trackers[i];

    if(thisTrkr.pos.y==trkr.pos.y){
      continue;
    }

    let dist = thisTrkr.end.y - randY;
    dist = abs(dist);

    if(dist< trkr.size + thisTrkr.size){
      failed = true 
    }
    
  }

  if(failed){
    randY = randomY(trkr);
  }

  return randY;

}

// fulscreen on mouse press
function mousePressed() {
      let fs = fullscreen();
    fullscreen(!fs);

}
// resize canvas when screen resized 
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}