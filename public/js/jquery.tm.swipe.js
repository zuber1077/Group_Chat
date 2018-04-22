/**
*	Swipe Plugin
*	Version: 1.0
*	URL: @ThemeMountain
*	Description: Touch Swipe for Mobile Devices
*	Requires: jQuery 1.10+
*	Author: ThemeMountain
*	Copyright: Copyright 2014 ThemeMountain
*	License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/

;(function ($) {

	'use strict';

	$.fn.swipeIt = function ( options ) {
		
		// Defaults
		var settings = $.extend({
				swipeThreshold: 40,				// Amount to be swiped in px before action occurrs
				scrollThreshold: 10, 
				draggable: false,				// Whether element should be draggable before release
				preventTouchOn: '',				// Class or id that should not receive touch
				onSwipeMove: null,				// Callback: when user is moving
				onSwipeEnd: null				// Callback: when swipe has been completed
			}, options );
		
		// Startup
		var el = this;
		var xStart = 0;
		var xEnd = 0;
		var threshold = settings.swipeThreshold; 
		var hasTouch = 'ontouchend' in document;
		var touchStart = hasTouch ? 'touchstart': 'pointerdown';
		var touchMove = hasTouch ? 'touchmove': 'pointermove';
		var touchStop = hasTouch ? 'touchend': 'pointermove';
		
		// Start
		var swipeStart = function( event ){
			event.stopPropagation();
			xStart = event.originalEvent.touches ? event.originalEvent.touches[0].pageX : event;
			el.on( touchMove, swipeMove );
		};

		// Move
		var swipeMove = function( event ){
			if( !$( event.target ).closest( settings.preventTouchOn ).length || settings.preventTouchOn === '' ){
				xEnd = event.originalEvent.touches ? event.originalEvent.touches[0].pageX : event;
				if( Math.abs( xStart - xEnd ) > settings.scrollThreshold ) event.preventDefault();
				if( settings.draggable ){
					var position;
					position = -( xStart - xEnd );
					settings.onSwipeMove( position );
				}
				if( xEnd === xStart ) return false;
				el.on( touchStop, swipeEnd );
			}
		};

		// End
		var swipeEnd = function(){
			var direction;
			if ( Math.abs( xEnd - xStart ) > threshold ) {
				if( xEnd > xStart ){
					direction = 'left';
				}else{
					direction = 'right';
				}
				settings.onSwipeEnd( direction );
			}
			el.off( touchMove, swipeMove );
			el.off( touchStop, swipeEnd );
		};
		
		el.on( touchStart, swipeStart) ;
		return this;
	};
})( jQuery );