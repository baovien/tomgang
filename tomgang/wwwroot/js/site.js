var gainCount;
var carb;
var proteins;
var stringlet;
var grunt;
var multiplier;

function timer(){
    if((carb + grunt) >= 1){
        if($('#benkmann').attr('src') == "images/benk.png"){
            $('#benkmann').attr('src','images/benkOpp.png');
        }else{
            $('#benkmann').attr('src','images/benk.png');
        }
    }

    gainCount += carb/5;
    gainCount += protein/2;
    gainCount += stringlet;
    gainCount += grunt*2;
    update();
}

function update(){
    $('#gainNumber').html(gainCount.toFixed(2)); 
    $('#amountCarb').html("You Own " + carb + " Carb snack(s)");
    $('#costCarb').html("Cost: " + ((carb + 1) * 12));

    $('#amountProtein').html("You Own " + protein + " Protein shake(s)");
    $('#costProtein').html("Cost: " + ((protein+1) * 30));

    $('#amountStringlet').html("You Own " + stringlet + " Stringlet(s)");
    $('#costStringlet').html("Cost: " + ((stringlet+1) * 60));

    $('#amountGrunt').html("You Own " + grunt + " Grunt(s)");
    $('#costGrunt').html("Cost: " + ((grunt+1) * 120));

    $('#gainspersecond').html((((carb/5)+(protein/2)+(stringlet)+(grunt*2))*multiplier).toFixed(2) + " Gains/s");
}


function add(){
    gainCount += 1;
     $('#gainNumber').html(gainCount.toFixed(2)); 
}

function save(){
    localStorage.setItem("gaincount", gainCount);
    localStorage.setItem("carb", carb);
    localStorage.setItem("protein", protein);
    localStorage.setItem("stringlet", stringlet);
    localStorage.setItem("grunt", grunt);
}

function load(){
    gainCount = localStorage.getItem("gaincount");
    gainCount = parseInt(gainCount);

    carb = localStorage.getItem("carb");
    carb = ParseInt(carb);

    protein = localStorage.getItem("protein");
    protein = ParseInt(protein);

    stringlet = localStorage.getItem("stringlet");
    stringlet = ParseInt(stringlet);

    grunt = localStorage.getItem("grunt");
    grunt = ParseInt(grunt);
    update();
}

//UPGRADES
//Carbs, value per = 0.2
function buyCarb() {
    if(gainCount >= ((carb + 1) * 12)){
        gainCount -= ((carb + 1) * 12);
        carb += 1;
        update();
    }
}
//Proteins, value per = 0.5
function buyProtein() {
    if(gainCount >= ((protein + 1) * 30)){
        gainCount -= ((protein + 1) * 30);
        protein += 1;
        update();
    }
}
//Stringlets, value per = 1
function buyStringlet() {
    if(gainCount >= ((stringlet + 1) * 60)){
        gainCount -= ((stringlet + 1) * 60);
        stringlet += 1;
        update();
    }
}
//Grunts, value per = 2
function buyGrunt() {
    if(gainCount >= ((grunt + 1) * 120)){
        gainCount -= ((grunt+1) * 120);
        grunt += 1;
        update();
    }
}

$(document).ready(function() {
  gainCount = 0;
  carb = 0;
  grunt = 0;
  protein = 0;
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