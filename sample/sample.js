
$(function() {
	
	prettyPrint();
	

	//jquery ui draggable-----------------
	$("[id^=sakana]").draggable({
		containment: "body"
	});


	//sample1-------------------------------------
	$("#sakana").to({"left":230,"top":10}, 500, "swing", function(){
		$(this).trigger("mousedown");

		$(this).clone().attr("id","")
			.to("scaleOut")
			.to(function(){$(this).remove()})
		;
	})

	$("#sakana").on("mousedown touchstart", function(e){
		$(this).smartPopover(
			"<div class=bigfont>Drag me!</div>"
			);
	});


	//sample2-------------------------------------
	$("#sakana2").on("mousedown touchstart", function(e){
		$(this).smartPopover(
			"<div class=midfont >MetroUI style</div>",
			 {
			 	"background-color":"#48b1f2",
			 	"border-radius": 0
			 }
		);
	});

	//sample3-------------------------------------
	$("#sakana3").on("mousedown touchstart", function(e){
		$(this).smartPopover(
			"<div class=whitefont >Black and Narrow arrow</div>",
			 {
			 	"background-color":"#333",
			 	"arrowsize": 30,
			 	"arrowwidth": 7
			 }
		);
	});
	



	//omake
	$(".kmagine").scene("first");

	$("#avator_k_kiso")
		.loop()
			.to("poyo")
			.wait(2000)
		.endloop();

	$("#avator_k_kiso").draggable({
		containment: "body",
		axis: "x" 
	});

	var html = $("#select-tooltip").remove();
	$("#avator_k_kiso").on("mousedown touchstart", function(e){
		$(this).smartPopover(html, {transitionms: 200});
		$(this).stoploop();
		//$("#avator_ageru").show();
	});

	$("#avator_k_kiso").on("mouseup touchend", function(e){
		$("#avator_k_kiso").stoploop()
		.loop()
			.to("poyo")
			.wait(1000)
		.endloop();
	});	


	$("#mob1").hide();
	$("#mob12").hide();
	$("#avator_ageru").hide();

});


//for kmagine resource json
_km.scene_json = 
{"first":{"children":{"avator_k_kiso":{"sprite":"avator_k_kiso","z-index":"10","x":14,"y":-194,"children":{"avator_k_aki":{"sprite":"avator_k_aki","x":55,"y":33}}},"mob1":{"sprite":"mob1","x":341,"y":-93},"mob12":{"sprite":"mob1","x":415,"y":-95},"avator_ageru":{"sprite":"avator_ageru","z-index":"5","x":114,"y":-172}}}}
;
_km.resource_json =
{"avator_k_aki":{"src":"avator_k_aki.png","w":39,"h":27},"avator_k_toji":{"src":"avator_k_toji.png","w":41,"h":21},"avator_k_kiso":{"src":"avator_k_kiso.png","w":132,"h":195},"mob1":{"src":"mob1.png","w":49,"h":101},"mob2":{"src":"mob2.png","w":49,"h":106},"avator_ageru":{"src":"avator_ageru.png","w":33,"h":83},"avator_kangaeru":{"src":"avator_kangaeru.png","w":35,"h":70}};
;