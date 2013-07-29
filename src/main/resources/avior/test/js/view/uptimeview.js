define([
	"jquery",
	"underscore",
	"backbone",
	"text!template/uptimetpl.html",
], function($, _, Backbone, uptimeTpl){
	var UptimeView = Backbone.View.extend({
	    tagName: "div",
	    
		template: _.template(uptimeTpl),
		
		initialize: function(){
			this.collapsed = true;
			this.model.fetch();
			var self = this;
			// this.listenTo(this.model, "change", this.render);
			this.listenTo(this.model, "sync", this.render);
			$('.controllerHeading').click(function() {self.clickable();});
		},
		
		events: {
			"click #loadup": "refresh",
		},
		
		// Re-render the titles of the todo item.
	    render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			console.log("Uptime model ----------------->");
			console.log(JSON.stringify(this.model));
			return this;
	    },
	    
		refresh: function(){this.model.fetch();},

		//only call fetch when the view is visible
		clickable: function() {
			if (this.collapsed){
				this.collapsed = false;
				var self = this;
				this.interval = setInterval(function(){self.model.fetch()}, 2000);
			}
			else{
				this.collapsed = true;
				clearInterval(this.interval);
			}
		},
	});
	return UptimeView;
});

