/**
*	Horizon
*	Version: 1.0.4
*	URL: @ThemeMountain
*	Description: Reveal Plugin
*	Requires: jQuery 1.10+
*	Author: ThemeMountain
*	Copyright: Copyright 2013 ThemeMountain
*	License: Attribution-NonCommercial 3.0 (http://creativecommons.org/licenses/by-nc/3.0/)
*/

;(function( $, document, window, undefined ) {

	'use strict';

	var Horizon = function( element, options ){

		// Settings
		var settings = $.extend( {}, $.fn.horizon.tmhOpts, options ); 

		// jQuery el
		element = $( element );

		// Mobile - set opacity and visibility
		if( mobile ) {
			element.css({ opacity: 1, visibility: 'visible' });
		}

		// Initial data
		element
				.data( 'scrolling', false )
				.css( '-webkit-backface-visibility', 'hidden' );

		// Element animation array
		var startAttrArray;

		if( element.is( '[data-parallax]' ) || settings.parallax ){
			settings.parallax = true;
			settings.threshold = 0;
			element.data( 'threshold', 0 ); 
			element.parent().addClass( 'tmh-perspective-parallax' );
			element.addClass( 'tmh-parallax-item' );
			startAttrArray = String( element.data( 'parallax' ) ).split( ';' );
			updateElementState( element, settings, true );
		}else{
			element.parent().addClass( 'tmh-perspective' );
			startAttrArray = String( element.data( 'animate-in' ) ).split( ';' );
		}

		// Check for presets
		if ( $.inArray( 'preset', String( startAttrArray ).split( ':' ) ) != -1 ){
			startAttrArray.filter( function( item ) {
				if ( item.split(':')[0] === 'preset' ){
					startAttrArray.splice( $.inArray( item, startAttrArray ) , 1 );
					var presetArray =  String( animationPresetArray[ item.split(':')[1] ] ).split( ';' );
					startAttrArray = $.merge( presetArray, startAttrArray ).filter( Boolean );
					if( typeof startAttrArray[0] !== 'undefined' ) addDataAttributes();
				}
			});
		}else{
			startAttrArray = startAttrArray.filter( Boolean );
			if ( startAttrArray[0] !== 'undefined' ) addDataAttributes();
		}

		// Element animation attributes
		// Get and set them
		function addDataAttributes(){
			$.each( startAttrArray , function( i, pair ) {
				pair = pair.split( ':' );
				var k = pair[0];
				var v = pair[1];

				// Check translate unit
				var unit = v.indexOf( 'px' ) >= 0 ? 'px' : v.indexOf( '%' ) >= 0 ? '%' : 'px';

				// Clean up any possible mistakes
				v = isNaN( parseFloat( v ) ) ? v : parseFloat( v );	

				// Set
				if( !settings.parallax ){
					if ( k === 'opacity' ) element.data( 'o', v );
					if ( k === 'scale' ) element.data( 's', v );
					if ( k === 'easing' ) element.data( 'e', v );
					if ( k === 'transX' ) element.data( 'tx', v + unit );
					if ( k === 'transY' ) element.data( 'ty', v + unit );
					if ( k === 'transZ' ) element.data( 'tz', v + unit );
					if ( k === 'rotateX' ) element.data( 'rx', v + 'deg' );
					if ( k === 'rotateY' ) element.data( 'ry', v + 'deg' );
					if ( k === 'rotateZ' ) element.data( 'rz', v + 'deg' );
					if ( k === 'transOrigX' ) element.data( 'ox', v + '%' );
					if ( k === 'transOrigY' ) element.data( 'oy', v + '%' );
					if ( k === 'duration' ) element.data( 'du', v + 'ms' );
					if ( k === 'delay' ) element.data( 'de', v + 'ms');
				}else{
					if ( k === 'direction' ) element.data( 'pd', v );
					if ( k === 'speed' ) element.data( 'ps', v );
					if ( k === 'rotate' ) element.data( 'pr', v );
					if ( k === 'opacity' ) element.data( 'po', v );
				}
			});
		}

		// Add window event
		$( window ).on( 'scroll', function(){
			requestScroll( element, settings, false );
		});
		$( window ).on( 'resize', function(){
			requestScroll( element, settings, false );
		});

		// Animate if already in view
		if( !settings.parallax )setElementState( element, settings );
		requestScroll( element, settings );
	};

	/**
	*	Prevent rAF from stacking up
	*/

	var requestScroll = function( element, settings, startup ){
		if ( !element.data( 'scrolling' ) ) {
			requestAnimationFrame( function () {
				updateElementState( element, settings, startup );
			});
			element.data( 'scrolling', true );
		}
	};

	/**
	*	Update element state
	*/

	var updateElementState = function( element, settings, startup ){
		if( isElementVisible( element, settings ) || startup ){

			if( !settings.parallax ){

				// Check duration, delay and timing function
				var tox = element.data( 'ox' ) ? element.data( 'ox' ) : '50%';
				var toy = element.data( 'oy' ) ? element.data( 'oy' ) : '50%';
				var duration = element.data( 'du' ) ? element.data( 'du' ) : settings.speed;
				var delay = element.data( 'de' ) ? element.data( 'de' ) : 0;
				var easing = element.data( 'e' ) ? easingArray[ element.data( 'e' ) ] : easingArray[ settings.easing ];
				
				// Call animate
				if( tSupport ){
					animate( element, 1, 0, 0, 0, 0, 0, 0, 1, tox, toy, duration, delay, easing, settings );
				}else{
					element.css({ visibility: 'visible' }).stop().animate({ opacity: 1 }, settings.speed, settings.easingFallback, function(){

						// Callback
						if( settings.inView ) settings.inView();
					});
				}
			}else{
				
				if( mobile ) return false;

				// Check direction, speed, rotation & opacity
				var direction = element.data( 'pd' ) ? element.data( 'pd' ) : 'vertical';
				var speed = element.data( 'ps' ) ? element.data( 'ps' ) : settings.parallaxSpeed;
				var rotate = element.data( 'pr' ) ? element.data( 'pr' ) : 'none';
				var opacity = element.data( 'po' ) ? element.data( 'po' ) : 'none';

				// Calculate
				var win = $( window );
				var winTop = win.scrollTop();
				var elTop = element.offset().top;
				var distance = win.height() * speed;
				var distanceRemaining = ( element.parent().height() + element.parent().offset().top ) - winTop;
				var scroll = -( ( elTop-winTop-win.height() ) * speed ) - distance;
				var transX = direction === 'horizontal' ? scroll + 'px' : 0;
				var transY = direction === 'vertical' ? scroll + 'px' : 0;
				var rotateFactor = -( ( elTop-winTop-win.height() ) * 0.1 ) - distance;
					rotate = rotate === 'clockwise' ? -scroll * 0.02 + 'deg' : rotate === 'anticlockwise' ? scroll * 0.02 + 'deg' : 0 ;
				 	opacity = opacity === 'fade' ? distanceRemaining / element.parent().height() : 1;

				// Call animate
				if( tSupport ) {
					if( win.width() >= 768 ) {
						animate( element, opacity.toFixed(2), transX, transY, 0, rotate, rotate, rotate, 1, '50%', '50%', 0, 0, 'ease-out', settings );
					}else{
						animate( element, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, '100ms', 0, 'swing', settings );
					}
				}

			}
		}
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
		
		// Reposition only if fully outside of bounds
		// remove if resetting of state is required before
		if( offsetTop - winTop > $( window ).height() || offsetTop - winTop < -element.outerHeight() ){
			if( settings.recurring ) setElementState( element, settings );
			
			// Callback
			if( settings.outOfView ) settings.outOfView();
		}
		return ( winBottom >= elTop && winTop <= elBottom );
	};

	/**
	*	Position element
	*/

	var setElementState = function( element, settings ){
		if( mobile ) return false;
		var o = element.data( 'o' ) ? element.data( 'o' ) : 0; 
		var tx = element.data( 'tx' ) ? element.data( 'tx' ) : 0;
		var ty = element.data( 'ty' ) ? element.data( 'ty' ) : 0; 
		var tz = element.data( 'tz' ) ? element.data( 'tz' ) : 0; 
		var rx = element.data( 'rx' ) ? element.data( 'rx' ) : 0; 
		var ry = element.data( 'ry' ) ? element.data( 'ry' ) : 0; 
		var rz = element.data( 'rz' ) ? element.data( 'rz' ) : 0; 
		var s = element.data( 's' ) ? element.data( 's' ) : 1;
		if( tSupport ) {
			element.css({
					transition: 'none',
					transform : 'translate3d(' + tx + ', ' + ty + ', ' + tz + ' )' +
								'rotateX(' + rx + ') ' +
								'rotateY(' + ry + ') ' +
								'rotateZ(' + rz + ') ' +
								'scale3d(' + s + ', ' + s + ', ' + s + ')',
					opacity: o,
					visibility: 'hidden'
			});
		}else{
			element.css({ opacity: 0 });
		}
	};

	/**
	*	Animation Handling
	*	@param selector (required) object;
	*	@param opacity - delay (required) integer;
	*	@param easing (required) string;
	*	@param settings (required) array;
	*/

	var animate = function( selector, opacity, transX, transY, transZ, rotateX, rotateY, rotateZ, scale, transOrigX, transOrigY, duration, delay, easing, settings ){

		// Animation magic
		var attrs = {};
		attrs.transform =   'translate3d(' + transX + ', ' + transY + ', ' + transZ + ') ' +
							'rotateX(' + rotateX + ') ' +
							'rotateY(' + rotateY + ') ' +
							'rotateZ(' + rotateZ + ') ' +
							'scale3d(' + scale + ', ' + scale + ', ' + scale + ')';
		attrs.transitionProperty = transform + ', opacity';
		attrs.transformOrigin = transOrigX + ' ' + transOrigY + ' 0';
		attrs.transitionDuration = duration;
		attrs.transitionDelay = delay;
		attrs.transitionTimingFunction = easing;
		attrs.visibility = 'visible';
		attrs.opacity = opacity;
		selector
				.css( attrs )
				.on( transitionEnd, function( event ){
					
					// Prevent bubbling
					event.stopPropagation();
					
					// Remove listener
					$( this ).off( transitionEnd );

					// Callback
					if( settings.inView ) settings.inView();
				});
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
	var transitionDelay = prefix + '-transition-delay';
	var transitionTimingFunction = prefix + '-transition-timing-function';
	var transitionEnd = 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend';

	// Easing Array
	// For converting jQuery easing types
	// to Cubic Bezier format for CSS3 transitons
	var easingArray = {
		'linear':'cubic-bezier(0, 0, 1, 1)',
		'swing':'cubic-bezier(0.42, 0, 0.58, 1)',
		'easeOutCubic':'cubic-bezier(.215,.61,.355,1)',
		'easeInOutCubic':'cubic-bezier(.645,.045,.355,1)',
		'easeInCirc':'cubic-bezier(.6,.04,.98,.335)',
		'easeOutCirc':'cubic-bezier(.075,.82,.165,1)',
		'easeInOutCirc':'cubic-bezier(.785,.135,.15,.86)',
		'easeInExpo':'cubic-bezier(.95,.05,.795,.035)',
		'easeOutExpo':'cubic-bezier(.19,1,.22,1)',
		'easeInOutExpo':'cubic-bezier(1,0,0,1)',
		'easeInQuad':'cubic-bezier(.55,.085,.68,.53)',
		'easeOutQuad':'cubic-bezier(.25,.46,.45,.94)',
		'easeInOutQuad':'cubic-bezier(.455,.03,.515,.955)',
		'easeInQuart':'cubic-bezier(.895,.03,.685,.22)',
		'easeOutQuart':'cubic-bezier(.165,.84,.44,1)',
		'easeInOutQuart':'cubic-bezier(.77,0,.175,1)',
		'easeInQuint':'cubic-bezier(.755,.05,.855,.06)',
		'easeOutQuint':'cubic-bezier(.23,1,.32,1)',
		'easeInOutQuint':'cubic-bezier(.86,0,.07,1)',
		'easeInSine':'cubic-bezier(.47,0,.745,.715)',
		'easeOutSine':'cubic-bezier(.39,.575,.565,1)',
		'easeInOutSine':'cubic-bezier(.445,.05,.55,.95)',
		'easeInBack':'cubic-bezier(.6,-.28,.735,.045)',
		'easeOutBack':'cubic-bezier(.175, .885,.32,1.275)',
		'easeInOutBack':'cubic-bezier(.68,-.55,.265,1.55)',

		// Special
		'easeFastSlow':'cubic-bezier(.11,.69,.66,1.01)',
		'easeBounceBack':'cubic-bezier(.16,1.36,.57,.96)',
		'easeBounceBackHard':'cubic-bezier(.8,1.91,0,.94)',
		'easeBounceIn':'cubic-bezier(.15,2.6,0,-0.2)',
		'easeSwingInOut':'cubic-bezier(.35,3.8,0.3,-0.6)'
	};

	// Animation Preset Array
	var animationPresetArray = {
		
		'fadeIn':'opacity: 0;easing: swing;',

		// Slide in
		'slideInUpShort' : 'opacity:0;transY: 50px;easing:easeFastSlow;',
		'slideInRightShort' : 'opacity:0;transX: 50px;easing:easeFastSlow;',
		'slideInDownShort' : 'opacity:0;transY: -50px;easing:easeFastSlow;',
		'slideInLeftShort' : 'opacity:0;transX: -50px;easing:easeFastSlow;',
		'slideInUpLong' : 'opacity:0;transY: 250px;easing:easeFastSlow;',
		'slideInRightLong' : 'opacity:0;transX: 250px;easing:easeFastSlow;',
		'slideInDownLong' : 'opacity:0;transY: -250px;easing:easeFastSlow;',
		'slideInLeftLong' : 'opacity:0;transX: -250px;easing:easeFastSlow;',

		// Bounce in
		'bounceIn' : 'opacity:0;scale:0.7;easing:easeBounceIn;',
		'bounceOut' : 'opacity:0;scale:1.4;easing:easeBounceIn;',
		'bounceInUp' : 'opacity:0;transY: 250px;easing:easeBounceIn;',
		'bounceInRight' : 'opacity:0;transX: 250px;easing:easeBounceIn;',
		'bounceInDown' : 'opacity:0;transY: -250px;easing:easeBounceIn;',
		'bounceInLeft' : 'opacity:0;transX: -250px;easing:easeBounceIn;',
		
		// Scale in
		'scaleIn' : 'opacity:0;scale: 0.6;easing:easeFastSlow;',
		'scaleOut' : 'opacity:0;scale: 1.4;easing:easeFastSlow',
		
		// Flips & Spins
		'flipInX' : 'opacity:0;rotateX: -180deg;easing:easeFastSlow;',
		'flipInY' : 'opacity:0;rotateY: -180deg;easing:easeFastSlow;',
		'spinInX' : 'opacity:0;rotateX: -540deg;easing:easeFastSlow;',
		'spinInY' : 'opacity:0;rotateY: -540deg;easing:easeFastSlow;',
		'helicopterIn' : 'opacity:0;scale: 0.6;rotateZ: -360deg;easing:easeFastSlow;',
		'helicopterOut' : 'opacity:0;scale: 1.4;rotateZ: -360deg;easing:easeFastSlow;',
		
		// Special
		'signSwingTop' : 'opacity:0;rotateX:-60deg;transOrigX:50%;transOrigY:0%;easing:easeSwingInOut;',
		'signSwingRight' : 'opacity:0;rotateY:-60deg;transOrigX:100%;transOrigY:50%;easing:easeSwingInOut;',
		'signSwingBottom' : 'opacity:0;rotateX:-60deg;transOrigX:50%;transOrigY:100%;easing:easeSwingInOut;',
		'signSwingLeft' : 'opacity:0;rotateY:-60deg;transOrigX:0%;transOrigY:50%;easing:easeSwingInOut;',
		'wiggleX' : 'opacity:0;rotateX:-90deg;transOrigX:50%;transOrigY:50%;easing:easeSwingInOut;',
		'wiggleY' : 'opacity:0;rotateY:-90deg;transOrigX:50%;transOrigY:50%;easing:easeSwingInOut;',
		'dropUp' : 'opacity:0;transY: 250px;rotateZ:20deg;transOrigX:50%;transOrigY:50%;easing:easeBounceBackHard;',
		'dropDown' : 'opacity:0;transY: -250px;rotateZ:-20deg;transOrigX:0%;transOrigY:0%;easing:easeBounceBackHard;',
		'rollInLeft' : 'opacity:0;transX: -250px;transY: 200px;rotateZ: -120px;transOrigX:0%;transOrigY:0%;easing:easeFastSlow;',
		'rollInRight' : 'opacity:0;transX: 250px;transY: 200px;rotateZ: 120px;transOrigX:100%;transOrigY:0%;easing:easeFastSlow;',
		'turnInRight' : 'opacity:0;transX: 250px;rotateX:20deg;rotateY:75deg;transOrigX:0%;transOrigY:0%;easing:easeBounceBack;',
		'turnInLeft' : 'opacity:0;transX: -250px;rotateX:20deg;rotateY:-75deg;transOrigX:100%;transOrigY:0%;easing:easeBounceBack;'
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
	$.fn.horizon = function( options ) {

		// Iterate through each DOM element and return it
		return this.each(function() {

			var element = $( this );

			// Return early if this element already has a plugin instance
			if ( element.data( 'horizon' ) ) return;

			// Pass options
			var horizon = new Horizon( this, options );

			// Store plugin object in this element's data
			element.data( 'horizon', horizon );

		});
	};

	// Default
	$.fn.horizon.tmhOpts = {
		easing: 'swing',				// Easing type: string, see easingArray
		easingFallback: 'swing',		// Easing fallback: for older browser that do not support custom easing
		speed: '1000ms',				// Animation speed: milliseconds 
		threshold: 1,					// Threshold: integer 0-1, how much of element should be visibel before animation begins
		recurring: true,				// Recurring: boolean, if animation should occur over and over on scrolling
		parallax: false,				// Parallax: boolean, whether element should parallax instead of animate
		parallaxSpeed: 0.2,				// Parallax speed: integer 0.5, how fast parallax element should displace
		inView: null,					// When element is in view and animation is done
		outOfView: null					// When element is out of view
	};
})( jQuery, document, window );