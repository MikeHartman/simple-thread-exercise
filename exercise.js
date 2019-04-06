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
		
		// Wipe the map
		dayMap = Object.create(null);
		
		projects.forEach(loadDaysFromProject);
		
		var totalCost = 0;
		for (var dayKey in dayMap) {
			totalCost += getCostForDay(dayKey);
		}
		
		return totalCost;
		
	};
	
	function loadDaysFromProject(project) {
		
		var day = new Date(project.startDate);
		
		while (day <= project.endDate) {
			
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
		
		if (yesterdayKey in dayMap && tomorrowKey in dayMap) {
			// not an "edge" day, so full, not travel
			dayType = FULL_TYPE;
		} else {
			dayType = TRAVEL_TYPE;
		}
		
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


// set up the test data
var testSetOne = [
  {
    'cost': reimbursementCalculator.getLowCost(),
    'startDate': new Date(2015,08,01),
    'endDate': new Date(2015,08,03)
  }
]
    
var testSetTwo = [
  {
    'cost': reimbursementCalculator.getLowCost(),
    'startDate': new Date(2015,08,01),
    'endDate': new Date(2015,08,01)
  },{
    'cost': reimbursementCalculator.getHighCost(),
    'startDate': new Date(2015,08,02),
    'endDate': new Date(2015,08,06)
  },{
    'cost': reimbursementCalculator.getLowCost(),
    'startDate': new Date(2015,08,06),
    'endDate': new Date(2015,08,08)
  }
]

var testSetThree = [
  {
    'cost': reimbursementCalculator.getLowCost(),
    'startDate': new Date(2015,08,01),
    'endDate': new Date(2015,08,03)
  },{
    'cost': reimbursementCalculator.getHighCost(),
    'startDate': new Date(2015,08,05),
    'endDate': new Date(2015,08,07)
  },{
    'cost': reimbursementCalculator.getHighCost(),
    'startDate': new Date(2015,08,08),
    'endDate': new Date(2015,08,08)
  }
]

var testSetFour = [
  {
    'cost': reimbursementCalculator.getLowCost(),
    'startDate': new Date(2015,08,01),
    'endDate': new Date(2015,08,01)
  },{
    'cost': reimbursementCalculator.getLowCost(),
    'startDate': new Date(2015,08,01),
    'endDate': new Date(2015,08,01)
  },{
    'cost': reimbursementCalculator.getHighCost(),
    'startDate': new Date(2015,08,02),
    'endDate': new Date(2015,08,02)
  },{
    'cost': reimbursementCalculator.getHighCost(),
    'startDate': new Date(2015,08,02),
    'endDate': new Date(2015,08,03)
  }
]

var testOneExpected = 135;
var testTwoExpected = 410;
var testThreeExpected = 355;
var testFourExpected = 155;
var testOneResult = reimbursementCalculator.calculateProjects(testSetOne);
var testTwoResult = reimbursementCalculator.calculateProjects(testSetTwo);
var testThreeResult = reimbursementCalculator.calculateProjects(testSetThree);
var testFourResult = reimbursementCalculator.calculateProjects(testSetFour);

document.write("Test 1: Expected " + testOneExpected + ", Calculated " + testOneResult + ".");
if (testOneExpected != testOneResult) {
	document.write(" FAILED<br>");
} else {
	document.write(" PASSED<br>");
}

document.write("Test 2: Expected " + testTwoExpected + ", Calculated " + testTwoResult + ".");
if (testTwoExpected != testTwoResult) {
	document.write(" FAILED<br>");
} else {
	document.write(" PASSED<br>");
}

document.write("Test 3: Expected " + testThreeExpected + ", Calculated " + testThreeResult + ".");
if (testThreeExpected != testThreeResult) {
	document.write(" FAILED<br>");
} else {
	document.write(" PASSED<br>");
}

document.write("Test 4: Expected " + testFourExpected + ", Calculated " + testFourResult + ".");
if (testFourExpected != testFourResult) {
	document.write(" FAILED<br>");
} else {
	document.write(" PASSED<br>");
}
