/*jshint devel:true */


$(document).ready(function() {


	var start = $('h1.start');
	var reset = $('h1.reset');
	var mainPath = $('#path');
	var allCircles = $('.circle');
	var progressText = $('.progress');
	var pause = $('.pause');
	var change = $('h1.change');
	var centerEl = $('#center-circle');
var time = $('.time-el'); // time numbers
var rings = $('.time-rings');
var hourLines = $('.hour-lines');
var forwardLines = $('.schedule-rings');
var timeContainer = $('#hour-container');
var line1 = $('#line1');
var line2 = $('#line2');
var line3 = $('#line3');
var line4 = $('#line4');
var line5 = $('#line5');
var line6 = $('#line6');

// set schedules
var times = [0,11.5, 22.5, 33.5, 44.5, 55.5, 66.5, 77.7, 88.8, 100];
var forwardString = [];
for (i = 0; i < times.length; i++) {
	var output = times[i].toString();
	output = output + '%';
	forwardString.push(output);
}

var schedule1 = {
	m : [0,5],
	t : [1,6],
	w : [2,5],
	r : [5,9],
	f : [4,9]
};
var schedule2 = {
	m : [3,9],
	t : [4,9],
	w : [0,5],
	r : [4,9],
	f : [3,6]
};
var schedule3 = {
	m : [0,4],
	t : [4,8],
	w : [2,9],
	r : [0,3],
	f : [6,9]
};
var schedule4 = {
	m : [2,7],
	t : [1,4],
	w : [4,9],
	r : [3,9],
	f : [2,9]
};
var schedule5 = {
	m : [5,9],
	t : [0,5],
	w : [2,6],
	r : [3,5],
	f : [1,5]
};
var schedule6 = {
	m : [3,7],
	t : [5,9],
	w : [2,6],
	r : [5,7],
	f : [2,4]
};
allSchedules = [schedule1, schedule2, schedule3, schedule4, schedule5, schedule6];
function updateSchedules(day){
	var val1 = setSchedule(0,day);
	var val2 = setSchedule(1,day);
	var val3 = setSchedule(2,day);
	var val4 = setSchedule(3,day);
	var val5 = setSchedule(4,day);
	var val6 = setSchedule(5,day);
	TweenLite.to(line1,1,{drawSVG: val1, ease: Back.easeOut.config(1) });
	TweenLite.to(line2,1,{drawSVG: val2, ease: Back.easeOut.config(1), delay:0.1 });
	TweenLite.to(line3,1,{drawSVG: val3, ease: Back.easeOut.config(1), delay:0.2 });
	TweenLite.to(line4,1,{drawSVG: val4, ease: Back.easeOut.config(1), delay:0.3 });
	TweenLite.to(line5,1,{drawSVG: val5, ease: Back.easeOut.config(1), delay:0.4 });
	TweenLite.to(line6,1,{drawSVG: val6, ease: Back.easeOut.config(1), delay:0.5 });
}
function setSchedule (index, date){
	var currentSchedule = allSchedules[index];
	var s;
	var e;
	var drawString;

	switch (date) {
		case 'm':
		s = currentSchedule.m[0];
		e = currentSchedule.m[1];
		break;
		case 't':
		s = currentSchedule.t[0];
		e = currentSchedule.t[1];
		break;
		case 'w':
		s = currentSchedule.w[0];
		e = currentSchedule.w[1];
		break;
		case 'r':
		s = currentSchedule.r[0];
		e = currentSchedule.r[1];
		break;
		case 'f':
		s = currentSchedule.f[0];
		e = currentSchedule.f[1];
		break;
		default:
	}

	drawString = forwardString[s] + " " + forwardString[e];
	reset.text(drawString);
	return drawString;
}

// start state
$(function(){
	TweenLite.to(forwardLines,0,{drawSVG:'0% 0%', opacity:1});
	TweenLite.to(hourLines,0,{drawSVG:'0% 0%'});
	TweenLite.to(rings,0,{drawSVG:'0% 0%'});
});


change.click(function(){
	var day = ['m','t','w','r','f'];
	var num = Math.floor(Math.random() * (5 - 0));
	updateSchedules(day[num]);
	change.text(day[num]);
});
var runOnce = true
var listElements = $('nav li');
var names = $('.name-entry');
var tl = new TimelineLite({
	onStart: function(){
		$('svg').css('opacity',1);
	},
	onUpdate: updateProgress,
	onComplete: function(){
		if (runOnce === true){
			console.log('ran');
			listElements.addClass('reveal');
			$('.first').addClass('active-li');
			updateSchedules('m');
			runOnce = false;
		}
	}
}).delay(1);

tl.from(centerEl,0.5,{opacity:0, scale:0, transformOrigin: "center center"},0)
.from(timeContainer,0.5,{opacity:0, scale:0, transformOrigin: "center center"})
.to(hourLines,0.5,{ drawSVG:'0% 100%'}, "time")
.from(time,0.5,{opacity:0}, "time +=0.3")
.staggerTo(rings,0.8,{drawSVG:'0% 100%'},0.2)
.to(names,0.5,{opacity:1});

//start

start.click(function(){
	tl.play();
});

//reset
reset.click(function(){
	tl.pause();
	tl.seek(0);
	$("#slider").slider("value", tl.progress() * 0);
});



function updateProgress(){
	var progress = tl.time();
	progress = progress.toFixed(2);
	progressText.text(progress);
}


tl.eventCallback("onUpdate", updateSlider);

$("#slider").slider({
	range: false,
	min: 0,
	max: 100,
	step:.05,
	slide: function ( event, ui ) {
		tl.pause();
    //adjust the timeline's progress() based on slider value
    updateProgress();
    tl.progress( ui.value/100 );
}
});	

function updateSlider() {
	$("#slider").slider("value", tl.progress() *100);
}


// nav list elements
var nav = $('nav')
$('nav li').click(function(){
	var el = $(this);
	var dow = el.attr('date');
	var date;
	switch (dow) {
		case 'monday':
		date = 'm';
		break;
		case 'tuesday':
		date = 't';
		break;
		case 'wednesday':
		date = 'w';
		break;
		case 'thursday':
		date = 'r';
		break;
		case 'friday':
		date = 'f';
		break;
		default:
	}

	if (el.hasClass('active-li')){

	} else {
		if (el.hasClass('reveal')){
		nav.find('.active-li').removeClass('active-li');
		el.addClass('active-li');
		updateSchedules(date);
	}
	}
});

});






