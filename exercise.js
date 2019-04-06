// let's do a very quick and dirty test of the algorithm and verify it actually generates correct results

var LOW_COST = 1;
var HIGH_COST = 2;

var RATE_TABLE = {};
RATE_TABLE[LOW_COST] = { 'travel': 45, 'full': 75 };
RATE_TABLE[HIGH_COST] = { 'travel': 55, 'full': 85 };

function calculateReimbursements(projectsArray) {
  
  // create a nice empty key/value store
  var dayMap = Object.create(null);
  
  // load days into it
  projectsArray.forEach( function(project) {
    
    var day = new Date(project.startDate);
    while (day <= project.endDate) {
       var dayKey = day.getTime();
       if (!(dayKey in dayMap) || dayMap[dayKey] < project.cost) {
          dayMap[dayKey] = project.cost;
       }
       day.setDate(day.getDate() + 1);  
    }
    
  });
  
  // now total up the cost of all those days
  var totalCost = 0;
  for (var dayKey in dayMap) {
    
    var yesterday = new Date(dayKey);
    yesterday.setDate(yesterday.getDate() - 1);
    var yesterdayKey = yesterday.getTime();
    
    var tomorrow = new Date(dayKey);
    tomorrow.setDate(tomorrow.getDate() + 1);
    var tomorrowKey = tomorrow.getTime();
    
    if (yesterdayKey in dayMap && tomorrowKey in dayMap) {
        // not on any edges, full time it is!
        totalCost += RATE_TABLE[dayMap[dayKey]].full;
    } else {
        totalCost += RATE_TABLE[dayMap[dayKey]].travel;
    }
    
  }
  
  return totalCost;
  
}

// set up the test data
var testSetOne = [
  {
    'cost': LOW_COST,
    'startDate': new Date(2015,08,01),
    'endDate': new Date(2015,08,03)
  }
]
    
var testSetTwo = [
  {
    'cost': LOW_COST,
    'startDate': new Date(2015,08,01),
    'endDate': new Date(2015,08,01)
  },{
    'cost': HIGH_COST,
    'startDate': new Date(2015,08,02),
    'endDate': new Date(2015,08,06)
  },{
    'cost': LOW_COST,
    'startDate': new Date(2015,08,06),
    'endDate': new Date(2015,08,08)
  }
]

var testSetThree = [
  {
    'cost': LOW_COST,
    'startDate': new Date(2015,08,01),
    'endDate': new Date(2015,08,03)
  },{
    'cost': HIGH_COST,
    'startDate': new Date(2015,08,05),
    'endDate': new Date(2015,08,07)
  },{
    'cost': HIGH_COST,
    'startDate': new Date(2015,08,08),
    'endDate': new Date(2015,08,08)
  }
]

var testSetFour = [
  {
    'cost': LOW_COST,
    'startDate': new Date(2015,08,01),
    'endDate': new Date(2015,08,01)
  },{
    'cost': LOW_COST,
    'startDate': new Date(2015,08,01),
    'endDate': new Date(2015,08,01)
  },{
    'cost': HIGH_COST,
    'startDate': new Date(2015,08,02),
    'endDate': new Date(2015,08,02)
  },{
    'cost': HIGH_COST,
    'startDate': new Date(2015,08,02),
    'endDate': new Date(2015,08,03)
  }
]

document.write("Test 1" + calculateReimbursements(testSetOne));
document.write("Test 2" + calculateReimbursements(testSetTwo));
document.write("Test 3" + calculateReimbursements(testSetThree));
document.write("Test 4" + calculateReimbursements(testSetFour));
