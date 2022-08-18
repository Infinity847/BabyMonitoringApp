var ready = false;
var babyfound = false; 
var babyfound_previous_processed_state = false;
var stats = document.getElementById("stats");
var confidence = document.getElementById("confidence");
var percent;
function setup() 
{
  stats.innerHTML = "Status : Loading cocossd...";
  canvas = createCanvas(screen.width/2,screen.height/2);
  canvas.center();
  capture = createCapture(VIDEO);
  capture.hide();
  objectDetector = ml5.objectDetector('cocossd',modelLoaded);
}

function modelLoaded() 
{
  stats.innerHTML = "Waiting to be started...";
  console.log("Cocossd is loaded");
}

function draw() 
{
  image(capture,0,0,screen.width/2,screen.height/2);

  if (ready) 
  {
    objectDetector.detect(capture,gotResult);
  }
}

function start() 
{
  ready = true;
}

function gotResult(error, results) 
{
  if (error) 
  {
    console.log(error);
    stats.innerHTML = "Status : Error";
  }
  else
  {
    stats.innerHTML = "Status : Detecting Objects...";
    if (results.length > 0) {
      stats.innerHTML = "Status : Object Detected"
    }else {
      stats.innerHTML = "Status : No Objects Detected"
      confidence.innerHTML = "No people are found.";
    }
    babyfound = false;
    for (i = 0; i < results.length; i++) 
    {
      if (results[i].label == "person") 
      {
        babyfound = true;
        percent = Math.floor(results[0].confidence * 100);
        confidence.innerHTML = "Confidence : " + percent + "%";
        break;
      }
    }
    if (!babyfound) 
    {
      console.log("0");
      if (babyfound != babyfound_previous_processed_state)
      {
        if (!window.speechSynthesis.speaking)
        {
          saytext("Oh no your baby is lost.");
          confidence.innerHTML = "No objects are found.";
          babyfound_previous_processed_state = babyfound;
        }
      }
    }
    else
    {
      console.log("1");
      if (babyfound != babyfound_previous_processed_state)
      {
        if (!window.speechSynthesis.speaking)
        {
          saytext("Found Baby");
          babyfound_previous_processed_state = babyfound;
        }
      }
    }
  }
}

function saytext(text) 
{
  const sound = new SpeechSynthesisUtterance(text);
  sound.rate = 1;
  sound.volume = 1;
  speechSynthesis.speak(sound);
}
