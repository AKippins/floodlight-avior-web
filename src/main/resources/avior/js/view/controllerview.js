define([
	"jquery",
	"underscore",
	"backbone",
	"marionette",
	"floodlight/firewallModFl",
	"text!template/firewallEditor.html",
	"text!template/actionSelect.html",
	"text!template/controller.html",
	"view/topologyView",
], function($, _, Backbone, Marionette, FirewallMod, firewallEditor, actionSelect, controllerTpl, TopologyView){
	var ControllerView = Backbone.Marionette.CompositeView.extend({
		el: $('#content'),
		 itemView: TopologyView,
		 itemViewContainer: "#topologyview",
		template: controllerTpl,
		
		template3: _.template(controllerTpl),


		initialize: function(){
			this.render();
		},

		events: {
			"click #leftMenuIcon": "resize",
			"click #rightMenuIcon": "resize",
		},
		

		render: function() {
			//$('#container2').remove();
			$('#content').empty();
			this.$el.html(this.template3(this.model.toJSON())).trigger('create');
			return this;
		},

		resize: function(){
		
                var winHeight = window.innerHeight;
                document.getElementById("leftMenu").style.height = winHeight + "px";
                document.getElementById("rightMenu").style.height = winHeight + "px";
		},
	
	});
	return ControllerView;
});