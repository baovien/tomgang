var gainCount;
var autoClick;
var proteins;
var stringlet;
var labCount;
var multiplier;

function timer(){
    if((autoClick + labCount) >= 1){
        if($('#benkmann').attr('src') == "images/benk.png"){
            $('#benkmann').attr('src','images/benkOpp.png');
        }else{
            $('#benkmann').attr('src','images/benk.png');
        }
    }

    gainCount += autoClick/5;
    gainCount += proteins/2;
    gainCount += stringlet;
    gainCount += labCount*2;
    update();
}

function update(){
    $('#gainNumber').html(gainCount); 
    $('#amountAutoClick').html("You Own " + autoClick + " Carb snack(s)");
    $('#costAutoClick').html("Cost: " + ((autoClick+1) * 12));

    $('#amountProteins').html("You Own " + proteins + " Protein shake(s)");
    $('#costProteins').html("Cost: " + ((proteins+1) * 30));

    $('#amountStringlet').html("You Own " + stringlet + " Stringlet(s)");
    $('#costStringlet').html("Cost: " + ((stringlet+1) * 60));

    $('#amountLab').html("You Own " + labCount + " Grunt(s)");
    $('#costLab').html("Cost: " + ((labCount+1) * 120));

    $('#gainspersecond').html((((autoClick)+(labCount*2))*multiplier) + " Gains/s");
}


function add(){
    gainCount += 1;
     $('#gainNumber').html(gainCount); 
}

function save(){
    localStorage.setItem("gaincount", gainCount);
    localStorage.setItem("autoclick", autoClick);
    localStorage.setItem("lab", labCount);
}

function load(){
    gainCount = localStorage.getItem("gaincount");
    gainCount = parseInt(gainCount);
    autoClick = localStorage.getItem("autoclick");
    autoClick = parseInt(autoClick);
    labCount = localStorage.getItem("lab");
    labCount = parseInt(labCount);
    update();
}

//UPGRADES
//Carbs value per = 0.2
function buyCarbs() {
    if(gainCount >= ((autoClick + 1) * 12)){
        gainCount -= ((autoClick + 1) * 12);
        autoClick += 1;
        update();
    }
}
//Proteins value per = 0.5
function buyProteins() {
    if(gainCount >= ((proteins + 1) * 30)){
        gainCount -= ((proteins + 1) * 30);
        proteins += 1;
        update();
    }
}
//Stringlets value per = 1
function buyStringlet() {
    if(gainCount >= ((stringlet + 1) * 60)){
        gainCount -= ((stringlet + 1) * 60);
        stringlet += 1;
        update();
    }
}
//Labs "Grunts på view" value per = 2
function buyLab() {
    if(gainCount >= ((labCount + 1) * 120)){
        gainCount -= ((labCount+1) * 120);
        labCount += 1;
        update();
    }
}

$(document).ready(function() {
  gainCount = 0;
  autoClick = 0;
  labCount = 0;
  proteins = 0;
  stringlet = 0;
  multiplier = 1;
  setInterval(timer, 1000);

  $('#benkmann').on({
    'mousedown': function(){
        $('#benkmann').attr('src','images/benkOpp.png');
    },
    'mouseup': function(){
        $('#benkmann').attr('src','images/benk.png');
    }
});
});