var reimbursementCalculatorTester = (function () {

	var _public = {};

	var testSuite = [
		{
			'label': "Example Project Set 1",
			'expected': 165,
			'projects': [
				{
					'cost': reimbursementCalculator.getLowCost(),
					'startDate': new Date(2015,08,01),
					'endDate': new Date(2015,08,03)
				}
			]
		},{
			'label': "Example Project Set 2",
			'expected': 590,
			'projects': [
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
		},{
			'label': "Example Project Set 3",
			'expected': 445,
			'projects': [
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
		},{
			'label': "Example Project Set 4",
			'expected': 185,
			'projects': [
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
		},{
			'label': "Bad Cost Test 1",
			'expected': -1,
			'projects': [
				{
					'cost': 20,
					'startDate': new Date(2015,08,01),
					'endDate': new Date(2015,08,03)
				}
			]
		},{
			'label': "Bad Cost Test 2",
			'expected': -1,
			'projects': [
				{
					'cost': "LOW",
					'startDate': new Date(2015,08,01),
					'endDate': new Date(2015,08,03)
				}
			]
		},{
			'label': "Bad Start Date Test",
			'expected': -1,
			'projects': [
				{
					'cost': reimbursementCalculator.getLowCost(),
					'startDate': "monkey",
					'endDate': new Date(2015,08,03)
				}
			]
		},{
			'label': "Bad End Date Test",
			'expected': -1,
			'projects': [
				{
					'cost': reimbursementCalculator.getLowCost(),
					'startDate': new Date(2015,08,01),
					'endDate': -34324233432432432432
				}
			]
		},{
			'label': "Bad Date Range Test",
			'expected': -1,
			'projects': [
				{
					'cost': reimbursementCalculator.getLowCost(),
					'startDate': new Date(2015,08,03),
					'endDate': new Date(2015,08,01)
				}
			]
		},{
			'label': "No Cost Test",
			'expected': -1,
			'projects': [
				{
					'startDate': new Date(2015,08,01),
					'endDate': new Date(2015,08,03)
				}
			]
		},{
			'label': "No Start Date Test",
			'expected': -1,
			'projects': [
				{
					'cost': reimbursementCalculator.getLowCost(),
					'endDate': new Date(2015,08,03)
				}
			]
		},{
			'label': "No End Date Test",
			'expected': -1,
			'projects': [
				{
					'cost': reimbursementCalculator.getLowCost(),
					'startDate': new Date(2015,08,01)
				}
			]
		},{
			'label': "Empty Start Date Test",
			'expected': -1,
			'projects': [
				{
					'cost': reimbursementCalculator.getLowCost(),
					'startDate': null,
					'endDate': new Date(2015,08,03)
				}
			]
		},{
			'label': "Empty End Date Test",
			'expected': -1,
			'projects': [
				{
					'cost': reimbursementCalculator.getLowCost(),
					'startDate': new Date(2015,08,01),
					'endDate': ""
				}
			]
		}
	];
	
	_public.runTests = function () {
		
		var output = "";
		
		testSuite.forEach(function(test) {
		
			var result = reimbursementCalculator.calculateProjects(test.projects);
			
			output += test.label + ": Expected " + test.expected + ", Calculated " + result + ".";
			test.expected != result ? output += " FAILED<br>" : output += " PASSED<br>";
			
		});
		
		return output;
		
	}
		
	return _public;
	
}());
