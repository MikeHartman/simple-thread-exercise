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

var badCostTestOne = [
  {
    'cost': 20,
    'startDate': new Date(2015,08,01),
    'endDate': new Date(2015,08,03)
  }
]

var badCostTestTwo = [
  {
    'cost': "LOW",
    'startDate': new Date(2015,08,01),
    'endDate': new Date(2015,08,03)
  }
]

var badStartDateTest = [
  {
    'cost': reimbursementCalculator.getLowCost(),
    'startDate': "monkey",
    'endDate': new Date(2015,08,03)
  }
]

var badEndDateTest = [
  {
    'cost': reimbursementCalculator.getLowCost(),
    'startDate': new Date(2015,08,01),
    'endDate': -34324233432432432432
  }
]

var badDateRangeTest = [
  {
    'cost': reimbursementCalculator.getLowCost(),
    'startDate': new Date(2015,08,03),
    'endDate': new Date(2015,08,01)
  }
]

var noCostTest = [
  {
    'startDate': new Date(2015,08,01),
    'endDate': new Date(2015,08,03)
  }
]

var noStartDateTest = [
  {
    'cost': reimbursementCalculator.getLowCost(),
    'endDate': new Date(2015,08,03)
  }
]

var noEndDateTest = [
  {
    'cost': reimbursementCalculator.getLowCost(),
    'startDate': new Date(2015,08,01)
  }
]

var testOneExpected = 135;
var testTwoExpected = 410;
var testThreeExpected = 355;
var testFourExpected = 155;
var validationTestsExpected = -1;

var testOneResult = reimbursementCalculator.calculateProjects(testSetOne);
var testTwoResult = reimbursementCalculator.calculateProjects(testSetTwo);
var testThreeResult = reimbursementCalculator.calculateProjects(testSetThree);
var testFourResult = reimbursementCalculator.calculateProjects(testSetFour);
var badCostTestOneResult = reimbursementCalculator.calculateProjects(badCostTestOne);
var badCostTestTwoResult = reimbursementCalculator.calculateProjects(badCostTestTwo);
var badStartDateTestResult = reimbursementCalculator.calculateProjects(badStartDateTest);
var badEndDateTestResult = reimbursementCalculator.calculateProjects(badEndDateTest);
var badDateRangeTestResult = reimbursementCalculator.calculateProjects(badDateRangeTest);
var noCostTestResult = reimbursementCalculator.calculateProjects(noCostTest);
var noStartDateTestResult = reimbursementCalculator.calculateProjects(noStartDateTest);
var noEndDateTestResult = reimbursementCalculator.calculateProjects(noEndDateTest);

function displayTestResult(label, expected, result) {
	document.write(label + ": Expected " + expected + ", Calculated " + result + ".");
	expected != result ? document.write(" FAILED<br>") : document.write(" PASSED<br>");
}

displayTestResult("Test 1", testOneExpected, testOneResult);
displayTestResult("Test 2", testTwoExpected, testTwoResult);
displayTestResult("Test 3", testThreeExpected, testThreeResult);
displayTestResult("Test 4", testFourExpected, testFourResult);
displayTestResult("Bad Cost Test 1", validationTestsExpected, badCostTestOneResult);
displayTestResult("Bad Cost Test 2", validationTestsExpected, badCostTestTwoResult);
displayTestResult("Bad Start Date Test", validationTestsExpected, badStartDateTestResult);
displayTestResult("Bad End Date Test", validationTestsExpected, badEndDateTestResult);
displayTestResult("Bad Date Range Test", validationTestsExpected, badDateRangeTestResult);
displayTestResult("No Cost Test", validationTestsExpected, noCostTestResult);
displayTestResult("No Start Date Test", validationTestsExpected, noStartDateTestResult);
displayTestResult("No End Date Test", validationTestsExpected, noEndDateTestResult);

