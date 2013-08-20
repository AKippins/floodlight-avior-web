define([
	"jquery",
	"underscore",
	"backbone",
	"marionette",
	"floodlight/topologyFl",
	"model/topology",
	"text!template/topology.html",
	"text!template/switchHeading.html",
], function($, _, Backbone, Marionette, TopologyCollection, Topology, topologyTpl, switchHeading){
	var TopologyView = Backbone.Marionette.ItemView.extend({
		el: $('#content'),
		
		template: _.template(topologyTpl),
		
		// accepts an array of switch dpids and hosts
		// connected to the controller
		initialize: function(s, h) {
			//console.log(s);
			//console.log(h);
			this.switches = s;
			this.hosts = h;
			_.forEach(h.models, function(item) {
				if (item.attributes.attachmentPoint.length != 0)
					this.switches.push(item);
					//console.log(JSON.stringify(item.attributes.attachmentPoint));
			}, this);
			//console.log(JSON.stringify(this.switches));
			//console.log(this.hosts);
		},
		
		//render the topology model using d3.js
		render: function() {
			var self = this;
			this.switchLinks;
			this.$el.append(this.template).trigger('create');
			var topology = new TopologyCollection({model: Topology});
			topology.fetch().complete(function () {
				this.switchLinks = topology;
				self.showTopo(topology);
        	}, this);
			//console.log(JSON.stringify(topology));
			
        	return this;
		},
		
		showTopo: function(switchLinks) {
			var self = this;
			var height = window.innerHeight;
			var width = window.innerWidth-45;
			
			var force = d3.layout.force()
    			.size([width, height])
    			.charge(-400)
    			.linkDistance(40)
    			.on("tick", tick);

			var drag = force.drag()
    			.on("dragstart", dragstart);

			var svg = d3.select(this.el).append("svg")
    			.attr("width", width)
    			.attr("height", height);
    
			$(window).bind('resize', function () { 
				height = window.innerHeight;
				width = window.innerWidth-45;
    			$("svg").attr("height", height);
    			$("svg").attr("width", width);
				//console.log(window.innerHeight);
				//console.log(window.innerWidth);
				//console.log($("svg"));
			});

			var link = svg.selectAll(".link"),
    		node = svg.selectAll(".node");
			
			var edges = [];
				
			// create source and target links based on dpid instead of index
			_.forEach(switchLinks.models, function(e) { 
    			
    			// Get the source and target nodes
    			var sourceNode = self.switches.filter(function(n) {
    												  	return n.id === e.attributes['src-switch']; 
    												  })[0],
        		targetNode = self.switches.filter(function(n) {
    											  		return n.id === e.attributes['dst-switch']; 
    											 })[0];
	
    			// Add the edge to the array
   		 		edges.push({source: sourceNode, target: targetNode});
			}, this);
			
			_.forEach(this.hosts.models, function(e) { 
    			console.log(JSON.stringify(e));
    			// Get the source and target nodes
    			if (e.attributes.attachmentPoint.length > 0) {
    			var sourceNode = self.switches.filter(function(n) { 
    													return e.attributes.attachmentPoint[0].switchDPID ===  n.id; 
    												  })[0],
        		targetNode = self.switches.filter(function(n) { 
    											  		return n.id === e.attributes.attachmentPoint[0].switchDPID; 
    											  })[0];

    			// Add the edge to the array
    			if (targetNode != undefined)
    				targetNode = e;
   		 		edges.push({source: sourceNode, target: targetNode});
   		 		}
			}, this);
			
			console.log((edges.length));
  			force
      			.nodes(this.switches.models)
      			.links(edges)
      			.start();

  			link = link.data(edges)
    				   .enter().append("line")
      				   .attr("class", "link");

   			node = node.data(this.switches.models)
   					   .enter().append("g")
   					   .attr("class", "node")
   					   //.append("circle")
      				   //.attr("r", 12)
      				   //.style("fill", function(d) { if (d.attributes.id === undefined) return "blue"; else return "green"; })
      				   .call(drag);
      			
      		node.append("circle")
      				   .attr("r", 12)
      				   .style("fill", function(d) { if (d.attributes.id === undefined) return "blue"; else return "green"; });	
      				   
			node.append("text")
    .attr("x", 12)
    .attr("dy", ".35em")
    .text(function() { return "red"; });

			function tick() {
				
  				link.attr("x1", function(d) { return d.source.x; })
      			.attr("y1", function(d) { return d.source.y; })
      			.attr("x2", function(d) { return d.target.x; })
      			.attr("y2", function(d) { return d.target.y; });

  				//node.attr("cx", function(d) { return d.x = Math.max(12, Math.min(width - 12, d.x)); })
      		    	//.attr("cy", function(d) { return d.y = Math.max(12, Math.min(height - 12, d.y)); });
      		    	node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
			}	

			function dragstart(d) {
  				d.fixed = true;
  				d3.select(this).classed("fixed", true);
			}									                    		      	                  		          	                  	  		
        		
		},
				
	});
	return TopologyView;
}); 