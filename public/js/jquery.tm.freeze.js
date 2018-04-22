/**
*	Freeze
*	Version: 1.0.3
*	URL: @ThemeMountain
*	Description: Hands up, freeeeeze!
*	Requires: jQuery 1.10+
*	Author: ThemeMountain
*	Copyright: Copyright 2013 ThemeMountain
*	License: Attribution-NonCommercial 3.0 (http://creativecommons.org/licenses/by-nc/3.0/)
*/

;(function( $, document, window, undefined ) {

	'use strict';

	var Freeze = function( element, options ){

		// Settings
		var settings = $.extend( {}, $.fn.freeze.tmfOpts, options ); 

		// jQuery el
		element = $( element );

		// Override defaults
		settings.extraSpaceTop = element.data( 'extra-space-top' ) ? element.data( 'extra-space-top' ) : settings.extraSpaceTop;
		settings.extraSpaceBottom = element.data( 'extra-space-bottom' ) ? element.data( 'extra-space-bottom' ) : settings.extraSpaceBottom;
		settings.pushSection = element.data( 'push-section' ) ? element.data( 'push-section' ) : settings.pushSection;
		settings.threshold = element.data( 'threshold' ) ? element.data( 'threshold' ) : settings.threshold;

		// Original scroll position
		var origPosition = $( window ).scrollTop();
		var orignDistance = element.offset().top;
		var offsetUpdate = false;
		element
				.data( 'startup', true )
				.data( 'orignDistance', orignDistance )
				.css({ width: '100%', display: 'flex', flexDirection: 'column' });

		// On startup
		requestScroll( element, settings );
		
		// Add window event
		$( window ).on( 'scroll resize', function(){
			setWrapperHeight( element );
			if( !element.data( 'startup' ) ) requestScroll( element, settings );
			if( $( window ).width() >= settings.breakpoint && offsetUpdate ){
				offsetUpdate = false;
				orignDistance = element.offset().top;
				element.data( 'orignDistance', orignDistance );
			}else if(  $( window ).width() < settings.breakpoint ){
				offsetUpdate = true;
			}
		});

		// Crete wrapper and set height
		element.wrapAll( "<div class='freeze-wrapper' />");
		setWrapperHeight( element );
	};

	/**
	*	Set wrapper height
	*/

	var setWrapperHeight = function( element ){
		var height = element.outerHeight( true );
		element.parent().css({ height: height + 'px' });
	};

	/**
	*	Freeze element
	*/

	var freezeElement = function( element, settings ){

		var winWidth = $( window ).width();
		if( winWidth >= 960 ){

			var winScrollTop = $( window ).scrollTop();
			var elementOrigOffset = element.data( 'orignDistance' );
			var elementHeight = element.outerHeight( true );
			var newTop = Math.abs( ( $( settings.pushSection ).offset().top - ( elementOrigOffset + elementHeight ) ) + settings.extraSpaceTop ) ;		
			
			// Calculate distances
			var distanceFromTop = ( elementOrigOffset - winScrollTop ) - settings.extraSpaceTop;	
			var distanceFromBottom = ( ( elementOrigOffset + ( $( settings.pushSection ).offset().top - ( elementOrigOffset + elementHeight ) ) ) - winScrollTop ) - settings.extraSpaceTop;
			
			// Swap positions
			if( distanceFromTop <= 0 || distanceFromTop <= 0 && element.data( 'startup' ) ){
				element.addClass( 'sticky' ).css({ maxWidth: $( element ).parent().width() + 'px', position: 'fixed', top: settings.extraSpaceTop  + 'px', zIndex: 5 });
				if( distanceFromBottom <= 0 + settings.extraSpaceBottom ){
					element.removeClass( 'sticky' ).css({ top: newTop - settings.extraSpaceTop - settings.extraSpaceBottom + 'px', position: 'relative', zIndex: 5 });
				}
			}else{
				if( winScrollTop <= element.offset().top - settings.extraSpaceTop ) element.addClass( 'sticky' ).css({ maxWidth: $( element ).parent().width() + 'px', position: 'fixed', top: settings.extraSpaceTop + 'px', zIndex: 5 });
				if( element.offset().top <= elementOrigOffset ) element.removeClass( 'sticky' ).css({ maxWidth: '', position: '', top: '' , zIndex: '' });
			}
		}else{
			element.removeClass( 'sticky' ).css({ maxWidth: '', position: '', top: '' , zIndex: '' });
		}

		// Startup over
		element.data( 'startup', false );
	};

	/**
	*	Prevent rAF from stacking up
	*/

	var requestScroll = function( element, settings ){
		if ( !element.data( 'scrolling' ) ) {
			requestAnimationFrame( function () {
				updateElementState( element, settings );
			});
			element.data( 'scrolling', true );
		}
	};

	/**
	*	Update element state
	*/

	var updateElementState = function( element, settings ){
		if( isElementVisible( element, settings ) || element.data( 'startup' ) ) element.removeClass( 'out-of-view' );
		else element.addClass( 'out-of-view' );
		freezeElement( element, settings );
		element.data( 'scrolling', false );
	};

	/**
	*	Check for whether element 
	*	is in/out of the viewport
	*/

	var isElementVisible = function( element, settings ){
		var winTop = $( window ).scrollTop();
		var winBottom = winTop + $( window ).height();
		var threshold = element.data( 'threshold' ) ? parseFloat( element.data( 'threshold' ) ) : settings.threshold;
		var transY = element.data( 'ty' ) ? parseFloat( element.data( 'ty' ) ) : 0;
		var offsetTop = element.offset().top;
		var adjustedOffsetTop = ( element.offset().top - transY );
		var elBottom = ( adjustedOffsetTop + element.outerHeight() ) - ( element.outerHeight() * threshold );
		var elTop = adjustedOffsetTop + ( element.outerHeight() * threshold );
		return ( winBottom >= elTop && winTop <= elBottom );
	};

	// Mobile Check
	var mobile = false;
	if( navigator.userAgent.match(/Android/i) || 
		navigator.userAgent.match(/webOS/i) ||
		navigator.userAgent.match(/iPhone/i) || 
		navigator.userAgent.match(/iPad/i) ||
		navigator.userAgent.match(/iPod/i) || 
		navigator.userAgent.match(/BlackBerry/i) || 
		navigator.userAgent.match(/Windows Phone/i) ){
			mobile = true;
	}

	// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
	// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel 
	// MIT license
	(function() {
		var lastTime = 0;
		var vendors = ['ms', 'moz', 'webkit', 'o'];
		for( var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x ) {
			window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
			window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
		}
		if ( !window.requestAnimationFrame )
		window.requestAnimationFrame = function( callback, element ) {
				var currTime = new Date().getTime();
				var timeToCall = Math.max( 0, 16 - ( currTime - lastTime ) );
				var id = window.setTimeout( function() { callback(currTime + timeToCall); }, 
				timeToCall);
				lastTime = currTime + timeToCall;
				return id;
		};
		if ( !window.cancelAnimationFrame )
			window.cancelAnimationFrame = function( id ) {
				clearTimeout( id );
			};
	}());

	// Plugin
	$.fn.freeze = function( options ) {

		// Iterate through each DOM element and return it
		return this.each(function() {

			// Mobile
			if( mobile ) return false;

			// Element
			var element = $( this );

			// Return early if this element already has a plugin instance
			if ( element.data( 'freeze' ) ) return;

			// Pass options
			var freeze = new Freeze( this, options );

			// Store plugin object in this element's data
			element.data( 'freeze', freeze );

		});
	};

	// Default
	$.fn.freeze.tmfOpts = {
		extraSpaceTop: 0,
		extraSpaceBottom: 0,
		pushSection: 'footer',
		threshold: 1,
		breakpoint: 960
	};
})( jQuery, document, window );