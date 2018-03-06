exports.basic = {
		global : {phaseDuration:20},
		rebel : [
			{id:'x01', type:'xwing', pos:{x:-1, y:1.2, z:0.3}, rot:{x:0, y:270, z:0}}
		],
		empire: [
			{id:'t01', type:'tie', pos:{x:2, y:1.2, z:-0.2}, rot:{x:0, y:90, z:0}},
			{id:'t02', type:'tie', pos:{x:2, y:1.2, z:+0.7}, rot:{x:0, y:90, z:0}}
		]
	};

exports.advanced = {
		global : {phaseDuration:60},
		rebel : [
			{id:'x01', type:'xwing', pos:{x:0, y:1.2, z:0.3}, rot:{x:0, y:0, z:0}},
			{id:'x02', type:'xwing', pos:{x:0.1, y:1.0, z:-0.0}, rot:{x:0, y:0, z:0}}
		],
		empire: [
			{id:'t01', type:'tie', pos:{x:2, y:1.2, z:-0.2}, rot:{x:0, y:180, z:0}},
			{id:'t02', type:'tie', pos:{x:2, y:1.2, z:-0.2}, rot:{x:0, y:180, z:0}},
			{id:'t03', type:'tie', pos:{x:1.4, y:1.2, z:-0.2}, rot:{x:0, y:180, z:0}},
			{id:'t04', type:'tie', pos:{x:1.4, y:1.2, z:+0.7}, rot:{x:0, y:180, z:0}}
		]
	};