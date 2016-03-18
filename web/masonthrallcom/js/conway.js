function limit(number,limit){
	if (number*10 < limit){
		return number*10;
	}else{
		return limit;
	}
}
function drawCell(data,row,col){
	//filling in the canvas with the current array.
	if ($('#invertCheckbox')[0].checked == false){
		if (data[0] == 1) {
			if ($('#fadestaticCheckbox')[0].checked){
				w.ctx.fillStyle = shadeColor($('#color')[0].value, limit(data[1],60));
			} else if ($('#darkerAgeCheckbox')[0].checked){
				light = shadeColor($('#color')[0].value,60);
				w.ctx.fillStyle = shadeColor(light, data[1]*-10);
			} else if ($('#noAgeModCheckbox')[0].checked){
				w.ctx.fillStyle=$('#color')[0].value;
			}
			w.ctx.fillRect(w.cell*row,w.cell*col,w.cell,w.cell);
		} else {
			if ($('#gridCheckbox')[0].checked){
				w.ctx.strokeRect(w.cell*row,w.cell*col,w.cell,w.cell);
			}
		}
	} else {
		if (data[0] == 0) {
			w.ctx.fillRect(w.cell*row,w.cell*col,w.cell,w.cell);
		} else {
			if ($('#gridCheckbox')[0].checked){
				w.ctx.strokeRect(w.cell*row,w.cell*col,w.cell,w.cell);
			}
		}
	}
}

function shadeColor(color, percent) {   
	var num = parseInt(color.slice(1),16), amt = Math.round(2.55 * percent), R = (num >> 16) + amt, G = (num >> 8 & 0x00FF) + amt, B = (num & 0x0000FF) + amt;
	return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
}

function updateGrid(mainarray,cellcount,drawonce){
	if (w.play){
		w.canvas.width = w.widthadjust;
		w.canvas.height = w.heightadjust;
	}
	w.ctx.strokeStyle="#E4E4E4";
	w.ctx.fillStyle=$('#color')[0].value;
	if (w.time){
		newtime = new Date().getTime();
		generationtime = Math.round(1000/(newtime - w.time));
		w.time = newtime;
		$('#out3').html('FPS : ' + generationtime);
	}
	var outarray = new Array
	w.lastarray = mainarray;
	$.each( mainarray, function(row,rowarr) {
		outarray[row] = new Array;
		var top = mainarray[row+1];
		var middle = mainarray[row];
		var bottom = mainarray[row-1];
		$.each( mainarray[row], function(col,data) {
			if (drawonce == true){
				drawCell(data,row,col);
				return;
			}
			//life rules, making the next gen array.
			if (w.play){
				drawCell(data,row,col);
				var neighborcount = checkNeighbors(top,middle,bottom,row,col,w.cellcount);
				if (data[0] == 1) {
					if (neighborcount == $('#liverule1')[0].value || neighborcount == $('#liverule2')[0].value) {
						x=data[1]+1
						outarray[row][col] = [1,x];
					} else {
						outarray[row][col] = [0,0];
					}
				} else if (data[0] == 0) {
					if (neighborcount == $('#deadrule1')[0].value || neighborcount == $('#deadrule2')[0].value) {
						outarray[row][col] = [1,1];
					} else {
						outarray[row][col] = [0,0];
					}
				}
			}
		});
	});
	if (w.play){
		w.generations++
		$('#out').html('generations : ' + generations);
		w.newmain = outarray;
		w.requestAnimFrame(function(){
			updateGrid(w.newmain,w.cellcount,false)
		});
	}
	//console.log(mainarray[1][1]);
}

//Checking all 8 neighbour cells and 
//returning the count of alive neighbours.
function checkNeighbors(top,middle,bottom,row,col,cellcount){
	if ( row > 0 && row < cellcount - 1 && col > 0 && col < cellcount - 1 ) 
	{
		var neighborcount = 0;
		neighborcount+=bottom[col-1][0];
		neighborcount+=bottom[col][0];
		neighborcount+=bottom[col+1][0];
		neighborcount+=middle[col-1][0];
		neighborcount+=middle[col+1][0];
		neighborcount+=top[col-1][0];
		neighborcount+=top[col][0];
		neighborcount+=top[col+1][0];
		return neighborcount;
	} else {
		return false;
	}
}

function emptyGrid(){
	w.initarray = new Array(w.cellcount);
	$.each(w.initarray,function(row,rowarr){
		//w.initarray[i] = new Array(w.cellcount+1).join('0').split('').map(parseFloat);
		w.initarray[row] = new Array(w.cellcount);
		$.each(w.initarray[row],function (col,data){
			w.initarray[row][col] = new Array(0,0);
		});
	});
}

