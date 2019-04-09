var reimbursementCalculator = (function () {
	
	var _public = {};
	
	// Cost tier indicators - exact values are unimportant as long as the
	// "HIGH" value is larger than the "LOW" value and any future tiers
	// follow the same practice.
	var LOW_COST = 1;
	var HIGH_COST = 2;
	
	// Day type indicators - exact values are unimportant as long as they're
	// different.
	var TRAVEL_TYPE = 1;
	var FULL_TYPE = 2;

	var RATE_TABLE = {};
	RATE_TABLE[LOW_COST] = {};
	RATE_TABLE[LOW_COST][TRAVEL_TYPE] = 45;
	RATE_TABLE[LOW_COST][FULL_TYPE] = 75;
	RATE_TABLE[HIGH_COST] = {};
	RATE_TABLE[HIGH_COST][TRAVEL_TYPE] = 55;
	RATE_TABLE[HIGH_COST][FULL_TYPE] = 85;
	
	// The "calendar" for tracking project days.
	var dayMap;
	
	_public.calculateProjects = function (projects) {
		
		// start out with a clearly erroneous value so it's
		// very obvious if validation failed
		var totalCost = -1;
		
		if (projects.every(validateProject)) {
		
			// Wipe the map
			dayMap = Object.create(null);
		
			projects.forEach(loadDaysFromProject);
		
			totalCost = 0;
			for (var dayKey in dayMap) {
				totalCost += getCostForDay(dayKey);
			}
			
		}
		
		return totalCost;
		
	};
	
	function validateProject(project) {
		
		var valid = true;
		
		// needs a valid cost
		valid = valid && (project.cost == LOW_COST || project.cost == HIGH_COST);
		
		// Shouldn't accept null/empty values for dates. Will successfully create a Date
		// set to the default value, but definitely not what the user intended to do.
		valid = valid && project.startDate && project.endDate;
		
		var startDate = new Date(project.startDate);
		var endDate = new Date(project.endDate);
		
		// startDate and endDate need to be values that construct a valid Date.
		// An invalid date's getTime() returns NaN
		valid = valid && !isNaN(startDate.getTime()) && !isNaN(endDate.getTime());
		
		// endDate needs to be on or after startDate or the date range is invalid
		valid = valid && (startDate <= endDate);
		
		return valid;
		
	}
	
	function loadDaysFromProject(project) {
		
		// By wrapping the incoming startDate and endDate in new Date objects
		// here we can support more flexibility in the project object format.
		// We can accept Date objects directly, but also anything the Date
		// constructor can turn into a date, like string representations or raw
		// time values
		var startDate = new Date(project.startDate);
		var endDate = new Date(project.endDate);
		
		var day = new Date(startDate);
		
		while (day <= endDate) {
			
			var dayKey = day.getTime();
			if (!(dayKey in dayMap) || dayMap[dayKey] < project.cost) {
				// track the highest cost tier we've seen for this day
				dayMap[dayKey] = project.cost;
			}
			day.setDate(day.getDate() + 1);
			
		}
		
	}
	
	function getCostForDay(dayKey) {
	
		var dayType = 0;
		var yesterdayKey = getRelativeDayKey(dayKey, -1);
		var tomorrowKey = getRelativeDayKey(dayKey, 1);
		
		console.log("Getting cost for date " + new Date(dayKey));
		if (yesterdayKey in dayMap && tomorrowKey in dayMap) {
			// not an "edge" day, so full, not travel
			console.log("Yesterday (" + new Date(yesterdayKey) + ") and tomorrow (" 
				+ new Date(tomorrowKey) + ") are both in map, so this is a FULL day");
			dayType = FULL_TYPE;
		} else {
			console.log("Either yesterday (" + new Date(yesterdayKey) + ") or tomorrow (" 
				+ new Date(tomorrowKey) + ") are not in map, so this is a TRAVEL day");
			dayType = TRAVEL_TYPE;
		}
		
		console.log("Billing " + RATE_TABLE[dayMap[dayKey]][dayType]);
		return RATE_TABLE[dayMap[dayKey]][dayType];
		
	}
	
	function getRelativeDayKey(dayKey, deltaDays) {
		
		var newDay = new Date(dayKey);
		newDay.setDate(newDay.getDate() + deltaDays);
		return newDay.getTime();
		
	}
	
	_public.getLowCost = function () {
		
		return LOW_COST;
		
	}
	
	_public.getHighCost = function () {
		
		return HIGH_COST;
		
	}
		
	return _public;
	
}());
