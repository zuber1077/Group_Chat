/**
*	Snowbridge Parallax
*	Version: 1.0.5
*	URL: @ThemeMountain
*	Description: Parallax plugin
*	Requires: jQuery 1.10+
*	Author: ThemeMountain
*	Copyright: Copyright 2013 ThemeMountain
*	License: Attribution-NonCommercial 3.0 (http://creativecommons.org/licenses/by-nc/3.0/)
*/

;(function( $, document, window, undefined ) {

	'use strict';

	var SnowBridge = function( element, options ){

		// Settings
		var settings = $.extend( {}, $.fn.snowBridge.tmpOpts, options ); 

		// jQuery el
		var container = $( element );

		// Startup data
		container
				.data( 'animating', false )
				.data( 'setup', false );

		// Fade in/out
		settings.fadeInOut = container.is( '[data-fade-in-out="false"]' ) ? false : settings.fadeInOut;

		// Check parallax factor
		if( settings.parallaxFactor > 1 ) settings.parallaxFactor = 1;

		// Setup done
		container.data( 'setup', true );

		// Preload
		preload( container, settings );
	};

	/**
	*	Preload Images
	*	@param container (required) object; 
	*	@param settings (required) array;
	*/

	function preload( container, settings ){

		// Construct parallax element
		var parallaxEl = $( '<div class="tm-parallax" />' ).prependTo( $( container ) );

		// Set target container
		if( mobile ) parallaxEl.css({ height: '' }).addClass( 'tmp-mobile' );

		// Add preloader to parllax element
		var loader = $( '<div class="tm-loader"><svg id="circle" viewBox="25 25 50 50"><circle class="stroke" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>' );
		loader.appendTo( parallaxEl );

		// Check if retina
		var src = container.data( 'src' );
		var imgExt = src.substr( ( src.lastIndexOf( '.' ) ) );
		if( window.isRetinaDevice() && settings.retinaSupport || window.isRetinaDevice() && container.is( '[data-retina]' ) ){
			if( !mobile && !settings.retinaSupportMobile || mobile && settings.retinaSupportMobile ){
				if( !src.match( /\.(svg)/i ) ){
					if( !container.data( 'retina' ) ) src = container.data( 'src' ).replace( imgExt, settings.retinaSuffix + imgExt );
					else src = container.data( 'retina' );
				}
			}
		}

		// Preload image of container container
		// and add it to the parallax elelment
		$( '<img class="tmp-media"/>' )
								.attr( 'src', src )
								.one( 'load', function(){

									// Append image
									$( this )
											.attr( 'src', src )
											.appendTo( parallaxEl );

									// Remove loader
									parallaxEl.find( '.tm-loader' ).remove();

									// Call loaded
									loaded( container, settings );
								})
								.on( 'error', function(){
									console.log( 'Error src:' + src );
								});
		
	}

	/**
	*	Once loaded set options, positions
	*	and add necessary events
	*	@param container (required) object;  
	*	@param settings (required) array;
	*/

	function loaded( container, settings ){

		// Media
		var mediaContainer = container.find( '.tm-parallax' );
		var media = container.find( '.tmp-media' );

		// Set image as bkg of parallax container
		var parallaxURL = media.attr( 'src' );
		mediaContainer.css({ 'background-image': 'url(' + parallaxURL + ')' });
		media.hide();

		// Check opacity setting
		mediaContainer.css({ opacity: 0 });

		// Fade in
		if( tSupport && isElementVisible( container ) ){
			mediaContainer.css({ visibility: 'visible', transitionProperty: 'opacity', transitionDuration: 1000 + 'ms', opacity: 1 });
		}else{
			mediaContainer.css({ visibility: 'visible' }).animate({ opacity: 1 });
		}

		// Add window events
		$( window ).on( 'resize', function(){
			resizeParallax( container, settings );
			requestScroll( container, settings );
		}).resize();
		$( window ).on( 'scroll', function(){
			requestScroll( container, settings );
		});

		// Snowbridge section loaded callback	
		if( settings.onLoaded ) settings.onLoaded();
	}

	/**
	*	Prevent rAF from stacking up
	*/
	var requestScroll = function( container, settings ){
		if ( !container.data( 'animating' ) ) {
			window.requestAnimationFrame( function () {
				updateParallaxElement( container, settings );
			});
			container.data( 'animating', true );
		}
	};

	/**
	*	Resize container and images
	*/

	var resizeParallax = function( container, settings ){

		// Container references
		var mediaContainer = container.find( '.tm-parallax' );
		var winH = $( window ).height();
		var containerH = container.height();
		var scrollDistContainer = ( container.height() + winH ) * settings.parallaxFactor;

		// Set parallax container height
		if( settings.fullscreen || settings.scaleContainer ){
			mediaContainer.css({
				height: scrollDistContainer + 'px'
			});	
		}

		// Check that setup is done
		if( !container.data( 'setup' ) ) return false;

		// Save data
		container.data( 'scrollDistContainer', scrollDistContainer );
	};

	/**
	*	Scroll parllax container, its images
	*	and fade images in/out as moving in/out of view
	*/

	var updateParallaxElement = function( container, settings ){
		var media = container.find( '.tm-parallax' );
		if( isElementVisible( container ) ){

			if( mobile ) return false;

			// Distance remaining until container is fully out of view up top
			var distanceRemaining = ( container.height() + container.offset().top ) - $( window ).scrollTop();

			// Current y position of container container
			var parallaxElTransY = container.offset().top - $( window ).scrollTop();
			
			// container y position of image
			// centered vertically
			var yPosImg = 0 - media.height() / 2;
			
			// Current y position of image
			var mediaTransY = ( yPosImg / 2 * ( distanceRemaining / container.data( 'scrollDistContainer') ) ) * settings.parallaxFactor;

			// Animate
			if( tSupport ){
				media.css({ transform: 'translate3d( 0px' + ', ' + mediaTransY + 'px' + ', 0px)', visibility: 'visible' }).removeClass( 'out-of-view' );
			}else{
				media.css({ top: mediaTransY + 'px', visibility: 'visible' });
			}

			// Opacity
			if( settings.fadeInOut ) {
				var opacity;
				var adjustedOpacity;
				var winH = $( window ).height();
				var threshold = settings.fadeThreshold > 1 ? container.height() * 0.5 : container.height() * settings.fadeThreshold;
				if( parallaxElTransY <= threshold ){ 
					opacity = Math.abs( distanceRemaining / threshold ) > 1 ? 1 : Math.abs( distanceRemaining / threshold );
				}
				if( parallaxElTransY <= winH && parallaxElTransY >= winH - threshold ){
					opacity = ( winH - parallaxElTransY ) / threshold > 1 ? 1 : ( winH - parallaxElTransY ) / threshold;
				}
				media.css({ opacity: ( Math.ceil( opacity * 100 ) / 100 ).toFixed( 2 ) });
			}
		}else{
			if( !mobile ) media.css({ visibility: 'hidden' }).addClass( 'out-of-view' );
		}
		container.data( 'animating', false );
	};

	/**
	*	Check for whether container 
	*	is in/out of the viewport
	*/

	var isElementVisible = function( element ){
		var winTop = $( window ).scrollTop();
		var winBottom = winTop + $( window ).height();
		var elTop = element.offset().top;
		var elBottom = elTop + element.outerHeight();
		return ( winBottom >= elTop && winTop <= elBottom );
	};

	/**
	*	Check if retina deivce
	*/

	window.isRetinaDevice = function(){
		var mediaQuery = '(-webkit-min-device-pixel-ratio: 1.5), (min--moz-device-pixel-ratio: 1.5), (-o-min-device-pixel-ratio: 3/2), (min-resolution: 1.5dppx)';
		if ( this.devicePixelRatio > 1 || this.matchMedia && this.matchMedia( mediaQuery ).matches ) return true;
		return false;
	};

	// Animation support & prefixing
	var t = document.body || document.documentElement;
	var s = t.style;
	var tSupport = s.transition !== undefined || s.WebkitTransition !== undefined || s.MozTransition !== undefined || s.MsTransition !== undefined || s.OTransition !== undefined;
	var property = [ 'WebkitTransform', 'MozTransform', 'OTransform', 'msTransform' ];
	var prefix;
	for( var i in property ){
		if( s[ property[ i ] ] !== undefined ){
			prefix = '-' + property[ i ].replace( 'Transform', '' ).toLowerCase();
		}
	}
	var transform = prefix + '-transform';
	var transitionProperty = prefix + '-transition-property';
	var transitionDuration = prefix + '-transition-duration';

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
	$.fn.snowBridge = function( options ) {

		// Iterate through each DOM element and return it
		return this.each(function() {

			var element = $( this );

			// Return early if this element already has a plugin instance
			if ( element.data( 'snowBridge' ) ) return;

			// Pass options
			var snowbridge = new SnowBridge( this, options );

			// Store plugin object in this element's data
			element.data( 'snowBridge', snowbridge );

		});
	};

	// Default
	$.fn.snowBridge.tmpOpts = {
		fullscreen: false,					// Whether parallax sections take screen dimensions or set dimensions
		parallaxFactor: 0.6,				// Rate of parallax scrolling
		fadeInOut: false,					// Fade parallax image in/out when entering/exiting viewport
		fadeThreshold: 0.5,					// Threshold in pixels before fading starts/ends
		retinaSupport: true,				// Check for retina displays and serve retina image
		retinaSupportMobile: false,			// Whether swap should occur on mobile devices
		retinaSuffix: '@2x',				// Retina image suffix

		// Callback
		onLoaded: null						// Callback: after parllax section has loaded
	};
})( jQuery, document, window );