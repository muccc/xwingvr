exports.basic = {
		global : {
			movementPhaseDuration:10,
			actionPhaseDuration:10
			},
		rebel : [
			{id:'x01', type:'xwing', pos:{x:-2, y:1.2, z:-1.3}, rot:{x:0, y:270, z:0}, hull:100, shields:100}
		],
		empire: [
			{id:'t01', type:'tie', pos:{x:2, y:1.2, z:-1.2}, rot:{x:0, y:90, z:0}, hull:100, shields:0},
			{id:'t02', type:'tie', pos:{x:2, y:1.2, z:-1.7}, rot:{x:0, y:90, z:0}, hull:100, shields:0}
		]
	};

exports.advanced = {
		global : {
			movementPhaseDuration:60,
			actionPhaseDuration:60
			},
		rebel : [
			{id:'x01', type:'xwing', pos:{x:0, y:1.2, z:-0.3}, rot:{x:0, y:270, z:0}, hull:100, shields:100},
			{id:'x02', type:'xwing', pos:{x:0.1, y:1.0, z:-0.0}, rot:{x:0, y:270, z:0}, hull:100, shields:100}
		],
		empire: [
			{id:'t01', type:'tie', pos:{x:2, y:1.2, z:-0.2}, rot:{x:0, y:90, z:0}, hull:100, shields:0},
			{id:'t02', type:'tie', pos:{x:2, y:1.2, z:-0.7}, rot:{x:0, y:90, z:0}, hull:100, shields:0},
			{id:'t03', type:'tie', pos:{x:1.4, y:1.2, z:-0.2}, rot:{x:0, y:90, z:0}, hull:100, shields:0},
			{id:'t04', type:'tie', pos:{x:1.4, y:1.2, z:+0.7}, rot:{x:0, y:90, z:0}, hull:100, shields:0}
		]
	};
