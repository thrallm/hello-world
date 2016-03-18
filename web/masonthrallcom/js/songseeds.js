var w = window;
w.audio = [];
var ionian = [0, 2, 4, 5, 7, 9, 11];
w.generationcount = 0;
var songcolor;
var songname;
var loopintervalID;
function ConvertKey(notearray, hsmove) {
	for (note in notearray) {
		note = note + hsmove;
		if (note > 12) note = note % 12;
	}
}
function SelectScale(){
	var scale = scales[$('#scalepicker').val()];
	var halfsteps = [];
	_.each(scale, function(note){halfsteps.push(degrees2halfsteps[note])});
	return halfsteps;
}
function Hz2Note(hz){
	hz = hz.toFixed(2);
	var note;
	var count = 0;
	var try1 = (+hz + 0.01).toFixed(2);
	var try2 = (+hz - 0.01).toFixed(2);
	while (!note){
		if (count>20) return 'break';
		var note = hzobj[hz];
		if (!note){
			var note = hzobj[try1];
			if (!note){
				var note = hzobj[try2];
			}
			var try1 = (+try1 + 0.01).toFixed(2);
			var try2 = (+try2 - 0.01).toFixed(2);
			count++;
		}
	}
	return note;
}
function Note2Hz(note){
	var hz = _.invert(hzobj)[note];
	return hz;
}
function MaxChange(halfsteps, scalearray, maxchange, octavejump) {
	if ((Math.abs(halfsteps) + 12 * octavejump) > (Math.abs(maxchange)  + 12 * octavejump)){
		return scalearray[maxchange] + 12 * octavejump;
	} else {
		return (halfsteps  + 12 * octavejump);
	}
}
function AdjustHz(hz, maxchange, octavejump, notecount, lasthz) {
	var twelfthroottwo = Math.pow(2,(1/12));
	var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
	var scalearray = SelectScale();
	if ($('#walk')[0].checked){
		console.log(scalearray);
		var halfsteps = MaxChange(scalearray[Math.floor(Math.random() * scalearray.length)],
								  scalearray, 1, 0);
		var hz = lasthz * Math.pow(twelfthroottwo, halfsteps);
	} else {
		var halfsteps = MaxChange(scalearray[Math.floor(Math.random() * scalearray.length)],
								  scalearray, maxchange, octavejump);
		var hz = hz * Math.pow(twelfthroottwo, halfsteps);
	}
	if (hz < 16.35) {
		console.log('note too low, using C0');
		hz = 16.35;
	} else if (hz > 7902.13) {
		console.log('note too high, using B8');
		hz = 7902.13;
	}
	var x = Probability(notecount, +($('#notechance').val()));
	if (x == 0){hz = NaN}; //NaN is break
	return hz
}
function Probability(notecount, prob){
	var probarray = [];
	var availnotes = Math.floor(notecount * prob);
	var breaks = notecount - availnotes;
	if (availnotes > 0){
		_.times(availnotes, function(){probarray.push(1)});
	}
	if (breaks > 0){
		_.times(breaks, function(){probarray.push(0)});
	}
	return probarray[Math.round(Math.random()*notecount)];
}
function MakeSong(hz, seconds, notecount, songdata, maxchange, octavejump, divide, trackcolor) {
	if (divide > 1){divide = divide - 1}
    var audio = new Audio();
    var wave = new RIFFWAVE();
    var data = [];
	var notecounta = _.range(notecount);
	var sequence = [];
	var add = 0;
    wave.header.sampleRate = 44100;
	var lasthz = hz;
	for (note in notecounta) {
		var nextnote = +note + 1;
		var adjhz = AdjustHz(hz, maxchange, octavejump, notecount, lasthz);
		lasthz = adjhz
		sequence.push(Hz2Note(adjhz));
		var starttime = wave.header.sampleRate * seconds * note;
		var endtime = wave.header.sampleRate * seconds * nextnote;
		for (var i = starttime; i < endtime; i++) {
			var sound = Math.round(128 + 127 * Math.sin(i * 2 * Math.PI * adjhz / wave.header.sampleRate))
			data[i] = sound;
		}
	}
	DrawTree(w.generationcount, songcolor, sequence, octavejump);
	var trackname = chance.word({syllables: 1});
    wave.Make(data);
	audio.name=trackname;
    audio.src = wave.dataURI;
	audio.controls=true;
	audio.loop=true;
	var notediag = [];
	//var notewidth = (seconds * 64) - 1;
	var availablewidth = $('#songparent').width() * .9;
	var notewidth = availablewidth/notecount;
	_.each(sequence, function(note) {
		if (note != 'break'){var color = 'black'}
		notediag.push('<td style="width:' + notewidth + 
					  'px;height:30px;background:' + color + '"></td>');
	});
	var looplen = notecount * seconds;
	var chartwidth = notecount * (notewidth + 1);
	var trackstaveid = trackname + '_stave';
	var trackvolknobid = trackname + '_volume';
	//make the song div
	songdata.prepend('<div onclick="$(\'#' + trackname + '\').slideToggle();" style="background: ' +
				    trackcolor +
				    '"><h4>voice: \"' + trackname + '\" : {generation: ['+ 
				    generationcount + ']}</h4></br>volume <input class="volume" oninput="Volume();" id="' + 
				    trackvolknobid + '" type="range" value="20" min="0" max="30"/>' +
				    '<input type="button" id="' + trackname + '_mute" value="mute" onclick="Mute(\'' +
					trackname + '\', this);"/><input type="button" id="' + trackname + '_solo" value="solo" onclick="Solo(\'' +
					trackname + '\', this);"/></br>notes:' + sequence.join(',') +
				    '<table><tr id="notechart">' + notediag.join('') + '</tr></table>' +
				    '<canvas id=\"'+ trackname + '_stave\" width=\"' + availablewidth +
				    '\" height="300"></canvas></div><div onclick="$(\'#' + trackname + 
					'\').slideToggle();" id=' + trackname +
					' style="background: ' + trackcolor + '"><h4>details</h4></br>seed note:' + 
				    Hz2Note(+hz) + '</br>note len(s):' +  seconds +
				    '</br>loop len(s): ' + looplen + '</br>beats:' + notecount + 
				    '</br>maxchange: ' + maxchange +
				    '</br>octavejump: ' + octavejump + '</div></br>');
	//try to make the stave
	try{
		sleep(0.5*generationcount);
		var canvas = $('#' + trackstaveid)[0];
		var renderer = new Vex.Flow.Renderer(canvas, Vex.Flow.Renderer.Backends.CANVAS);
		var ctx = renderer.getContext();
		'#' + trackname + '_stave'
		var stave = new Vex.Flow.Stave(0, 100, $('#notechart').width()-1);
		stave.addClef('treble').setContext(ctx).draw();
		var notes = [];
		var lastnote = Hz2Note(+hz);
		_.each(sequence, function(note){
			var duration = String(notecount)
			if (note == 'break'){note = lastnote; duration = duration + 'r'}
			lastnote = note;
			notes.push(new Vex.Flow.StaveNote({ keys: [note], duration: duration }))
		});
		var voice = new Vex.Flow.Voice({
			num_beats: notecount,
			beat_value: notecount,
			resolution: Vex.Flow.RESOLUTION
		});
		// Add notes to voice
		voice.addTickables(notes);
		var formatter = new Vex.Flow.Formatter().joinVoices([voice]).format([voice], $('#notechart').width()-1);
		// Render voice
		voice.draw(ctx, stave);
	} catch(err) {
		console.log('couldnt make stave' + err + 'generation:' + generationcount);
	}
	$('#' + trackname).slideToggle();
	_.each($('.volume'), function(knob){
		knob.value = knob.value * .75;
	});
	$('#' + trackvolknobid).val(20 - (octavejump * 2));
	var evochance1 = Math.floor(Math.random() * (3)) - 1;
	var evochance2 = Math.floor(Math.random() * (3)) - 1;
	$('#pitchtrend').val(evochance1);
	$('#speedtrend').val(evochance2);
    w.audio.push(audio);
}
function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}
function shadeColorRgb(rgb, amt) {
	rgb.r = Math.floor(parseFloat(rgb.r) * amt);
	rgb.g = Math.floor(parseFloat(rgb.g) * amt);
	rgb.b = Math.floor(parseFloat(rgb.b) * amt);
	return rgb;
}
function GenerateRiff(){
	var checked = $('#replace')[0].checked;
	if (checked == true) {
		$('#octavejump').val(0);
		$('#divider').val(1);
		for (var a in w.audio) {
			w.audio[a].pause();
		}
		w.songname = chance.word({syllables: 3});
		$('#songname').html('generated song species : "' + w.songname + '"');
		document.title = 'song seeds : "' + w.songname + '"';
		document.url = document.url + '?songname=' + w.songname;
		songcolor = chance.color({format: 'hex'});
		songcolor = new RGBColor(songcolor);
		songcolor = shadeColorRgb(songcolor, .7);
		$('#songparent').css('background', songcolor.toHex());
		w.audio = [];
		$('#songdata').html('');
		w.generationcount=0;
		MakeSong(Note2Hz($('#seed').val()), 
		     $('#seconds').val()/$('#divider').val(), 
		     $('#notecount').val()*$('#divider').val(),  
		     $('#songdata'), 
		     $('#maxchangehalfsteps').val(),
		     $('#octavejump').val(),
		     $('#divider').val(),
			 songcolor.toHex());
		$('#octavejump').val(+($('#octavejump').val()) + 1);
		$('#divider').val($('#divider').val() * 2);
		$('#replace').prop('checked', false);
		ToggleOptions(false);
	} else {
		w.generationcount++;
		songcolor = shadeColorRgb(songcolor, 1.02);
		MakeSong(Note2Hz($('#seed').val()), 
		     $('#seconds').val()/$('#divider').val(), 
		     $('#notecount').val()*$('#divider').val(),  
		     $('#songdata'), 
		     $('#maxchangehalfsteps').val(),
		     $('#octavejump').val(),
		     $('#divider').val(),
			 songcolor.toHex());
		$('#octavejump').val(+($('#octavejump').val()) + 1 * $('#pitchtrend').val());
		$('#divider').val($('#divider').val() * Math.pow(2, $('#speedtrend').val()));
		$('#notechance').val(Math.random());
	}
	StopRiff();
	PlayRiff();
}
function PlayRiff(){
	if (w.audio[0] == undefined) {
		alert('you must generate first');
	}
	StopRiff();
	Volume();
	for (var a in w.audio) {
		w.audio[a].play();
	}
}
function StopRiff() {
	for (var a in w.audio) {
		w.audio[a].pause();
		if (w.audio[a].readyState == 4){
			w.audio[a].currentTime = 0;
		}
	}
}
function Volume() {
	for (var a in w.audio) {
		var volumeknob = '#' + w.audio[a].name + '_volume';
		w.audio[a].volume=$(volumeknob).val() * 0.01;
	}
}
function Mute(audio, mutebutton) {
	audio = _.findWhere(w.audio, {'name': audio});
	var volumeknob = '#' + audio.name + '_volume';
	if (mutebutton.value == 'mute'){
		audio.oldvol = audio.volume;
		audio.volume=0;
		$(volumeknob).val(audio.volume);
		mutebutton.value = 'unmute';
	} else {
		$(volumeknob).val(audio.oldvol/0.01);
		audio.volume = audio.oldvol;
		mutebutton.value = 'mute';
	}
}
function Solo(audio, solobutton) {
	var otheraudio = _.filter(w.audio, function(a){if (a.name != audio){return a}});
	var oldvols = [];
	if (solobutton.value == 'solo'){
		_.each(otheraudio, function(o){
			o.oldvol = o.volume;
			o.volume = 0;
			var volumeknob = '#' + o.name + '_volume';
			$(volumeknob).val(0);
		});
		solobutton.value = 'unsolo';
	} else {
		_.each(w.audio, function(a){
			a.volume = a.oldvol;
			var volumeknob = '#' + a.name + '_volume';
			$(volumeknob).val(a.oldvol/0.01);
		});
		solobutton.value = 'solo';
	}
}

