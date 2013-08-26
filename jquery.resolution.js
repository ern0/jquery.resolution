// jquery.resolution.js - 2013.08.26


(function($) {

	$.fn.resolution = function(show,resolutionList,callback,attenuate) {
		var diz = this;
		var self = $.fn.resolution;
		
		
		function cb(test,w,h,r) {
		
			var dpr = window.devicePixelRatio;
			if (typeof(dpr) == "undefined") dpr = 1;
			
			if (typeof(w) == "undefined") w = $(window).width();
			if (typeof(h) == "undefined") h = $(window).height();
				
			if (show) {
				if ( $(document).height() < $(window).height() ) {
					h -= $("table.resolution").height();
				}
			}
			
			diz.width(w);
			diz.height(h);
			diz.css("overflow-x","hidden");
			diz.css("overflow-y","scroll");
			
			callback.call(diz,diz.get(0).clientWidth,h,dpr,test);

		} // cb()
		
		
		$(document).ready(function() {
			cb(false);
		});
		
		
		self.tim = null;
		self.dly = attenuate;
		if (typeof(self.dly) == "undefined") self.dly = 200;
		
		$(window).resize(function() {

			if (self.tim != null) clearTimeout(self.tim);
			self.tim = setTimeout(function() {
			
				var w = $(window).width();
				var h = $(window).height();
			
				cb(false,w,h);	
			
			},self.dly); // setTimeout()
			
		}); // $(window).resize()
		
		if (!show) return this;
		

		var itemCount = [];
		var itemIndex = "&nbsp;";

		var table = document.createElement("TABLE");
		table.className = "resolution";
		table.style.position = "fixed";
		table.style.bottom = "0px";
		table.style.right = "0px";
		var row1 = document.createElement("TR");
		row1.className = "resolution";
		var row2 = document.createElement("TR");
		row2.className = "resolution";
		var row3 = document.createElement("TR");
		row3.className = "resolution";

		for (i in resolutionList) {
			var item = resolutionList[i];
			if (typeof(item[1]) == "undefined") {
				itemIndex = item[0];
			} else {
				if (typeof(itemCount[itemIndex]) == "undefined") itemCount[itemIndex] = 0;
				itemCount[itemIndex]++;
				if (item[4]) itemCount[itemIndex]++;
			}
		} // foreach resulutionList
		
		var lastTop = "";
		for (i in resolutionList) {
			var item = resolutionList[i];
			
			if (typeof(item[1]) == "undefined") {
			
				var td = document.createElement("TD");
				td.className = "resolution resolution1";
				td.colSpan = itemCount[item[0]];
				td.innerHTML = item[0];
				td.id = "resolution-" + item[0];
				row1.appendChild(td);
				lastTop = item[0];
				
			} else {
					
				var td = document.createElement("TD");
				td.className = "resolution resolution" + item[3];
				var l = item[1];
				var s = item[2];
				td.innerHTML = item[0] + "<br/>(" + l + "x" + s + ")";
				if (l < s) {
					l = item[2];
					s = item[1];
				}
				td.id = "resolution-" + l + "x" + s + "x" + item[3];
				row2.appendChild(td);
				
				if (item[4]) {
				
					td.colSpan = 2;
					var xx = [["P",s,l],["L",l,s]];
					for (var ii in xx) {
						var x = xx[ii];
						(function(o,w,h,r,t,l,s) {
							var td = document.createElement("TD");
							td.className = "resolution resolution" + r;
							td.innerHTML = o;
							$(td).click(function() {
								$(".resolution").removeClass("resolution-selected");
								$(this).addClass("resolution-selected");
								$("#resolution-" + l + "x" + s + "x" + r).addClass("resolution-selected");
								$("#resolution-" + t).addClass("resolution-selected");
								cb(true,w,h,r);
							});							
							row3.appendChild(td);
						})(x[0],x[1],x[2],item[3],lastTop,l,s);
					} // foreach orientation

				} else {  // if rotation

					td.rowSpan = 2;
					(function(l,s,r,t) {
						$(td).click(function() {
							$(".resolution").removeClass("resolution-selected");
							$(this).addClass("resolution-selected");
							$("#resolution-" + t).addClass("resolution-selected");
							cb(true,l,s,r);
						});
					})(l,s,item[3],lastTop);					
					
				} // else no rotation
				
			} // else item
		} // foreach resulutionList
		
		table.appendChild(row1);
		table.appendChild(row2);
		table.appendChild(row3);
			
		this.before(table);
		
		return this;				
	}; // $.fn.resulution()

}(jQuery));
