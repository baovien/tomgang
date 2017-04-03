var gainCount;
var autoClick;
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

    gainCount += autoClick;
    gainCount += labCount*2;
    update();
}

function update(){
    $('#gainNumber').html(gainCount); 
    $('#amountAutoClick').html("You Own " + autoClick + " Auto Clickers");
    $('#costAutoClick').html("Cost: " + ((autoClick+1) * 12));
    $('#amountLab').html("You Own " + labCount + " Lab(s)");
    $('#costLab').html("Cost: " + ((labCount+1) * 20));
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

function buyAutoClick() {
    if(gainCount >= ((autoClick + 1) * 12)){
        gainCount -= ((autoClick+1) * 12);
        autoClick += 1;
        update();
    }
}

function buyLab() {
    if(gainCount >= ((labCount + 1) * 20)){
        gainCount -= ((labCount+1) * 20);
        labCount += 1;
        update();
    }
}

$(document).ready(function() {
  gainCount = 0;
  autoClick = 0;
  labCount = 0;
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