window.onload = function()
{
	var appcolor = chance.color({format: 'hex', grayscale: true});
	appcolor = shadeColor2(appcolor, .70);
	ToggleOptions($('#replace')[0].checked);
	$('body').css({background: appcolor});
	var scalepicker = $('#scalepicker')[0];
	_.each(scales, function(notes, name){
		var el = document.createElement('option');
		el.textContent = name;
		el.value = name;
		scalepicker.appendChild(el);
	});
	$('#scalepicker').val('Minor pentatonic scale')
	$('#seedoptions').slideToggle();
}
function ToggleOptions(checked){
	$('#seedoptions').slideToggle();
	$('#generationoptions').slideToggle();
	$('#octavejump').prop('disabled', checked);
	$('#divider').prop('disabled', checked);
	$('#seed').prop('disabled', !checked);
	$('#scalepicker').prop('disabled', !checked);
	$('#notecount').prop('disabled', !checked);
	$('#seconds').prop('disabled', !checked);
	$('#pitchtrend').prop('disabled', checked);
	$('#speedtrend').prop('disabled', checked);
	if (checked) {
		$('#continualevolve').val('StopEvolving');
		ContinualEvolve();
		$('#generatebutton').val('GenerateSeed');
		$('#octavejump').val(0);
		$('#divider').val(1);
		$('#pitchtrend').val(1);
		$('#speedtrend').val(1);
		$('#seedoptions').addClass('active').removeClass('inactive');
		$('#generationoptions').addClass('inactive').removeClass('active');
	} else {
		$('#generatebutton').val('AddGeneration');
		$('#seedoptions').addClass('inactive').removeClass('active');
		$('#generationoptions').addClass('active').removeClass('inactive');
	}
}
//evolution functions
function PlusTrend(trend, trait){
	$(trait).val(+(trend.value) + +($(trait).val()));
}
function MultiplyTrend(trend, trait){
	$(trait).val(Math.pow(+(trend.value), +($(trait).val())));
}
function ContinualEvolve(){
	if ($('#continualevolve').val() == 'StopEvolving'){
		$('#continualevolve').val('ContinualEvolve');
		clearInterval(loopintervalID);
		return
	}
	GenerateRiff();
	sleep(1);
	loopintervalID = setInterval(function(){
	GenerateRiff()}, w.audio[0].duration * 1000 * $('#lifetime').val());
	$('#continualevolve').val('StopEvolving');
}
function RandomSubset(){
	var limit = 6;
	var count = 0;
	for (a in w.audio){
		var selected = Math.round(Math.random());
		if (selected == 0 && count <= limit ){
			w.audio[a].oldvol = w.audio[a].volume;
			w.audio[a].volume = (14 + count) * .01;
			$('#' + w.audio[a].name + '_volume').val(w.audio[a].volume/.01);
			count++;
		} else {
			w.audio[a].oldvol = w.audio[a].volume;
			w.audio[a].volume = 0;
			$('#' + w.audio[a].name + '_volume').val(w.audio[a].volume/.01);
		}
	}
}
function DrawTree(generation, songcolor, sequence, octavejump){
	w.treecanvas = $('#treecanvas')[0];
	w.treectx=w.treecanvas.getContext('2d');
	w.treectx.fillStyle=songcolor.toHex();
	var notedict = _.invert(hzobj)
	_.map(sequence, function(note){
		//console.log(notedict[note]%12);
		w.treectx.fillRect((w.treecanvas.width/12)*(notedict[note]%12),
						   w.treecanvas.height/(generation+1),
						   w.treecanvas.width/12,
						   w.treecanvas.height/(generation+1));
	});
}