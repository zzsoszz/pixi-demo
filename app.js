/*
 *  jquery-boilerplate - v4.0.0
 *  A jump-start for jQuery plugins development.
 *  http://jqueryboilerplate.com
 *
 *  Made by Zeno Rocha
 *  Under MIT License
 */
// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;( function( $, window, document, undefined ) {

	"use strict";

		// undefined is used here as the undefined global variable in ECMAScript 3 is
		// mutable (ie. it can be changed by someone else). undefined isn't really being
		// passed in so we can ensure the value of it is truly undefined. In ES5, undefined
		// can no longer be modified.

		// window and document are passed through as local variable rather than global
		// as this (slightly) quickens the resolution process and can be more efficiently
		// minified (especially when both are regularly referenced in your plugin).

		// Create the defaults once
		var pluginName = "fruitFall",
			defaults = {
				canvasSize: {
					x:640,
					y:690
				},
				dpr:window.devicePixelRatio
			};

		// The actual plugin constructor
		function Game ( element, options ) {
			this.element = element;
			this.settings = $.extend( {}, defaults, options );
			this._defaults = defaults;
			this._name = pluginName;
			this.init();
		}

		// Avoid Plugin.prototype conflicts
		$.extend( Game.prototype, {
			init: function() {
				//createig the pixi stage
				this.stage=new PIXI.Stage(0x66FF99);

				//create a root pixi object container
				this.scene=new PIXI.DisplayObjectContainer();
				this.stage.addChild(this.scene);

				//create a render instance and set size  to default
				this.renderer=PIXI.autoDetectRenderer(defaults.canvasSize.x,defaults.canvasSize.y);
				
				//add the renderer to the DOM
				$(this.element).append(this.renderer.view);

				//start animation ticker
				window.requestAnimationFrame(this.animate.bind(this));
				
				$(window).on("resize deviceOrientation",this.rendererResize.bind(this));

				$(window).trigger("resize");

				this.loadAssets();

			},
			rendererResize:function(){
				//create target scale
				var targetScale=1;
				//if dpr is greater than  1.2
				//load and scale everyting based on a dpr of 2

				if(defaults.dpr>1.2)
				{
					defaults.dpr=2;
				}
				var cv=defaults.canvasSize;
				var ih=$(window).innerHeight();
				var iw=$(window).innerWidth();
				var new_w=iw/cv.x;
				var new_h=ih/cv.y;

				if(new_h>1 && new_w>1)
				{
					targetScale=1;
				}else{
					if(new_h>new_w)
					{
						targetScale=new_w;
					}else{
						targetScale=new_h;
					}
				}
				var w=targetScale*cv.x;
				var h=targetScale*cv.y;

				this.renderer.resize(w,h);
				console.log(defaults.dpr);
				this.scene.scale.x=this.scene.scale.y=targetScale/defaults.dpr;

			},
			animate: function() {
				window.requestAnimationFrame(this.animate.bind(this));
				this.renderer.render(this.stage);
			},
			loadAssets: function() {
				var loader ;
				if(defaults.dpr>1.2){
					loader = PIXI.loader.add('assets/2x/interface.json')
							.on("progress", this.loadProgressHandler.bind(this));
				}
				else
				{
					loader = PIXI.loader.add('assets/interface.json')
							.on("progress", this.loadProgressHandler.bind(this));
				}
            	loader.load(this.onLoadAssets.bind(this));
			},
			onLoadAssets: function() {
				var id=PIXI.loader.resources['assets/interface.json'].textures;
				console.log(id);
				var paperBG = new PIXI.Sprite(id["bg.png"]);
            	this.scene.addChild(paperBG);
			},
			loadProgressHandler:function(loader, resource) {
			  console.log("loading: " + resource.url); 
			  console.log("progress: " + loader.progress + "%"); 
			}
		} );

		// A really lightweight plugin wrapper around the constructor,
		// preventing against multiple instantiations
		$.fn[ pluginName ] = function( options ) {
			return this.each( function() {
				if ( !$.data( this, "plugin_" + pluginName ) ) {
					$.data( this, "plugin_" +
						pluginName, new Game( this, options ) );
				}
			} );
		};

} )( jQuery, window, document );
