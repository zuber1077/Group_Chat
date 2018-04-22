/**
*	Counter
*	Version: 1.0.1
*	URL: @ThemeMountain
*	Description: Count up/down plugin
*	Requires: jQuery 1.10+
*	Author: ThemeMountain
*	Copyright: Copyright 2014 ThemeMountain
*	License: Attribution-NonCommercial 3.0 (http://creativecommons.org/licenses/by-nc/3.0/)
*/

;(function ($) {

	'use strict';

	var Counter = function( element, options ){

		// Settings
		var settings = $.extend( {}, $.fn.counter.tmcOpts, options ); 

		// Object & jQuery el
		var el = $( element );
		var obj = this;

		// Timer
		var countTimer;

		// Start counter
		obj.startCounter = function(){

			// Ensure it's cleared for
			// recurring events 
			obj.clearCounter();

			// Check if individual data attributes are set otherwise use
			// default parameters
			var fromNumber = el.data( 'count-from' ) ? parseFloat( el.data( 'count-from' ) ) : settings.from;
			var toNumber = el.data( 'count-to' ) ? parseFloat( el.data( 'count-to' ) ) : settings.to;
			var countInterval = el.data( 'count-interval' ) ? parseFloat( el.data( 'count-interval' ) ) : settings.interval;

			// Check direction
			var direction = fromNumber <= toNumber ? 'up' : 'down';

			countTimer = setInterval( function () {

				// Stop
				if( fromNumber === toNumber || isNaN( fromNumber )  || isNaN( toNumber ) ){
					clearInterval( countTimer );
					if( settings.onComplete ) settings.onComplete();
				}
					
				// Update
				el.text( formatNumber( fromNumber ) );

				// Check direction
				if( direction === 'up' ) fromNumber++;
				else fromNumber--;
				
			}, countInterval );
		};

		// Clear counter
		obj.clearCounter = function(){
			clearInterval( countTimer );
			var initNumber = el.data( 'count-from' ) ? parseFloat( el.data( 'count-from' ) ) : settings.from;
			el.html( initNumber );
		};

		// Format number with comma
		function formatNumber( number ) {
		  return number.toString().replace( /(\d)(?=(\d{3})+$)/g, '$1,' );
		}

		// Start counter
		if( settings.autoStart ) obj.startCounter();
	};

	// Plugin
	$.fn.counter = function ( options ) {

		// Iterate through each DOM element and return it
		return this.each(function() {

			var element = $( this );

			// Return early if this element already has a plugin instance
			if ( element.data( 'counter' ) ) return;

			// Pass options
			var counter = new Counter( this, options );

			// Store plugin object in this element's data
			element.data( 'counter', counter );

		});
	};

	// Default
	$.fn.counter.tmcOpts = {
		autoStart: true,					// Boolean: Whether counter should start automatically
		from: 0,							// Integer: starting number
		to: 100, 							// Integer: ending number
		interval: 20,						// Integer: how often counter should update in milliseconds
		onComplete: null					// Integer: once counting is done
	};
})( jQuery );