//construction functions. should update 
//to allow placement selection location
function blockLayingEngine(array){
	//block laying engine
	var be = (Math.round(w.cellcount/2))-3;
	array[1+be][1+be] = [1,1];
	array[2+be][1+be] = [1,1];
	array[3+be][1+be] = [1,1];
	array[5+be][1+be] = [1,1];
	array[1+be][2+be] = [1,1];
	array[4+be][3+be] = [1,1];
	array[5+be][3+be] = [1,1];
	array[2+be][4+be] = [1,1];
	array[3+be][4+be] = [1,1];
	array[5+be][4+be] = [1,1];
	array[1+be][5+be] = [1,1];
	array[3+be][5+be] = [1,1];
	array[5+be][5+be] = [1,1];
}

function glider(array){
	//glider
	var be = (Math.round(w.cellcount/2))-3;
	array[1+be][3+be] = [1,1];
	array[2+be][3+be] = [1,1];
	array[3+be][3+be] = [1,1];
	array[3+be][2+be] = [1,1];
	array[2+be][1+be] = [1,1];
}

function toad(array){
	//toad
	var be = (Math.round(w.cellcount/2))-3;
	array[3+be][3+be] = [1,1];
	array[3+be][2+be] = [1,1];
	array[2+be][2+be] = [1,1];
	array[2+be][3+be] = [1,1];
	array[1+be][2+be] = [1,1];
	array[4+be][3+be] = [1,1];
}

function blinker(array){
	//blinker
	var be = (Math.round(w.cellcount/2))-3;
	array[3+be][3+be] = [1,1];
	array[3+be][2+be] = [1,1];
	array[3+be][1+be] = [1,1];
}

function Rpentomino(array){
	//The R-pentomino
	var be = (Math.round(w.cellcount/2))-3;
	array[2+be][1+be] = [1,1];
	array[3+be][1+be] = [1,1];
	array[1+be][2+be] = [1,1];
	array[2+be][2+be] = [1,1];
	array[2+be][3+be] = [1,1];
}

function randomDisbersement(array){
	$.each(array, function(row,rowarr){
		$.each(array, function(col,data){
			alive = Math.round(Math.random());
			array[row][col] = [alive,alive];
		});
	});
}

//emptyGrid,blockLayingEngine,Rpentomino,glider,toad,blinker,randomDisbersement,updateGrid

function initGrid(){
	w.generations=0;
	playState(true);
	selpreset = $('#presets')[0].selectedIndex;
	w.cell = $('#cellsize')[0].value;
	w.cellcount = Math.round(w.heightadjust/w.cell);
	emptyGrid();
	//console.log(w.initarray[0][0])
	if (selpreset == 0){
		blockLayingEngine(w.initarray);
		var preset='blockLayingEngine';
	}else if (selpreset == 1){
		Rpentomino(w.initarray);
		var preset='Rpentomino';
	}else if (selpreset == 2){
		glider(w.initarray);
		var preset='glider';
	} else if (selpreset == 3){
		toad(w.initarray);
		var preset='toad';
	} else if (selpreset == 4){
		blinker(w.initarray);
		var preset='blinker';
	} else if (selpreset == 5){
		randomDisbersement(w.initarray);
		var preset='randomDisbersement';
	}
	updateGrid(w.initarray,w.cell,w.cellcount,true);
	playState(false);
}

function playState(playing){
	if (playing){
		w.playbutton.className='red';
		w.playbutton.value='pause';
		w.play = true;
	}else{
		w.playbutton.className='green';
		w.playbutton.value='play';
		w.play = false;
	}
}
// main
function main(){
	//vars
	w = window;
	w.heightadjust = $( w ).height() - 20;
	w.widthadjust = $( w ).width() / 2;
	$('#cellsize')[0].value = Math.round(w.heightadjust / 100)
	w.canvas = $('#myCanvas')[0];
	w.time = new Date().getTime();
	w.playbutton = $('#play')[0];
	w.nextbutton = $('#next')[0];
	w.resetbutton = $('#reset')[0];
	w.onresize = function(event) {main();}
	w.cell = $('#cellsize')[0].value; //cell * cellcount is the grid dimension
	w.ctx = w.canvas.getContext('2d');
	w.requestAnimFrame = (function(callback) {
		return function(callback) {
		  w.setTimeout(callback,$('#speed')[0].value);
		};
	})();
	initGrid();
}
// run
$( document ).ready(main());
// buttons.
w.playbutton.addEventListener('click', function() {
	w.play = !w.play;
	if(w.play) {
		updateGrid(w.newmain,w.cell,w.cellcount,false);
		playState(true);
	} else {
		playState(false);
	}
});
w.nextbutton.addEventListener('click', function() {
	playState(true);
	updateGrid(w.newmain,w.cell,w.cellcount,true);
	playState(false);
});
w.resetbutton.addEventListener('click', function() {
	temp = w.play;
	initGrid();
	playState(temp);
});