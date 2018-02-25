var scenarios= {
	basic : {
		global : {phaseDuration:30},
		rebel : [
			{type:'xwing', pos:{x:0, y:1.2, z:0.3}, rot:{x:0, y:0, z:0}}
		],
		empire: [
			{type:'tie', pos:{x:2, y:1.2, z:-0.2}, rot:{x:0, y:180, z:0}},
			{type:'tie', pos:{x:2, y:1.2, z:+0.7}, rot:{x:0, y:180, z:0}}
		]
	},
	
	advanced : {
		global : {phaseDuration:60},
		rebel : [
			{type:'xwing', pos:{x:0, y:1.2, z:0.3}, rot:{x:0, y:0, z:0}},
			{type:'xwing', pos:{x:0.1, y:1.0, z:-0.0}, rot:{x:0, y:0, z:0}}
		],
		empire: [
			{type:'tie', pos:{x:2, y:1.2, z:-0.2}, rot:{x:0, y:180, z:0}},
			{type:'tie', pos:{x:2, y:1.2, z:-0.2}, rot:{x:0, y:180, z:0}},
			{type:'tie', pos:{x:1.4, y:1.2, z:-0.2}, rot:{x:0, y:180, z:0}},
			{type:'tie', pos:{x:1.4, y:1.2, z:+0.7}, rot:{x:0, y:180, z:0}}
		]
	}
};