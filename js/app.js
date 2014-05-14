(function($) {
    // Enter Month as integer in range 1-12
    // Enter Year as 4 digit integer
    var MONTH = 5;
	var YEAR = 2014;

	"use strict";
	
	function generateEvents() {
	    // Enter EST in a Unix Time Converter like http://www.onlineconversion.com/unix_time.htm
	    // Use beginning of month
	    // var initialTimeInput = 1398902400000;
	    var initialTimeInput = unixTime(MONTH,YEAR)
	    var lunchToDinnerTime = hoursToMs(6); // Time between lunch serving and dinner serving
	    var dinnerOutTime = hoursToMs(2); // Time until dinner should be put away
	    var timeInDay = 86400000;
	    var timeInHour = 3600000;
	    var numDays = daysInMonth(MONTH,YEAR); // Number of days in month to generate events for
	    var output = []
	    
	    var lunchTime = initialTimeInput + 57600000;
	    var dinnerTime = lunchTime + lunchToDinnerTime;
	    var nightlyTime = dinnerTime + dinnerOutTime;
	    
	    for (var day = 1; day <= numDays; day++) {
	        var nextLunch = {
			    "id": (day.toString())+"0",
    			"title": "Lunch",
    			"url": "LunchInfo.html?day="+day.toString(),
    			"class": "event-success",
	    		"start": lunchTime.toString(),
	    		"end":   (lunchTime+timeInHour).toString()
	    	};
	    	var nextDinner = {
			    "id": (day.toString())+"1",
    			"title": "Dinner",
    			"url": "DinnerInfo.html?day="+day.toString(),
    			"class": "event-info",
	    		"start": dinnerTime.toString(),
	    		"end":   (dinnerTime+timeInHour).toString()
	    	};
	    	var nextNightly = {
			    "id": (day.toString())+"2",
    			"title": "Nightly",
    			"url": "NightlyInfo.html?day="+day.toString(),
    			"class": "event-warning",
	    		"start": nightlyTime.toString(),
	    		"end":   (nightlyTime+timeInHour).toString()
	    	};
	    	lunchTime += timeInDay;
	    	dinnerTime += timeInDay;
	    	nightlyTime += timeInDay;
	    	
	    	output.push(nextLunch);
	    	output.push(nextDinner);
	    	output.push(nextNightly);
	    }
	    
	    return output;
	}
	
	function hoursToMs(hours) {
	  return hours*60*60*1000;
	}
	
	// Pass month as an integer 1-12 and year as a 4 digit integer
	function unixTime(month, year) {
	  var date = new Date(year, month-1, 1, 0, 0, 0, 0)
	  return date.getTime() - 14400000
	}
	
	function daysInMonth(month, year) {
	  switch(month)
	  {
	  case 1:
	    return 31;
	    break;
	  case 2:
	    if (year % 4 == 0) {return 29;}
	    else {return 28;}
	    break;
	  case 3:
	    return 31;
	    break;
	  case 4:
	    return 30;
	    break;
	  case 5:
	    return 31;
	    break;
	  case 6:
	    return 30;
	    break;
	  case 7:
	    return 31;
	    break;
	  case 8:
	    return 31;
	    break;
	  case 9:
	    return 30;
	    break;
	  case 10:
	    return 31;
	    break;
	  case 11:
	    return 30;
	    break;
	  case 12:
	    return 31;
	    break;
	  }
	  return 0;
	}
	
	function dayString(month, year) {
	  var yearStr = year.toString()
	  var monthStr = month.toString()
	  if (monthStr.length < 2) {
        monthStr = "0" + monthStr;
	  }
	  
	  return yearStr + "-" + monthStr + '-01'
	}

	var options = {
		events_source: generateEvents,
		view: 'month',
		tmpl_path: 'tmpls/',
		tmpl_cache: false,
		day: dayString(MONTH,YEAR),
		onAfterEventsLoad: function(events) {
			if(!events) {
				return;
			}
			var list = $('#eventlist');
			list.html('');

			$.each(events, function(key, val) {
				$(document.createElement('li'))
					.html('<a href="' + val.url + '">' + val.title + '</a>')
					.appendTo(list);
			});
		},
		onAfterViewLoad: function(view) {
			$('.page-header h3').text(this.getTitle());
			$('.btn-group button').removeClass('active');
			$('button[data-calendar-view="' + view + '"]').addClass('active');
		},
		classes: {
			months: {
				general: 'label'
			}
		}
	};

	var calendar = $('#calendar').calendar(options);

	$('.btn-group button[data-calendar-nav]').each(function() {
		var $this = $(this);
		$this.click(function() {
			calendar.navigate($this.data('calendar-nav'));
		});
	});

	$('.btn-group button[data-calendar-view]').each(function() {
		var $this = $(this);
		$this.click(function() {
			calendar.view($this.data('calendar-view'));
		});
	});

	$('#first_day').change(function(){
		var value = $(this).val();
		value = value.length ? parseInt(value) : null;
		calendar.setOptions({first_day: value});
		calendar.view();
	});

	$('#language').change(function(){
		calendar.setLanguage($(this).val());
		calendar.view();
	});

	$('#events-in-modal').change(function(){
		var val = $(this).is(':checked') ? $(this).val() : null;
		calendar.setOptions({modal: val});
	});
	$('#events-modal .modal-header, #events-modal .modal-footer').click(function(e){
		//e.preventDefault();
		//e.stopPropagation();
	});
}(jQuery));