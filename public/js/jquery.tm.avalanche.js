/**
*	Avalanche Slider
*	Version: 1.4.0
*	URL: @ThemeMountain
*	Description: Content Slider
*	Requires: jQuery 1.10+
*	Author: ThemeMountain
*	Copyright: Copyright 2016 ThemeMountain
*	License: Attribution-NonCommercial 3.0 (http://creativecommons.org/licenses/by-nc/3.0/)
*/
;(function( $, document, window, undefined ) {

	'use strict';

	var AvalancheSlider = function( element, options ){

		// Settings
		var settings = $.extend( {}, $.fn.avalancheSlider.tmsOpts, options );

		// Variables used throughout
		var slider = $( element );
		var obj = this;
		var refW = settings.fulscreen ? $( window).width() : settings.fullwidth ? settings.scaleUnder : slider.data( 'width' ) ? parseFloat( slider.data( 'width' ) ) : parseFloat( slider.css( 'width' ) );
		var refH = settings.fulscreen ? $( window ).height() : slider.data( 'height' ) ? parseFloat( slider.data( 'height' ) ) : parseFloat( slider.css( 'height' ) );
		var slides = slider.find( '.tms-slides' ); 
		var active = slides.children( 'li:first-child' ).addClass( 'active' );
		var slidesArray = [];
		var origAnimation;

		// Set slide ids
		slides.children( '.tms-slide' ).each( function( i ){
			i++;
			$( this ).attr( 'id', 'tms-slide-' + i );
			slidesArray.push( $(this).attr( 'id' ) );
			if( !settings.carousel ){
				if( tSupport ){
					$( this ).not( '.active' ).css({ transition: 'none', transform: 'translate3d( 100%, 0, 0)' });
				}else{
					$( this ).not( '.active' ).css({ left: '100%' });
				}
			}

			// Check forcefit option
			var slideBkgVideo = $( this ).is( '[data-video-bkg]' ) || $( this ).is( '[data-video-bkg-youtube]' ) || $( this ).is( '[data-video-bkg-vimeo]' ) ? true : false;
			if( settings.forceFit || $( this ).is( '[data-force-fit]' ) || slideBkgVideo ) {
				$( this ).addClass( 'tms-forcefit' );
			}

			// Check for YouTube and Vimeo bkg video
			if( slideBkgVideo ) $( this ).addClass( 'tms-bkg-video' );
			if( $( this ).is( '[data-video-bkg-youtube]' ) )  $( this ).addClass( 'tms-bkg-video-youtube' );
			if( $( this ).is( '[data-video-bkg-vimeo]' ) )  $( this ).addClass( 'tms-bkg-video-vimeo' );
		});

		/////////////////////////////////////////////////////////////////////////
		// Slider settings
		/////////////////////////////////////////////////////////////////////////

		// Check lazy load setting
		if( !settings.lazyLoad ) active.css({ opacity: 0 });

		// Check scale under data settings
		settings.scaleUnder = slider.data( 'scale-under' ) ? slider.data( 'scale-under' ) : settings.scaleUnder;

		// Check min acceptable height for slider
		settings.scaleMinHeight = slider.data( 'scale-min-height' ) ? slider.data( 'scale-min-height' ) : settings.scaleMinHeight;

		// Check animation data settings
		settings.animation = slider.data( 'animation' ) ? slider.data( 'animation' ) : settings.animation;
		origAnimation = settings.animation;

		// Check easing data settings
		settings.easing = slider.data( 'easing' ) ? slider.data( 'easing' ) : settings.easing;

		// Check speed data settings
		settings.speed = slider.data( 'speed' ) ? slider.data( 'speed' ) : settings.speed;

		// Check carousel data settings
		settings.carousel = slider.data( 'carousel' ) ? slider.data( 'carousel' ) : settings.carousel;
		settings.carouselVisible = slider.data( 'carousel-visible-slides' ) ? slider.data( 'carousel-visible-slides') : settings.carouselVisible;
		settings.carouselVisible = settings.carouselVisible > slides.children().length ? slides.children().length : settings.carouselVisible;

		// Check auto advance data settings
		settings.showProgressBar = slider.is( '[data-progress-bar="false"]' ) ? false : settings.showProgressBar;
		settings.autoAdvance = slider.is( '[data-auto-advance]' ) ? true : settings.autoAdvance;
		settings.interval = slider.data( 'auto-advance-interval' ) ? slider.data( 'auto-advance-interval' ) : settings.interval;
		settings.pauseOnHover = slider.is( '[data-pause-on-hover="false"]' ) ? false : settings.pauseOnHover;

		// Check nav data settings
		settings.navArrows = slider.is( '[data-nav-arrows="false"]' ) ? false : settings.navArrows;
		settings.navPagination = slider.is( '[data-nav-pagination="false"]' ) ? false : settings.navPagination;
		settings.navShowOnHover = slider.is( '[data-nav-show-on-hover="false"]' ) ? false : settings.navShowOnHover;
		settings.navKeyboard = slider.is( '[data-nav-keyboard="false"]' ) ? false : settings.navKeyboard;

		// Check whether to add global nav dark class to header
		if( slider.is( '[data-nav-dark]' ) || active.is( '[data-nav-dark]' ) ){
			slider.addClass( 'tms-nav-dark' );
			if( slider.is( '[data-featured-slider]' ) ) $( 'header' ).addClass( 'nav-dark' );
		}

		// Check special fullscreen use case
		if( settings.fullscreen ) {
			slider.css({ top: 0, left: 0 }).addClass( 'tms-fullscreen' );
			settings.carouselVisible = 1;
			settings.fsUseHeightOf = !settings.fsUseHeightOf && !slider.data( 'fs-use-height' ) ? '' : settings.fsUseHeightOf && !slider.data( 'fs-use-height' ) ? settings.fsUseHeightOf : slider.data( 'fs-use-height' );
			settings.fsUseHeightOf = !settings.fsUseHeightOf ? '' : settings.fsUseHeightOf === 'parent' ? slider.parent() : slider.closest( '.' + settings.fsUseHeightOf );
		}

		// Check parallax data settings
		settings.parallax = slider.is( '[data-parallax]' ) ? true : settings.parallax;
		settings.parallaxSpeed = slider.data( 'parallax-speed' ) ? slider.data( 'parallax-speed' ) : settings.parallaxSpeed;
		settings.parallaxScale = slider.is( '[data-parallax-scale-in]' ) ? true : settings.parallaxScale;
		settings.parallaxFadeOut = slider.is( '[data-parallax-fade-out]' ) ? true : settings.parallaxFadeOut;
		
		// Check caption scaling option
		if( !settings.captionScaling ) {
			slider.addClass( 'tms-caption-no-scaling' );
		}

		// Check carousel options, set visible to one if mismatch between options
		if( !settings.carousel && settings.carouselVisible ) settings.carouselVisible = 1;
		if( settings.carouselVisible > 1 ) settings.animation = 'slide';
		if( settings.carousel ) slider.addClass( 'tms-carousel' );
		if( settings.adaptiveHeight ) slider.addClass( 'tms-scalable-height' );

		// Check video API settings
		settings.autoPlay = slider.is( '[data-video-auto-play="false"]' ) ? false : settings.autoPlay;
		settings.replayOnEnd = slider.is( '[data-replay-on-end="false"]' ) ? false : settings.replayOnEnd;
		settings.nextSlideOnEnd = slider.is( '[data-next-slide-on-end]' ) ? true : settings.nextSlideOnEnd;
		settings.muteBkgVideo = slider.is( '[data-mute-video]' ) ? true : settings.muteBkgVideo;
		if( mobile ){
			settings.autoPlay = false;
			settings.useVideoAPI = false;
		}	
		
		/////////////////////////////////////////////////////////////////////////
		// Build Nav & Add Events
		/////////////////////////////////////////////////////////////////////////

		// Show on hover
		if( settings.navShowOnHover ) slider.addClass( 'show-on-hover' ); 

		// Add arrow nav
		if( settings.navArrows && slides.children().length > 1 ){

			// Build
			var prev =  $('<a href="#" />').attr( 'id', 'tms-prev' ).addClass('tms-arrow-nav').appendTo( slider );
			var next =  $('<a href="#" />').attr( 'id', 'tms-next' ).addClass('tms-arrow-nav').appendTo( slider );
				
			// Actions
			prev.each( function(){
				$(this).on( 'click', function( event ){
					event.preventDefault();
					if( settings.autoAdvance && slider.data( 'loaded' ) ) obj.resetSlideshow();
					obj.prevSlide();
				});
			});
			next.each( function(){	
				$(this).on( 'click', function( event ){
					event.preventDefault();
					if( settings.autoAdvance && slider.data( 'loaded' ) ) obj.resetSlideshow();
					obj.nextSlide();
				});
			});

			// Show arrow nav
			if( settings.lazyLoad ){
				slider.addClass( 'lazyload' ).find( '.tms-arrow-nav' ).css({ display: 'block' });
			}
		}

		// Add pagination nav
		if( settings.navPagination && slides.children().length > 1 ){
				
			// Build
			var pagination = $( '<div>' ).addClass( 'tms-pagination' ).appendTo( slider );
			for( var i = 1; i < slides.children().length + 1; i++ ) {
				slider.find( pagination ).append( '<a href="#" id="tms-pagination-' + i + '" data-index="' + i + '" class="tms-bullet-nav" />' );
			}
				
			// Ref
			var pageNav = settings.paginationType === 'bullets' ? slider.find( '.tms-bullet-nav' ) : slider.find( '.tms-thumb-nav' ); 

			// Actions
			pageNav.each( function(){
				$( this ).on( 'click', function(){
					active = slider.find( 'li.active' );
					if( $( this ).hasClass( 'active' ) ) return false;
					if( settings.autoAdvance && slider.data( 'loaded' ) ) obj.resetSlideshow();
					if( parseFloat( $( this ).data( 'index' ) ) > parseFloat( pagination.find( '.active' ).data( 'index' ) ) ) {
						obj.slideTo( $( this ).data( 'index' ), 'next' );
					}else{
						obj.slideTo( $( this ).data( 'index' ), 'prev' );
					}
					return false;
				});
			});
			pagination.find( '.tms-bullet-nav:first-child' ).addClass( 'active' );
			
			// Show pagination
			if( settings.lazyLoad ) pagination.css({ display: 'block' });
		}

		// Add keyboard nav
		if( settings.navKeyboard && slides.children().length > 1 ){
			var key = [];
			$( document ).on( 'keydown', function( event ) {
				key[event.keyCode] = true;
				if( key[37] && key[39] ){
					return false;
				}else if ( key[37] ) {
					if( settings.autoAdvance && slider.data( 'loaded' ) ) obj.resetSlideshow();
					if( settings.lazyLoad ){
						obj.prevSlide();
					}else{
						if( slider.data( 'loaded' ) ) obj.prevSlide();
					}
				} else if ( key[39] ) {
					if( settings.autoAdvance && slider.data( 'loaded' ) ) obj.resetSlideshow();
					if( settings.lazyLoad ){
						obj.nextSlide();
					}else{
						if( slider.data( 'loaded' ) ) obj.nextSlide();
					}
				}
			}).on( 'keyup', function( event ) {
				key[event.keyCode] = false;
			});
		}
		
		// Add swipe support to slides
		slider.swipeIt({
			draggable: false,
			onSwipeMove: function( position ) {
				// translateX values here
			},
			onSwipeEnd: function( swipe ) {
				if( swipe === 'left' ){
					obj.prevSlide();
				}else{
					obj.nextSlide();
				}
			}
		});

		/////////////////////////////////////////////////////////////////////////
		// Window Events
		/////////////////////////////////////////////////////////////////////////

		// Resize
		$( window ).on( 'resize', function(){

			// Update ref dimensions if browser is resized upon load
			if( slider.data( 'first-load' ) ) {
				refW = settings.fulscreen ? $( window).width() : settings.fullwidth ? settings.scaleUnder : slider.data( 'width' ) ? parseFloat( slider.data( 'width' ) ) : parseFloat( slider.css( 'width' ) );
				refH = settings.fulscreen ? $( window ).height() : slider.data( 'height' ) ? parseFloat( slider.data( 'height' ) ) : parseFloat( slider.css( 'height' ) );	
				slider
					.data( 'refW', refW )
					.data( 'refH', refH )
					.data( 'carousel-height', refH );
			}

			// Call resize
			var slidesToResize = slider.find( 'li.active, li.target' );
			if( settings.carousel && settings.carouselVisible > 1 ){
				slides.children( '.tms-slide' ).each( function(){
					redimensionSlider( $( this ), settings );
				});
			}else{
				redimensionSlider( slidesToResize, settings );
			}

			// Clear slider height before
			// recalculating visible slides
			positionCarousel( slider , settings );

			// Callback
			slider.addClass( 'resizing' );
			resizeCallBack( function(){
				slider.removeClass( 'resizing' );
			}, 300, 'resize' );
		});

		// Scroll
		$( window ).on( 'scroll', function(){
			
			// Parallax Scroll Event
			if( slider.parent().hasClass( 'tm-slider-parallax-container' ) && settings.parallax ){
				$( window ).on( 'scroll', function(){
					requestScroll( slider, settings ); 
				});

				// On startup set parallax
				updateSliderElement( slider, settings );
				
			}else if( !slider.parent().hasClass( 'tm-slider-parallax-container' ) && settings.parallax ){
				console.log( 'Add the class tm-slider-parallax-container to slider parent');
			}

			// Videos
			var active = slider.find( 'li.active' );
			var pauseMedia = active.is( '[data-pause-on-scroll]' ) ? true : false;
			if( !mobile && tSupport && isElementVisible( slider.parent() ) ){
				if( active && pauseMedia && !active.hasClass( 'video-playing' ) ) media( active, 'play', settings );
			}else{
				if( active && pauseMedia && active.hasClass( 'video-playing' ) ) media( active, 'pause', settings );
			}
		});

		// Initial slider data used throughout
		slider
			.data( 'setup', false )
			.data( 'loaded', false )
			.data( 'first-load', true )
			.data( 'scale-first', true )
			.data( 'transitioning', false )
			.data( 'refW', refW )
			.data( 'refH', refH )
			.data( 'carousel-height', refH );

		// Set caption data attributes
		setCaptionAttrs( slider );

		// Size slider container
		positionCarousel( slider , settings );

		// Setup callback
		if( settings.onSetup ) settings.onSetup();
		
		/////////////////////////////////////////////////////////////////////////
		// Public Methods
		/////////////////////////////////////////////////////////////////////////

		/**
		*	Resize
		*/

		// Init Slideshow
		obj.resizeSlider = function(){
			var slidesToResize = slider.find( 'li.active, li.target' );
			redimensionSlider( slidesToResize, settings );
			positionCarousel( slider , settings );
		};

		/**
		*	Slideshow init, start, pause, resume, reset
		*/

		var sliderTimer;
		var startTime;
		var endTime;
		var timeDiff;
		var baseInterval;
		var paused;
		var progressBar;
		var animateBarTimer = null;
		var animateSlideTimer = null;
		
		// Init Slideshow
		obj.initSlideshow = function(){

			// If timer already exists prevent
			// it from reintializing
			if( sliderTimer || slides.children().length < 2 ) return false;
			
			// Change default as slideshow
			// is now active
			settings.autoAdvance = true;

			// Add mouse events
			if( !mobile && settings.pauseOnHover ){
				slides.on( 'mouseleave ', obj.resumeSlideshow );
				slides.on( 'mouseenter ', obj.pauseSlideshow );
			}

			// Add the progress bar
			if( settings.showProgressBar ) progressBar = $( '<div>' ).addClass( 'tms-progress-bar' ).appendTo( slider );
			
			// Call start
			obj.startSlideshow();

			// Animate progress bar initially
			animateProgress( settings.interval );

			// Set up time ref
			startTime = new Date().getTime();
			baseInterval = settings.interval;

			// Ss start callback
			if( settings.onSlideshowStart ) settings.onSlideshowStart();
		};

		// Start Slideshow
		obj.startSlideshow = function ( interval ) {
			interval = !interval ? settings.interval : timeDiff;
			sliderTimer = setInterval( function () {
				
				// Reset
				if( interval !== settings.interval ){
					clearInterval( sliderTimer );
					interval = settings.interval;
					baseInterval = settings.interval;
					
					// Start slideshow again
					obj.startSlideshow();
				}
				
				// Get time when slideshow begins
				startTime = new Date().getTime();
				if( typeof progressBar !== 'undefined' ) progressBar.css({ transition: 'none', width: '0px' });
				animateProgress( settings.interval );
				obj.nextSlide();
			}, interval );
		};

		// Pause Slideshow
		obj.pauseSlideshow =  function () {
			
			// Check if it's already paused to prevent
			// endTime from updating and that timer exists
			if( paused || !sliderTimer ) return false;
			
			// Clear timer
			clearInterval( sliderTimer );
			
			// Get time when paused
			endTime = new Date().getTime();
			
			// Calculate time left of cycle
			timeDiff = baseInterval - ( endTime - startTime ) < 50 ? 50 : baseInterval - ( endTime - startTime );
			baseInterval = baseInterval === 0 ? settings.interval : timeDiff;

			// Stop progress bar animation
			if( typeof progressBar !== 'undefined' ) progressBar.stop().css({ width: progressBar.width() + 'px' });

			paused = true;

			// Ss paused callback
			if( settings.onSlideshowPause ) settings.onSlideshowPause();
		};

		// Resume Slideshow
		obj.resumeSlideshow = function () {

			// If not paused prevent resume
			if ( !paused ) return false;

			// Clear timer
			clearInterval( sliderTimer );

			// No longer paused
			slider.data( 'ssPaused', false );

			// Update start time
			startTime = new Date().getTime();

			// Start slideshow with time left in cycle
			animateProgress( timeDiff );
			obj.startSlideshow( timeDiff );

			paused = false;
		};

		// Reset Slideshow
		obj.resetSlideshow = function(){

			// Check that timer exists
			if( !sliderTimer ) return false;

			clearInterval( sliderTimer );
			
			// Set progress to nill
			if( typeof progressBar !== 'undefined' ) progressBar.css({ transition: 'none', width: '0px' });
			
			// Animate it based on original interval
			animateProgress( settings.interval );

			// Reset all time variables to origin
			startTime = new Date().getTime();
			timeDiff = settings.interval;
			baseInterval = settings.interval;
			obj.startSlideshow( settings.interval );
		};
		// End Slideshow
		obj.endSlideshow = function(){

			// Check that timer exists
			if( !sliderTimer ) return false;
			clearInterval( sliderTimer );

			//Remove timer ref
			sliderTimer = '';
			paused = false;

			// Remove mouse events
			if( !mobile && settings.pauseOnHover ){
				slides.off( 'mouseleave ', obj.resumeSlideshow );
				slides.off( 'mouseenter ', obj.pauseSlideshow );
			}

			// Remove progress bar
			if( typeof progressBar !== 'undefined' ) progressBar.remove();

			// Ss end callback
			if( settings.onSlideshowEnd) settings.onSlideshowEnd();
		};

		// Animate function for bar
		var animateProgress = function( interval ){
			if( typeof progressBar === 'undefined' ) return false;
			if( tSupport ){
				clearTimeout( animateBarTimer );
				animateBarTimer = setTimeout( function(){
					progressBar.css({ transitionProperty: 'width', width: '100%', transitionDuration: interval + 'ms', transitionTimingFunction: 'ease' });
				}, 50 );
			}else{
				progressBar.stop( true, true ).animate({ width: '100%'}, interval );
			}
		};
			
		/**
		*	Direcitonal calls
		*/

		obj.nextSlide = function(){
			if( slider.data( 'transitioning' ) ) return false;
			var index;
			
			// Update active slide
			active = slider.find( 'li.active' );
			var nextSlide = slidesArray[( $.inArray( active.attr( 'id' ), slidesArray ) + 1)];
			index = $.inArray( nextSlide, slidesArray ) + 1 === 0 ? 1 : $.inArray( nextSlide, slidesArray ) + 1;

			// Crousel true, more than 1 visible slide, set right limit
			if( settings.carousel && settings.carouselVisible > 1 ){
				var visibleSlides = carouselBreakPoints( slider, settings );
				if( visibleSlides !== 1) index = index === slides.children().length - ( visibleSlides - 2 ) ? 1 : $.inArray( nextSlide, slidesArray ) + 1;
			}
			this.slideTo( index, 'next' );
		};
		obj.prevSlide = function(){
			if( slider.data( 'transitioning' ) ) return false;
			var index;

			// Update active slide
			active = slider.find( 'li.active' );
			var prevSlide = slidesArray[( $.inArray( active.attr( 'id' ), slidesArray ) - 1)];
			index = $.inArray( prevSlide, slidesArray ) + 1 === 0 ? slides.children().length : $.inArray( prevSlide, slidesArray ) + 1;

			// Crousel true, more than 1 visible slide, set left limit
			if( settings.carousel && settings.carouselVisible > 1 ){
				var visibleSlides = carouselBreakPoints( slider, settings );
				index = index === slides.children().length ? slides.children().length - ( visibleSlides - 1 ) : $.inArray( prevSlide, slidesArray ) + 1; 
			}
			this.slideTo( index, 'prev' );
		};

		/**
		*	Go to slide
		*	@param index (required) integer;
		*		Defines target slide
		*	@param direction (optional) string;
		*		String indicating the direction of the 
		*		slider animation
		*/

		obj.slideTo = function( index, direction ){

			// Switch first load to false
			// slider now in use
			slider.data( 'first-load', false );

			// Switch scale ref
			slider.data( 'scale-first', false );

			// If called directly updated active ref
			if( !direction ) active = slider.find( 'li.active' );
			if( slider.data( 'transitioning' ) || index === $.inArray( active.attr( 'id' ), slidesArray ) + 1 ) return false;

			// Update pagination
			updatePagination( slider, index );

			// Get slider width in case
			// it has changed since previous animation	
			var sliderW = slider.width();
			var sliderH = slider.height();

			// Get target slide & swap z-index
			var target = slider.find( '#tms-slide-' + index );
			target.addClass( 'target' ).css({ zIndex: 2, opacity: tx === 0 ? 0 : 1 });
			active.css({ zIndex: 1 });

			// Check if there is individual slider animation set
			settings.animation = target.data( 'animation' ) ? target.data( 'animation' ) : origAnimation;

			// Check slide animation type
			var tx = settings.animation === 'slide' || settings.animation === 'slideLeftRight' ? sliderW : 0;
			var ty = settings.animation === 'slideTopBottom' ? sliderH : 0;
			tx *= settings.carousel ? index - 1 : 1;
			var scale = settings.animation === 'scaleIn' ? 1 - settings.scaleFactor : settings.animation === 'scaleOut' ? 1 + settings.scaleFactor : 1;

			// Check whether dark nav class should be added
			// to slider and site header
			if( !slider.is( '[data-nav-dark]' ) ) slider.removeClass( 'tms-nav-dark' );
			if( target.is( '[data-nav-dark]' ) ){
				slider.addClass( 'tms-nav-dark' );
				if( slider.is( '[data-featured-slider]' ) ) $( 'header' ).addClass( 'nav-dark' );
			}else{
				if( slider.is( '[data-featured-slider]' ) ) $( 'header' ).removeClass( 'nav-dark' );
			}

			// Position caption of target slide
			// before brought into view
			positionNextCaption( target, settings );

			// Update parallax element in the event
			// scale in/out option is used
			if( slider.parent().hasClass( 'tm-slider-parallax-container' ) && settings.parallax ) requestScroll( slider, settings ); 

			// Redimension slider and target slide
			// before brought into view
			if( target.children( 'img' ).data( 'loaded' ) || !target.children( 'img' ).length ) redimensionSlider( target, settings );
			positionCarousel( slider, settings, target );

			// If undefined it will move next
			if ( !direction ) direction = 'next';

			// Verify direction
			if( settings.carousel ){
				direction = 1;
			}else{
				direction = direction === 'next' ? 1 : -1;
			}
			
			// Check visible slides
			var visibleSlides = carouselBreakPoints( slider, settings );

			// Move to slide
			if( tSupport ){
				if( settings.carousel ){
					animate( slides, 1, -( tx / visibleSlides ) * direction, 0, 0, 0, 0, 0, 1, '50%', '50%', settings.speed, 0, easingArray[ settings.easing ], settings );
				}else{
					target.css({ opacity: 0, transition: 'none', transform: 'translate3d(' + tx * direction + 'px' + ',' + ty * direction + 'px' + ', 0) scale3d(' + scale + ', ' + scale + ', ' + scale + ')' });
					clearTimeout( animateSlideTimer );
					animateSlideTimer = setTimeout( function(){
						animate( active, 1, -tx * direction, -ty * direction, 0, 0, 0, 0, scale, '50%', '50%', settings.speed, 0, easingArray[ settings.easing ], settings );
						animate( target, 1, 0, 0, 0, 0, 0, 0, 1, '50%', '50%', settings.speed, 0, easingArray[ settings.easing ], settings );
					}, 50 );
				}
			}else{
				if( settings.carousel ){

					// Slider is now animating
					slider.data( 'transitioning' , true );
					slides.animate({ opacity: 1, left: -( tx / visibleSlides ) * direction + 'px' }, settings.speed, settings.easingFallback, function(){
						animateComplete( slider, settings );
					});
				}else{
					
					// Slider is now animating
					slider.data( 'transitioning' , true );
					target.css({ left: sliderW * direction + 'px', visibility: 'visible' }).animate({ opacity: 1, left: 0 + 'px'}, settings.speed, settings.easingFallback, function(){
						animateComplete( slider, settings );
					});
					active.animate({ left: -sliderW * direction + 'px' }, settings.speed, settings.easingFallback );
				}
			}
		};

		// Preload slides
		preload( slider, settings, obj );
	};

	/////////////////////////////////////////////////////////////////////////
	// Private Methods
	/////////////////////////////////////////////////////////////////////////

	/**
	*	Set Caption Attributes 
	*	@param slider (required) object;
	*		Iterate over all slider objects
	*		and set caption attributes upon
	*		setup
	*/

	function setCaptionAttrs( slider ){
		slider.find( '.tms-caption' ).each( function(){
			var caption = $( this );
			var startAttrArray = String( caption.data( 'animate-in' ) ).split( ';' );
			if( caption.is( '[data-no-scale]') ) caption.addClass( 'no-scale' );
			else  caption.addClass( 'scale' );

			// Add perspective class to caption parent
			caption.parent().addClass( 'tms-perspective' );

			// Check for presets
			if ( $.inArray( 'preset', String( startAttrArray ).split( ':' ) ) != -1 ){
				startAttrArray.filter( function( item ) {
					if ( item.split(':')[0] === 'preset' ){
						startAttrArray.splice( $.inArray( item, startAttrArray ) , 1 );
						var presetArray =  String( animationPresetArray[ item.split(':')[1] ] ).split( ';' );
						startAttrArray = $.merge( presetArray, startAttrArray ).filter( Boolean );
						addDataAttributes();
					}
				});
			}else{
				addDataAttributes();
			}

			// Caption animation attributes
			// Get and set them
			function addDataAttributes(){
				$.each( startAttrArray , function( i, pair ) {
					pair = pair.split( ':' );
					var k = pair[0];
					var v = pair[1];
					if ( k === 'opacity' ) caption.data( 'o', v );
					if ( k === 'scale' ) caption.data( 's', v );
					if ( k === 'easing' ) caption.data( 'e', v );
					if ( k === 'transX' ) caption.data( 'tx', parseFloat( v ) );
					if ( k === 'transY' ) caption.data( 'ty', parseFloat( v ) );
					if ( k === 'transZ' ) caption.data( 'tz', parseFloat( v ) );
					if ( k === 'rotateX' ) caption.data( 'rx', parseFloat( v ) );
					if ( k === 'rotateY' ) caption.data( 'ry', parseFloat( v ) );
					if ( k === 'rotateZ' ) caption.data( 'rz', parseFloat( v ) );
					if ( k === 'transOrigX' ) caption.data( 'ox', v );
					if ( k === 'transOrigY' ) caption.data( 'oy', v );
					if ( k === 'duration' ) caption.data( 'du', parseFloat( v ) );
					if ( k === 'delay' ) caption.data( 'de', parseFloat( v ) );
				});
			}

			// Caption box attributes
			caption.data( 'w', parseFloat( caption.css( 'width' ) ) );
			caption.data( 'h', parseFloat( caption.css( 'height' ) ) );
			caption.data( 'fs', parseFloat( caption.css( 'font-size' ) ) );
			caption.data( 'lh', parseFloat( caption.css( 'line-height' ) ) );
			caption.data( 'pt', parseFloat( caption.css( 'padding-top' ) ) );
			caption.data( 'pr', parseFloat( caption.css( 'padding-right' ) ) );
			caption.data( 'pb', parseFloat( caption.css( 'padding-bottom' ) ) );
			caption.data( 'pl', parseFloat( caption.css( 'padding-left' ) ) );
			caption.data( 'mt', parseFloat( caption.css( 'margin-top' ) ) );
			caption.data( 'mr', parseFloat( caption.css( 'margin-right' ) ) );
			caption.data( 'mb', parseFloat( caption.css( 'margin-bottom' ) ) );
			caption.data( 'ml', parseFloat( caption.css( 'margin-left' ) ) );
			caption.data( 'bt', parseFloat( caption.css( 'border-top-width' ) ) );
			caption.data( 'br', parseFloat( caption.css( 'border-right-width' ) ) );
			caption.data( 'bb', parseFloat( caption.css( 'border-bottom-width' ) ) );
			caption.data( 'bl', parseFloat( caption.css( 'border-left-width' ) ) );
		});
	}

	/**
	*	Preload Slides
	*	@param slider (required) object; 
	*	@param settings (required) array; 
	*	@param obj (required) object; 
	*		Ref to DOM element for
	*		accessing public methods
	*/

	function preload( slider, settings, obj ){

		var slide = slider.find( '.tms-slide' );

		// Slide counter
		// We dont know how many slides are in each slider
		// so we count them as we load them one by one
		var totalSlides = 0;

		// Prepare each slide
		slide.each( function(){
			
			// Check the number of images, videos and captions
			// in the current slide
			var currentSlide = $( this );
			var totalSlideImgs = currentSlide.find( 'img' ).length;
			var video = currentSlide.find( 'iframe, video' ).length;
			var caption = currentSlide.children( '.tms-caption' ).length;

			// Prepare captions of current slide and
			// set their initial animation position
			positionNextCaption( currentSlide, settings );

			// Add preloader based on 
			// preloading option
			var loader = $( '<div class="tm-loader"><svg id="circle" viewBox="25 25 50 50"><circle class="stroke" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>' );
			if( totalSlideImgs > 0 ){
				if( settings.lazyLoad ){
					loader.appendTo( currentSlide );
				}else{
					if( !$( slider ).find( '.tm-loader' ).length ) loader.appendTo( slider );
				}
			}

			// If there is a video in the slide
			// add events so it can be controlled
			if( video ) {

				// Fall back on image
				if( mobile && currentSlide.is( '[data-video-bkg]' ) ) {
					currentSlide.children( 'video' ).css({ display: 'none' });
				}
				var videoEl = currentSlide.find( 'iframe, video' );
				addVideoEvents( slider, videoEl, settings, obj );
				redimensionSlider( currentSlide, settings );
				positionCarousel( slider, settings );
			}
			
			// If there are no images in the slide
			// fire loaded
			if( !totalSlideImgs ){
				totalSlides++;
				positionCarousel( slider, settings );
				loaded( currentSlide, totalSlides, settings, obj );
			}else{
				
				// Preload each image in 
				// each slide
				currentSlide
					.find( 'img' )
					.each( function( i, src ){
						
						// Check if retina
						src = $( this ).attr( 'srcset' ) && !$( 'body' ).hasClass( 'ie-browser' ) ? $( this ).prop( 'currentSrc' ) : $( this ).data( 'src' ) ? $( this ).data( 'src' ) : $( this ).attr( 'src' );
						if( !$( this ).attr( 'srcset' ) ){
							var originalImg = src;
							var imgExt = src.substr( ( src.lastIndexOf( '.' ) ) );
							if( window.isRetinaDevice() && settings.retinaSupport || window.isRetinaDevice() && $( this ).is( '[data-retina]' ) ){
								if( !mobile && !settings.retinaSupportMobile || mobile && settings.retinaSupportMobile ){
									if( !src.match( /\.(svg)/i ) ){
										if( !$( this ).data( 'retina' ) ) src = src.replace( imgExt, settings.retinaSuffix + imgExt );
										else src = $( this ).data( 'retina' );
									}
								}
							}
						}

						// Overaly
						if( currentSlide.data( 'overlay-bkg-color' ) && !currentSlide.find( '.tms-overlay').length ){
							var bkg = currentSlide.data( 'overlay-bkg-color' ).replace( '#','' );
							var opacity = currentSlide.data( 'overlay-bkg-opacity' ) ? currentSlide.data( 'overlay-bkg-opacity' ) : 0.5;

							// Convert hex to rgba
							var r = parseInt( bkg.substring( 0,2 ), 16 );
							var g = parseInt( bkg.substring( 2,4 ), 16 );
							var b = parseInt( bkg.substring( 4,6 ), 16 );
							var rgba = 'rgba( '+ r +','+ g +','+ b +','+ opacity / 1 +' )';

							// Set color
							var slideOverlayWrapper = currentSlide.data( 'image-wrapper' ) ? currentSlide.find( '.' + currentSlide.data( 'image-wrapper' ) ) : currentSlide;
							var overlay = $( '<div class="tms-overlay" />' ).css({ backgroundColor: rgba, opacity: 0 }).appendTo( slideOverlayWrapper );
						}

						$( this )
							.css({ opacity: 0 })
							.attr( 'src', src )
							.one( 'error', function(){
								$( this ).attr( 'src', originalImg );
								console.log( 'Error src:' + src );
							})
							.one( 'load', function(){
								currentSlide.css({ transition: 'none', opacity: 0 });
								if( !video ) currentSlide.addClass( 'img-loaded' );
								$( this ).data( 'loaded', true ).css({ opacity: 1 });
								i++;
								if( i === totalSlideImgs ){
									totalSlides++;
									loaded( currentSlide, totalSlides, settings, obj );
								} 
							});
					});
			}
		});
	}

	/**
	*	Slide Loaded
	*	@param slide (required for lazyload only) object;
	*		Loaded slide object that 
	*		needs handling
	*	@param totaSlides (required) integer;
	*		Flag used to check slides loaded vs 
	*		number of slides to load
	*	@param settings (required for lazyload only) array;
	*	@param obj (required for lazyload only) object;
	*		Ref to DOM element for
	*		accessing public methods
	*/

	function loaded( slide, totalSlides, settings, obj ){
		var slider = slide.closest( '.tm-slider-container' );
		var slides = slider.find( '.tms-slides' );
		var active = slider.find( 'li.active' );
		var animateCaptionTimer = null;
		var animateActiveTimer = null;
		var isBkgVideoSlide = slide.is( '[data-video-bkg-youtube]' ) || slide.is( '[data-video-bkg-vimeo]' ) ? true : false;
		slide.find( '.no-transition' ).css({ 'visibility' : 'visible' });

		// Setup done, slider active
		slider.data( 'setup', true );
		slider.data( 'first-load', false );
		slider.data( 'animate-first-slide', true );

		// Check bkg image
		if( slide.is( '[data-as-bkg-image]' ) || slide.is( '[data-video-bkg]' ) || isBkgVideoSlide ){
			var slideURL =  slide.children( 'img' ).attr( 'srcset' ) && !$( 'body' ).hasClass( 'ie-browser' ) ? slide.children( 'img' ).prop( 'currentSrc' ) : slide.children( 'img' ).attr( 'src' );
				slideURL = typeof slideURL != 'undefined' ? slideURL : slide.children( 'img' ).attr( 'src' );
			var slideImgWrapper = slide.data( 'image-wrapper' ) ? slide.data( 'image-wrapper' ) : slide;
			if( slide.data( 'image-wrapper' ) ){
				slide.find( '.' + slideImgWrapper ).css({ 'background-image': 'url(' + slideURL + ')' });
			}else{
				slide.css({ 'background-image': 'url(' + slideURL + ')' });
			}
			slide.children( 'img' ).hide();
		}

		// Verify slider has a height
		if( slider.height() === 0 && !slider.data( 'height' ) && slide.hasClass( 'active' ) ){

			// Reference the first slider image for a height
			active.children( 'img' ).css({ maxHeight: 'none' });
			var refH = active.children( 'img' ).height();

			// Set it
			slider.data( 'refH', refH );
			slider.css({ height: refH + 'px' });
			active.children( 'img' ).css({ maxHeight: '100%' });
		}

		// Redimension slider
		redimensionSlider( slide, settings );
		positionCarousel( slider, settings );

		// Initial opacity
		if( settings.carousel && !settings.lazyLoad ) {
			slides.children().css({ opacity: 1 });
			slides.css({ opacity: 0 });
		}

		// Make videos visible
		if( !isBkgVideoSlide ) slide.find( 'iframe, video' ).css({ opacity: 1 });

		// Load end callback
		if( totalSlides === slides.children().length ){
			if( settings.onLoadEnd ) settings.onLoadEnd();
		}

		// Check loading options
		if( !settings.lazyLoad && totalSlides === slides.children().length ){
			slider.data( 'loaded', true );
			if( settings.autoAdvance ) obj.initSlideshow();
		}else if ( settings.lazyLoad && totalSlides === 1 ){
			slider.data( 'loaded', true );
			if( settings.autoAdvance ) obj.initSlideshow();
		}
		if( !settings.lazyLoad ) {

			if( totalSlides === slides.children().length ){

				// Delete loader
				if( slider.find( '.tm-loader' ).length && !isBkgVideoSlide || mobile ) removeLoader( slider, slide, settings );

				// Show captions of active
				active.find( '.tms-caption' ).show();

				// If visible slides is greater than 1 show all
				if( settings.carouselVisible > 1 ) slider.find( '.tms-caption' ).show();

				// Animate slides 
				// or slides
				if( tSupport ){
					if( !settings.carousel ) {
						animate( active, 1, 0, 0, 0, 0, 0, 0, 1, '50%', '50%', 1000, 0, 'easeIn', settings );
					}else{
						animate( slides, 1, 0, 0, 0, 0, 0, 0, 1, '50%', '50%', 1000, 0, 'easeIn', settings );
					}
				}else{
					if( !settings.carousel ) {
						active.animate({ opacity: 1 });
					}else{
						slides.animate({ opacity: 1 });
					}
				}

				// Animate captions in active slide
				if( !isBkgVideoSlide || mobile ){
					clearTimeout( animateCaptionTimer );
					animateCaptionTimer = setTimeout( function(){
						if( active.find( '.tms-caption' ).length > 0 ) animateCaption( active, settings );
						if( active.find( '.tms-content-scalable' ).length > 0 ) $( '.tms-content-scalable' ).css({ opacity: 1 });
					}, 300 );
				}

				// Show nav
				slider.find( '.tms-arrow-nav, .tms-pagination' ).css({ display: 'block' });
			}
		}else{
			
			// Delete loader
			if( slide.find( '.tm-loader' ).length && !isBkgVideoSlide || mobile ) removeLoader( slider, slide, settings );

			// Show captions if active or visible slides
			// is greater than 1
			if( slide.is( active ) || settings.carouselVisible > 1 ) slide.find( '.tms-caption' ).show();

			if( !slide.hasClass( 'active' ) ) return false;

			// Animate slide
			if( tSupport ){
				clearTimeout( animateActiveTimer );
				animateActiveTimer = setTimeout( function(){
					animate( active, 1, 0, 0, 0, 0, 0, 0, 1, '50%', '50%', 1000, 0, 'easeIn', settings );
				}, 50 );
			}else{
				slide.animate({ opacity: 1 });
			}

			// Animate captions in active slide
			if( !isBkgVideoSlide || mobile ){
				clearTimeout( animateCaptionTimer );
				animateCaptionTimer = setTimeout( function(){
					if( active.find( '.tms-caption' ).length > 0 ) animateCaption( active, settings );
					if( active.find( '.tms-content-scalable' ).length > 0 ) $( '.tms-content-scalable' ).css({ opacity: 1 });
				}, 300 );
			}
		}
	}

	/**
	*	Loader Removal
	*	@param slider (required) object;
	*	@param slide (required) object;
	*	@param settings (required) array;
	*/
	function removeLoader( slider, slide, settings ){
		var loader = '.tm-loader';
		if( settings.lazyLoad ) slide.find( loader ).remove();
		else slider.find( loader ).remove();
	}

	/**
	*	Parallax Handling
	*	@param slider (required) object;
	*	@param settings (required) array;
	*/
	var requestScroll = function( slider, settings ){
		var win = $( window );
		if ( !win.data( 'animating' ) ) {
			win.data( 'animating', true );
			window.requestAnimationFrame( function () {
				updateSliderElement( slider, settings );
				win.data( 'animating', false );
			});
		}
	};
	var updateSliderElement = function( slider, settings ){
		var win = $( window );
		var winTop = win.scrollTop();
		var winH = win.height();
		var distanceRemaining = ( slider.parent().height() + slider.parent().offset().top ) - winTop;
		var distance = winTop * settings.parallaxSpeed;
		var scale = settings.parallaxScale && slider.is( '[data-parallax-scale-in]' ) ? ( 0.75 * ( 1 + 1 - ( distanceRemaining / slider.parent().height() ) ) ) : 1;
		scale = scale < 1 ? 1 : scale;
		var opacity = settings.parallaxFadeOut ? distanceRemaining / slider.parent().height() : 1;
		var active = slider.find( 'li.active' );
		var captionColumn = active.find( '.tms-content-inner > .row > .column' );
		if( !mobile && tSupport && isElementVisible( slider.parent() ) ){
			if( slider.is( '[data-parallax]' ) ){
				slider.css({ position: 'fixed', transform: 'translate3d( 0, ' + -distance + 'px' + ', 0)' }).removeClass( 'out-of-view' );
				captionColumn.css({ opacity: opacity.toFixed(2) });
				captionColumn.css({ transform: 'scale3d( ' + scale + ',' + scale + ', 1 )' });
			}
		}else{
			if( slider.is( '[data-parallax]' ) ) slider.css({ position: 'relative' }).addClass( 'out-of-view' );
		}
	};

	/**
	*	Check Visibility of Element in Viewport
	*	@param element (required) object;
	*/
	var isElementVisible = function( element ){
		var winTop = $( window ).scrollTop();
		var winBottom = winTop + $( window ).height();
		var elTop = element.offset().top;
		var elBottom = elTop + element.outerHeight();
		return ( winBottom >= elTop && winTop <= elBottom );
	};

	/**
	*	Animation Handling
	*	@param selector (required) object;
	*	@param opacity - delay (required) integer;
	*	@param easing (required) string;
	*	@param settings (required) array;
	*/

	var animate = function( selector, opacity, transX, transY, transZ, rotateX, rotateY, rotateZ, scale, transOrigX, transOrigY, duration, delay, easing, settings ){
		
		// Get reference to slider
		var slider = selector.closest( '.tm-slider-container' );

		if( selector.hasClass( 'active' ) || selector.hasClass( 'target' ) || selector.hasClass( 'tms-slides' ) ){

			// Slider is now animating
			if( !slider.data( 'animate-first-slide' ) ) slider.data( 'transitioning' , true );
			
			// Slider before callback
			if( settings.onSlideBefore ) settings.onSlideBefore();
		}  

		// Animation magic
		var attrs = {};
		attrs.transform =   'translate3d(' + transX + 'px' + ', ' + transY + 'px' + ', ' + transZ + 'px' + ') ' +
							'rotateX(' + rotateX + 'deg) ' +
							'rotateY(' + rotateY + 'deg) ' +
							'rotateZ(' + rotateZ + 'deg) ' +
							'scale3d(' + scale + ', ' + scale + ', ' + scale + ')';
		attrs.transitionProperty = transform + ', opacity';
		attrs.transformOrigin = transOrigX + ' ' + transOrigY + ' 0';
		attrs.transitionDuration = duration + 'ms';
		attrs.transitionDelay = delay + 'ms';
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
					
					// Only call animation complete if currently animation
					// object is either target slide or slide wrapper for carousel
					if( $( this ).hasClass( 'target' ) || $( this ).hasClass( 'tms-slides' ) && !slider.data( 'animate-first-slide' ) ) {
						animateComplete( slider, settings );
					}

					// Clear transition on captions in the event that other 
					// transition properties are animated through classes
					if( $( this ).hasClass( 'tms-caption' ) ){
						$( this ).css({ transition: '' });
					}

					// Animate first caption
					if( slider.data( 'animate-first-slide' ) ){
						slider.data( 'animate-first-slide', false );
					}
				});
	};
	var animateComplete = function ( slider, settings ){

		// Slider animation done
		slider.data( 'transitioning' , false );

		// Get references to active and
		// target slide
		var active = slider.find( 'li.active' );
		var target = slider.find( 'li.target' );

		// Check if slide is a YouTube or Vimeo bkg video slide
		var isBkgVideoSlide = target.is( '[data-video-bkg-youtube]' ) || target.is( '[data-video-bkg-vimeo]' ) ? true : false;

		// Pause video of active slide
		media( active, 'pause', settings );

		// Update active slide reference
		if( settings.carouselVisible === 1 ) active.find( '.tms-caption' ).not( '.no-transition' ).css({ display: 'none', visibility: 'hidden' });
		if( !settings.carousel ) active.css({ visibility: 'hidden' });
		active.removeClass( 'active' );
		target.removeClass( 'target' ).addClass( 'active' );
		active = target;

		// Slider after callback
		if( settings.onSlideAfter ) settings.onSlideAfter();

		// Play video of new active slide
		media( active, 'play', settings );

		// Prevent captions from being animated if carousel visible
		// slides is great that 1
		if( settings.carouselVisible > 1 ) return false;

		// Animate caption
		if( !isBkgVideoSlide || mobile ) animateCaption( active, settings );

	};
	var animateCaption = function( active, settings ){

		// Iterate over captions in active 
		// slide and reset attributes to original and 
		// call animate
		active
			.find( '.tms-caption' )
			.not( '.no-transition' )
			.show()
			.each( function(){
				var caption = $( this );
				var tox = $( this ).data( 'ox' ) ? caption.data( 'ox' ) : '50%';
				var toy = $( this ).data( 'oy' ) ? caption.data( 'oy' ) : '50%';
				var duration = $( this ).data( 'du' ) ? caption.data( 'du' ) : settings.speed;
				var delay = $( this ).data( 'de' ) ? caption.data( 'de' ) : 0;
				var easing = $( this ).data( 'e' ) ? easingArray[ caption.data( 'e' ) ] : easingArray[ settings.easing ];
				var animateCaptionTimer = null;
				if( tSupport ){
					clearTimeout( animateCaptionTimer );
					animateCaptionTimer = setTimeout( function(){
						animate( caption, 1, 0, 0, 0, 0, 0, 0, 1, tox, toy, duration, delay, easing );
					}, 500 );
				}else{
					easing = settings.easingFallback;
					caption.delay( delay ).css({ visibility: 'visible' }).animate({ opacity: 1 }, duration, easing );
				}
			});
	};

	/**
	*	Pagination Handling
	*	@param slider (required) object;
	*	@param index (required) integer;
	*/
		
	var updatePagination = function( slider, index ){
		var pagination = slider.find( '.tms-pagination' );
		pagination.find( '.active' ).removeClass( 'active' );
		pagination.find( '#tms-pagination-' + index ).addClass( 'active' );
	};

	/**
	*	Carousel BreakPoints
	*	@param slider (required) object;
	*	@param settings (required) array;
	*/

	var carouselBreakPoints = function( slider, settings ){
		var visibleSlides;
		if( $( window ).width() >= 1024 && $( window ).width() <= 1140 && settings.carouselVisible >= 4 ){
			visibleSlides = slider.data( 'carousel-1140' ) ? slider.data( 'carousel-1140' ) : 4;
		}else if( $( window ).width() >= 768 && $( window ).width() <= 1023 && settings.carouselVisible >= 3 ){
			visibleSlides = slider.data( 'carousel-1024' ) ? slider.data( 'carousel-1024' ) : 3;
		}else if( $( window ).width() >= 480 && $( window ).width() <= 767 && settings.carouselVisible >= 2 ){
			visibleSlides = slider.data( 'carousel-768' ) ? slider.data( 'carousel-768' ) : 2;
		}else if( $( window ).width() <= 479 ){
			visibleSlides = slider.data( 'carousel-480' ) ? slider.data( 'carousel-480' ) : 1;
		}else{
			visibleSlides = settings.carouselVisible;
		}
		return visibleSlides;
	};

	/**
	*	Carousel Positioning
	*	@param slider (required) object;
	*	@param settings (required) array;
	*/

	var positionCarousel = function( slider, settings, target ){
		if( !settings.carousel ) return false;
		var i;
		var indexUpdate;
		var slides = slider.find( '.tms-slides' );
		var active = slider.find( 'li.active' );
		var actIndex = active.index();
		var pagination = slider.find( '.tms-pagination' );
		var totalSlides = slides.children().length;
		var visibleSlides = carouselBreakPoints( slider, settings );
		var width = slider.width() / visibleSlides;
		var tallestSlide = 0;
		var animateCarouselTimer = null;
		
		// Recalculate slide container
		// width based on breakpoints
		slides
			.children().each( function( i ){
				settings.carouselVisible = settings.carouselVisible === 0 ? 1 : settings.carouselVisible;
				$( this ).css({ width: width + 'px', opacity: 1, visibility: 'visible'  });

				// Get tallest slide for later use
				tallestSlide = tallestSlide > $( this ).outerHeight() ? tallestSlide : $( this ).outerHeight();
		});

		// Two slides visible
		if( visibleSlides === 2 && actIndex > slides.children().length - 2 ){
			i = slides.children().length - 1;
			indexUpdate = true;

		// Three slides visible
		}else if( visibleSlides === 3 && actIndex > slides.children().length - 3 ){
			i = slides.children().length - 2;
			indexUpdate = true;

		// Original number of 
		// slides visible
		}else if( actIndex > slides.children().length - visibleSlides ){
			i = slides.children().length - visibleSlides + 1; 
			indexUpdate = true;

		// None of the above
		// use current index
		}else{
			i = actIndex;
			indexUpdate = false;
		}

		// Update pagination
		pagination.children().hide().slice( 0, slides.children().length - visibleSlides + 1 ).show();

		// Swap active slide
		// and active bullet nav
		if( indexUpdate ){
			active.removeClass( 'active' );
			slides.find( 'li:nth-child(' + i + ')' ).addClass( 'active' );
			updatePagination( slider, i );
		}

		// Reposition
		if( tSupport ){
			if( !slider.data( 'transitioning') ) slides.css({ width: width * totalSlides + 'px', transition: 'none', transform: 'translate3d(' +  -( width * i ) + 'px' + ', 0, 0)' });
			clearTimeout( animateCarouselTimer );
			animateCarouselTimer = setTimeout( function(){
				slides.css({ transitionProperty: 'opacity, ' + transform, transitionDuration: settings.speed + 'ms' });
			}, 50 );
		}else{
			slides.css({ width: width * totalSlides + 'px', left: -( width * i ) + 'px' });
		}
	};

	/**
	*	Resize Slider
	*	@param slide (required) object;
	*		Slide object to be resized
	*	@param settings (required) array;
	*/

	var redimensionSlider = function( slide, settings ){

		// Slider size references
		var slider = slide.closest( '.tm-slider-container, .featured-media' );
		var parentW = slider.parent().width();
		var fullscreenH = !settings.fsUseHeightOf ? $( window ).height() : settings.fsUseHeightOf.height();
		var refW = slider.data( 'refW' );
		var refH = slider.data( 'refH' );
		var sliderR = settings.fullscreen ? $( window ).width() / fullscreenH : refW / refH;
		var extPadding = slider.data( 'external-padding' ) ? slider.data( 'external-padding' ) : settings.externalPadding;
			extPadding = $.isNumeric( extPadding ) ? extPadding : parseFloat( $( extPadding ).css( 'paddingLeft' ) ) * 2;
		var newSliderW = settings.fullscreen || settings.fullwidth ? $( window ).width() - extPadding : parentW;
		var newSliderH = settings.fullscreen ? fullscreenH - extPadding : settings.carousel && settings.carouselVisible > 1 && !settings.adaptiveHeight ? refH : settings.fullwidth && parentW / sliderR > refH ? refH - extPadding : ( parentW / sliderR ) - extPadding;
		var minHReached = newSliderH <= settings.scaleMinHeight ? true : false;
		var newSliderR = !minHReached ? newSliderW / newSliderH : newSliderW / settings.scaleMinHeight;
		var adaptiveHeight = settings.adaptiveHeight && settings.carouselVisible === 1 ? true : false;
		var forceFit = settings.forceFit || slide.hasClass( 'tms-forcefit' );

		// Set new slider with and height
		// to be used for captions
		slider.data( 'newSW', newSliderW );
		slider.data( 'newSH', newSliderH );
		
		// Size wrapper
		if( settings.carousel || settings.adaptiveHeight ){
			var scaleHeightTimer = null;
			clearTimeout( scaleHeightTimer );
			slider.css({ width: Math.round( newSliderW ) + 'px' });
			scaleHeightTimer = setTimeout( function(){
				slider.css({
					height: slider.data( 'scale-first' ) && adaptiveHeight ? slider.find( 'li:first-child' ).find( '.tms-content-scalable, img' ).outerHeight() + 'px' : !slider.data( 'scale-first' ) && adaptiveHeight ? slide.find( '.tms-content-scalable, img' ).outerHeight() : 'auto'
				});
			}, 100 );
		}else{
			slider.css({
				width: Math.round( newSliderW ) + 'px',
				height: newSliderH > settings.scaleMinHeight || settings.scaleMinHeight === 'auto' ? Math.round( newSliderH ) + 'px' : settings.scaleMinHeight + 'px'
			});
			if( settings.parallax ) slider.parent().css({ height: slider.height() + 'px' });
			newSliderH = newSliderH > settings.scaleMinHeight || settings.scaleMinHeight === 'auto' ? newSliderH : settings.scaleMinHeight;
			slider.data( 'newSH', newSliderH );
		}

		// Check that setup is done
		if( !slider.data( 'setup' ) || settings.carousel && settings.carouselVisible > 1 ) return false;

		// Check slide type
		var type = slide.is( '[data-image]' ) ? 'image' : 'video';

		// Check whether video is background video
		var bkgVideo = slide.is( '[data-video-bkg]' ) || slide.is( '[data-video-bkg-youtube]' )  || slide.is( '[data-video-bkg-vimeo]' ) ? true : false;

		// Check if a ratio is set for regular video
		var videoRatio =  slide.is( '[data-video-ratio]' ) ? parseFloat( slide.data( 'video-ratio' ) ) : 1.778;

		// Size slide image or video
		slide
			.find( 'img, iframe, video, .mejs-container' )
			.not( '.tms-caption img, .tms-caption iframe, .tms-caption video' )
			.each( function(){
				var mediaW;
				var mediaH;
				var mediaR;

				// Adjust w/h for bkg videos
				var bkgVideoPadding = 50;
				var adjustedSliderH = newSliderH + bkgVideoPadding;
				var adjustedSliderW = newSliderW + bkgVideoPadding;

				// Width & height references
				if( type === 'image' ){
					mediaW = $( this ).width();
					mediaH = $( this ).height();
				}else if( type === 'video' ){
					// Check if ratio should be respected
					if( !settings.respectRatio && !bkgVideo || settings.fullscreen && !bkgVideo ) slide.addClass( 'tms-video-no-ratio' );
					if( bkgVideo ){
						mediaW = !settings.fullscreen || !settings.fullwidth ? newSliderW :  adjustedSliderH * videoRatio;
						mediaH = !settings.fullscreen || !settings.fullwidth ? newSliderW / videoRatio : adjustedSliderH;
					}else{
						// Check if w/h set for regular video
						mediaW = !$( this ).attr( 'width' ) ? newSliderW : newSliderW > $( this ).attr( 'width' ) ? $( this ).attr( 'width' ) : newSliderW;
						mediaH = !forceFit ? mediaW / videoRatio : mediaW / videoRatio;
					}
				}
				mediaR = mediaW / mediaH;
						
				// Calculate size if slider is set to fullscreen, 
				// If slide has attribute forcefit
				// Or if slide has background video
				if(  type === 'image' && settings.fullscreen || forceFit || type === 'video' && bkgVideo ){
					if( $( this ).is( 'img' ) && !$( this ).data( 'loaded' ) ) return false;
					if ( newSliderR > mediaR ) {
						$( this ).css({
							width: !bkgVideo ? settings.fullwidth && !forceFit ? 'auto' : newSliderW + 'px' : adjustedSliderW + 'px',
							height: !bkgVideo ? Math.round( newSliderW / mediaR ) + 'px' : Math.round( adjustedSliderW / mediaR ) + 'px',
							top: !bkgVideo ? Math.round( -( ( ( newSliderW / mediaR ) - newSliderH ) / 2 ) ) + 'px' : Math.floor( ( newSliderH - mediaH ) / 2 ) + 'px',
							left: !bkgVideo ? 0 : -( bkgVideoPadding / 2 ) + 'px'
						});
					} else {
						$( this ).css({
							width: settings.fullwidth && !forceFit && !bkgVideo ? 'auto' : Math.round( newSliderH * mediaR ) + 'px',
							height: newSliderH + 'px',
							top: 0,
							left: Math.round( -( ( ( newSliderH * mediaR ) - newSliderW ) / 2 ) ) + 'px'
						});
					}

				// Calculate size if regular video	
				} else if ( type === 'video' ){
					$( this ).css({
						width: Math.floor( mediaW ) + 'px',
						height: Math.floor( mediaH ) + 'px',
						top: Math.floor( ( newSliderH - mediaH ) / 2 ) + 'px',
						left: Math.floor( ( newSliderW - mediaW ) / 2 ) + 'px'
					});
				}
			});
		redimensionCaptions( slide, settings );
	}; 

	/**
	*	Resize Captions
	*	@param slide (required) object;
	*		Slide object whose caption will
	*		be resized 
	*	@param settings (required) array;
	*/

	var redimensionCaptions = function( slide, settings ){
		
		var slider = slide.closest( '.tm-slider-container' );
		var newSliderW = slider.data( 'newSW' );
		var newSliderH = slider.data( 'newSH' );
		var refW = slider.data( 'refW' );
		var refH = slider.data( 'refH' );

		if( !settings.captionScaling || settings.carouselVisible > 1 ) return false;

		slide.find( '.tms-caption' ).each( function(){
			
			if( !$( this ).is( '[data-no-scale]' ) ){

				// Get references
				var caption = $( this );

				// Position values
				var l = caption.data( 'x' );
				var t = caption.data( 'y' );

				// Pixel values
				var w = caption.data( 'w' );  
				var pt = caption.data( 'pt' );
				var pr = caption.data( 'pr' );
				var pb = caption.data( 'pb' );
				var pl = caption.data( 'pl' );
				var mt = caption.data( 'mt' );
				var mr = caption.data( 'mr' );
				var mb = caption.data( 'mb' );
				var ml = caption.data( 'ml' );
				var bt = caption.data( 'bt' );
				var br = caption.data( 'br' );
				var bb = caption.data( 'bb' );
				var bl = caption.data( 'bl' );
				var fs = caption.data( 'fs' ); 
				var lh = caption.data( 'lh' ) === 0 ? fs : caption.data( 'lh' );
				var rxof = caption.is( '[data-offsetx]' ) ? parseFloat( caption.data( 'offsetx' ) ) : 0;
				var ryof = caption.is( '[data-offsety]' ) ? parseFloat( caption.data( 'offsety' ) ) : 0;

				// Calculate new offsets
				var xof = newSliderW * ( rxof / refW ) < 0 ? newSliderW * ( rxof / refW ) : newSliderW * ( rxof / refW ) > rxof ? rxof : newSliderW * ( rxof / refW );
				var yof = newSliderH * ( ryof / refH ) < 0 ? newSliderW * ( ryof / refW ) : newSliderW * ( ryof / refW ) > ryof ? ryof : newSliderH * ( ryof / refH );

				// Adjust y offset if fullwidth is in use as a fixed
				// height might be set
				if( settings.fullwidth && yof < ryof && yof < 0 ) yof = ryof;

				// Calculate caption width if iframe exists
				var mediaW;
				if( caption.find( 'img, iframe, video' ).length ){
					mediaW = newSliderW * ( w / refW ) > w ? w : newSliderW * ( w / refW ) > newSliderW ? newSliderW : newSliderW * (w / refW );
				}

				// Calculate sizes
				// Checked against original values 
				// to prevent scaling up
				if( !caption.find( 'img' ).length && !caption.find( 'iframe, video' ).length ){

					caption.css({
									
						// Update Font
						fontSize: newSliderW * ( fs / refW ) > fs ? fs : newSliderW * ( fs / refW ) + 'px',
						lineHeight: newSliderW * ( lh / refW ) > lh ? lh + 'px' : newSliderW * ( lh / refW ) + 'px',
								
						// Update Padding
						paddingTop: newSliderW * ( pt / refW ) > pt ? pt : newSliderW * ( pt / refW ) + 'px' ,
						paddingRight: newSliderW * ( pr / refW ) > pr ? pr : newSliderW * ( pr / refW ) + 'px' , 
						paddingBottom: newSliderW * ( pb / refW ) > pb ? pb : newSliderW * ( pb / refW ) + 'px' , 
						paddingLeft: newSliderW * ( pl / refW ) > pl ? pl : newSliderW * ( pl / refW ) + 'px' , 

						// Update Margin
						marginTop: newSliderW * ( mt / refW ) > mt ? mt : newSliderW * ( mt / refW ) + 'px' , 
						marginRight: newSliderW * ( mr / refW ) > mr ? mr : newSliderW * ( mr / refW ) + 'px' , 
						marginBottom: newSliderW * ( mb / refW ) > mb ? mb : newSliderW * ( mb / refW ) + 'px' , 
						marginLeft: newSliderW * ( ml / refW ) > ml ? ml : newSliderW * ( ml / refW ) + 'px' ,

						// Update border
						borderTopWidth: newSliderW * ( bt / refW ) > bt ? bt : Math.ceil( newSliderW * ( bt / refW ) ) + 'px' , 
						borderRightWidth: newSliderW * ( br / refW ) > br ? br : Math.ceil( newSliderW * ( br / refW ) ) + 'px' , 
						borderBottomWidth: newSliderW * ( bb / refW ) > bb ? bb : Math.ceil( newSliderW * ( bb / refW ) ) + 'px' , 
						borderLeftWidth: newSliderW * ( bl / refW ) > bl ? bl : Math.ceil( newSliderW * ( bl / refW ) ) + 'px' ,

						whiteSpace: 'nowrap'
					});
				}else{
					caption.css({

						// Update width only 
						// for images & videos
						width: mediaW + 'px', 
						height: caption.children( 'iframe, video' ).length ? mediaW / 1.778 + 'px' : 'auto'
					});
				}

				// Position
				caption.css({
					top: t === 'top' ? 0 + yof : t === 'bottom' ? newSliderH - caption.outerHeight() - yof : ( ( newSliderH - caption.outerHeight() ) / 2 ) + yof + 'px', 
					left: l === 'left' ? 0 + xof : l === 'right' ? newSliderW - caption.outerWidth() - xof : ( ( newSliderW - caption.outerWidth() ) / 2 ) + xof + 'px'
				});
			}
		});
	};

	/**
	*	Target Slide Caption Positions
	*	@param slide (required) object;
	*		Slide object whose captions
	*		need to be positioned for transition
	*	@param settings (required) array;
	*/

	var positionNextCaption = function( slide, settings ){
			
		// Check slides visible
		if( settings.carouselVisible > 1 ) return false;
		slide.find( '.tms-caption' ).not( '.no-transition' ).each( function(){
			var caption = $( this );
			var o = caption.data( 'o' ) ? parseFloat( caption.data( 'o' ) ) : 0; 
			var tx = caption.data( 'tx' ) ? parseFloat( caption.data( 'tx' ) ) : 0;
			var ty = caption.data( 'ty' ) ? parseFloat( caption.data( 'ty' ) ) : 0; 
			var tz = caption.data( 'tz' ) ? parseFloat( caption.data( 'tz' ) ) : 0; 
			var rx = caption.data( 'rx' ) ? parseFloat( caption.data( 'rx' ) ) : 0; 
			var ry = caption.data( 'ry' ) ? parseFloat( caption.data( 'ry' ) ) : 0; 
			var rz = caption.data( 'rz' ) ? parseFloat( caption.data( 'rz' ) ) : 0;
			var s = caption.data( 's' ) ? parseFloat( caption.data( 's' ) ) : 1;
			if( tSupport ) {
				caption.css({
						transition: 'none',
						transform : 'translate3d(' + tx + 'px' + ', ' + ty + 'px' + ', ' + tz + 'px' + ' )' +
									'rotateX(' + rx + 'deg) ' +
									'rotateY(' + ry + 'deg) ' +
									'rotateZ(' + rz + 'deg) ' +
									'scale3d(' + s + ', ' + s + ', ' + s + ')',
						opacity: o
				});
			}else{
				caption.css({ opacity: 0 });
			}
		});
	};

	/**
	*	Video handling
	*	@param slide (required) object;
	*	@param status (required) string;
	*		String indicating if video 
	*		should play or pause
	*	@param settings (required) array;
	*/
	
	var media = function( slide, status, settings ){

		if( !settings.useVideoAPI || settings.carouselVisible > 1 ) return false;
			
		var player;

		try{
			if( slide.find( 'iframe' ).length ){	

				// Reference
				player = '#' + slide.find( 'iframe' ).attr( 'id' );
				var url = $( player ).attr( 'src' );

				// Vimeo
				if( typeof url != 'undefined' && url.indexOf( 'vimeo' ) > -1 ){

					// Target player vimeo
					player = $f( $( player )[0] );
					if( status === 'play' && settings.autoPlay ){
						player.api( 'play' );
						slide.addClass( 'video-playing' );
					}else{
						player.api( 'pause' );
						slide.removeClass( 'video-playing' );
					}

				// YouTube
				}else if( typeof url != 'undefined' && url.indexOf( 'youtu' ) > -1 ){

					// Target player youtube
					player = player.replace( '#', '' );
					if( status === 'play' && settings.autoPlay ){
						ytPlayer[ player ].playVideo();
						slide.addClass( 'video-playing' );
					}else{
						ytPlayer[ player ].stopVideo();
						slide.removeClass( 'video-playing' );
					}
				}

			// Html5 Video
			}else if( slide.find( 'video' ).length ){

				// Target video element
				player = '#' + slide.find( 'video' ).attr( 'id' );
				if( status === 'play' && settings.autoPlay ){
					$( player )[0].play();
					slide.addClass( 'video-playing' );
				}else{
					$( player )[0].pause();
					slide.removeClass( 'video-playing' );
				}
			}
		} catch( e ){}
	};

	/**
	*	Add API, Video Events
	*	@param video (required) object;
	*	@param settings (required) array;
	*/
	
	// YouTube array
	var ytPlayer = {};

	// Flags for whether 
	// scripts have been added to page
	var vimeo = false;
	var youtube = false;

	var addVideoEvents = function ( slider, video, settings, obj ){

		if( !settings.useVideoAPI || settings.carouselVisible > 1 ) return false;

		var slide = video.closest( 'li' );
		var url = video.attr( 'src' );
		var protocol = location.protocol === 'https:' ? 'https:' : 'http:';
		var currentDate = new Date();

		// Create unique id
		video.attr( 'id', 'video-' + currentDate.getTime() );

		// Vimeo
		if( typeof url != 'undefined' && url.indexOf( 'vimeo' ) > -1 ){

			// Add id to end of url
			video.attr( 'src', video.attr( 'src' ) + '&amp;player_id=' + video.attr( 'id' ) ).addClass( 'vimeo' );
			if( slide.is( '[data-video-bkg-vimeo]' ) ) video.attr( 'src', video.attr( 'src' ) + '&amp;autoplay=0&amp;title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;background=1' ).addClass( 'vimeo' );

			// Add script once
			if ( !vimeo ){
				vimeo = true;
				var v = document.createElement( 'script' );
				v.src = protocol + '//f.vimeocdn.com/js/froogaloop2.min.js';
				var fsTag = document.getElementsByTagName( 'script' )[0];
				fsTag.parentNode.insertBefore( v, fsTag );
			}
				
			// Ensure iframe is ready to receive events
			video.on( 'load', function(){
				var iframe = $( this );
				var id = '#' + iframe.attr( 'id' );
				var vp = $f( $( id )[0] );
				var slide = iframe.closest( 'li' );
				var firstSlide = slide.is( ':first-child' ) ? true : false;

				// Add listeners
				vp.addEvent( 'ready', function() {

					// Play if first
					if ( firstSlide && settings.autoPlay ){ 
						vp.api( 'play' );
						slide.addClass( 'video-playing' );
					}

					// Check mute setting, unmute in case background video is used
					vp.api( 'setVolume', 1 ); 
					if( settings.muteBkgVideo || slide.is( '[data-mute-video]' ) ) vp.api( 'setVolume', 0 );

					// Playing
					vp.addEvent( 'playProgress' , function( event ){
						removeLoader( slider, slide, settings );
						slide.addClass( 'video-bkg-loaded' );
						animateCaption( slide, settings );
					});

					// Replay or move to next
					vp.addEvent( 'finish', function(){
						if( settings.replayOnEnd ) vp.api( 'play' );
						if( settings.nextSlideOnEnd ) obj.nextSlide();
					});
				});
			});

		// YouTube	
		} else if ( typeof url != 'undefined' && url.indexOf( 'youtu' ) > -1 ){

			// Add class
			video.addClass( 'youtube' );

			// Add parameters for bkg video to end of url
			if( slide.is( '[data-video-bkg-youtube]' ) ) video.attr( 'src', video.attr( 'src' ) + '&amp;controls=0&amp;showinfo=0&amp;rel=0&amp;modestbranding=0&amp;loop=1&amp;iv_load_policy=3&amp;playlist=' + video.attr( 'src' ).split( 'embed/' )[1].substring( 0, 11 ) ).addClass( 'youtube' );
			if( $( 'body' ).hasClass( 'safari-browser' ) && slide.hasClass( 'active' ) ){
				video.attr( 'src', video.attr( 'src' ) + '&amp;autoplay=1' );
				removeLoader( slider, slide, settings );
				slide.addClass( 'video-bkg-loaded' );
				animateCaption( slide, settings );
			}

			// Add script once
			if ( !youtube  ){
				youtube = true;
				var yt = document.createElement( 'script' );
				yt.src = protocol + '//www.youtube.com/player_api';
				var fsTag2 = document.getElementsByTagName( 'script' )[0];
				fsTag2.parentNode.insertBefore( yt, fsTag2 );
			}
			
			// Yt events
			var addYTEvents = function(){
				$( '.youtube' ).each( function(){
					var iframe = $( '.youtube' );
					var id = iframe.attr( 'id' );
					var slide = iframe.closest( 'li' );
					var firstSlide = slide.is( ':first-child' ) ? true : false;
					ytPlayer[ id ] = new YT.Player( id , {
						events: {
							'onStateChange': function( event ){

								// Playing 
								if( event.data === YT.PlayerState.PLAYING ){

									// Background video shown once playing
									if( slide.is( '[data-video-bkg-youtube]' ) && !mobile ) {
										removeLoader( slider, slide, settings );
										slide.addClass( 'video-bkg-loaded' );
										animateCaption( slide, settings );
									}
								}
										
								// Replay or move to next
								if( event.data === YT.PlayerState.ENDED ){
									if( settings.replayOnEnd ) ytPlayer[ id ].playVideo();
									if( settings.nextSlideOnEnd ) obj.nextSlide();
								}
							},
							'onReady': function( event ) {
								
								// Play if first
								if ( firstSlide && settings.autoPlay ){
									ytPlayer[ id ].playVideo();
									slide.addClass( 'video-playing' );
								}


								// Check mute setting 
								if( settings.muteBkgVideo || slide.is( '[data-mute-video]' ) ) ytPlayer[ id ].mute();
							},
							'onError': function( event ) {

								// Post error
								if( event.data === 2 ){
									console.log( 'Avalance Slider - YouTube Video: Check video ID' );
								}else if( event.data === 100 ){
									console.log( 'Avalance Slider - YouTube Video: Video not found' );
								}else if( event.data === 101 || event.data === 150 ){
									console.log( 'Avalance Slider - YouTube Video: Owner does not allow this video to be played as an embeded video' );
								}

								// Swap video/img and show captions
								iframe.hide();
								removeLoader( slider, slide, settings );
								slide.addClass( 'error' );
								animateCaption( slide, settings );
							}
						}
					});
				});
			};
			window.onYouTubePlayerAPIReady = function() {
				addYTEvents();
			};

		// HTML5 Video
		}else if ( video.is( 'video' ) ){ 

			// Add class
			video.addClass( 'html5-video' );

			// Add events
			video[0].addEventListener( 'ended', onEnd, false );

			var videoId = document.getElementById( video.attr( 'id' ) );
			var firstSlide = slide.is( ':first-child' ) ? true : false;
			
			// Play if first
			if ( firstSlide && settings.autoPlay ){
				videoId.load();
				videoId.autoplay = true;
				slide.addClass( 'video-playing' );
			}

			// If Playing
			videoId.addEventListener( 'playing', function(){
				slide.addClass( 'video-bkg-loaded' );
			});

			// Check mute setting 
			if( settings.muteBkgVideo || slide.is( '[data-mute-video]' ) ) videoId.muted = settings.muteBkgVideo;

			// Replay or next
			function onEnd(e) {
				if( settings.replayOnEnd ) videoId.loop = true;
				if( settings.nextSlideOnEnd ) obj.nextSlide();
			}
		}
	};	

	/**
	*	Resize Callback
	*/

	var resizeCallBack = ( function () {
		var timers = {};
		return function ( callback, ms, id ) {
			if (!id) {
				id = 'id';
			}
			if ( timers[id] ) {
				clearTimeout ( timers[id] );
			}
			timers[id] = setTimeout( callback, ms );
		};
	})();

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
	var transformOrigin = prefix + '-transform-origin';
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
		'signSwingTop' : 'opacity:0;rotateX:-60deg;transOrigX:top;transOrigY:center;easing:easeSwingInOut;',
		'signSwingRight' : 'opacity:0;rotateY:-60deg;transOrigX:right;transOrigY:center;easing:easeSwingInOut;',
		'signSwingBottom' : 'opacity:0;rotateX:-60deg;transOrigX:bottom;transOrigY:center;easing:easeSwingInOut;',
		'signSwingLeft' : 'opacity:0;rotateY:-60deg;transOrigX:left;transOrigY:center;easing:easeSwingInOut;',
		'wiggleX' : 'opacity:0;rotateX:-90deg;transOrigX:center;transOrigY:center;easing:easeSwingInOut;',
		'wiggleY' : 'opacity:0;rotateY:-90deg;transOrigX:center;transOrigY:center;easing:easeSwingInOut;',
		'dropUp' : 'opacity:0;transY: 250px;rotateZ:60deg;transOrigX:left;transOrigY:top;easing:easeBounceBackHard;',
		'dropDown' : 'opacity:0;transY: -250px;rotateZ:-60deg;transOrigX:left;transOrigY:top;easing:easeBounceBackHard;',
		'rollInLeft' : 'opacity:0;transX: -250px;transY: 200px;rotateZ: -120px;transOrigX:left;transOrigY:top;easing:easeFastSlow;',
		'rollInRight' : 'opacity:0;transX: 250px;transY: 200px;rotateZ: 120px;transOrigX:right;transOrigY:top;easing:easeFastSlow;',
		'turnInRight' : 'opacity:0;transX: 250px;rotateX:20deg;rotateY:75deg;transOrigX:left;transOrigY:top;easing:easeBounceBack;',
		'turnInLeft' : 'opacity:0;transX: -250px;rotateX:20deg;rotateY:-75deg;transOrigX:right;transOrigY:top;easing:easeBounceBack;'
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

	// IE Hack
	var isIE = document.all && document.addEventListener || '-ms-scroll-limit' in document.documentElement.style && '-ms-ime-align' in document.documentElement.style;
	if( isIE && !$( 'body' ).hasClass( 'ie-browser' ) ) document.getElementsByTagName( 'body' )[0].className+=' ie-browser';

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
	$.fn.avalancheSlider = function( options ) {

		// Iterate through each DOM element and return it
		return this.each(function() {

			var element = $( this );

			// Return early if this element already has a plugin instance
			if ( element.data( 'avalancheSlider' ) ) return;

			// Pass options
			var avalanche = new AvalancheSlider( this, options );

			// Store plugin object in this element's data
			element.data( 'avalancheSlider', avalanche );

		});
	};

	// Default
	$.fn.avalancheSlider.tmsOpts = {

		// Animation
		animation: 'slide',								// Animation type: slide/fade
		scaleFactor: 0.2,								// Scale factor: used to determine scale factor if animation is set to scale
		parallax: false,								// Parallax: boolean
		easing: 'easeInOutQuint',						// Easing type: string, see easingArray
		easingFallback: 'easeInOutQuint',				// Easing fallback: for older browser that do not support custom easing
		speed: 700,										// Animation speed: milliseconds 
		parallaxSpeed: 0.2,								// Parallax speed: decimal - 0.1-0.5 
		parallaxScale: false,							// Parallax scale out: boolean - if slider should scale out of view
		parallaxFadeOut: false,							// Parallax fade out:boolean - if slider should fade out of view
		
		// Navigation
		navArrows: true,								// Arrow nav: boolean
		navPagination: true,							// Pagination nav: boolean
		navShowOnHover: true,							// Show on hover: boolean
		paginationType: 'bullets',						// Pagination type: string - v.1 bullets only
		navKeyboard: true,								// Keyboard nav: boolean

		// Scaling
		forceFit: false,								// Force fits all slide images to slide, use data-force-fit for individual images
		fullwidth: false,								// Full width: boolean
		adaptiveHeight: false,						// Adapt height
		fullscreen: false,								// Fullscreen slider: boolean
		fsUseHeightOf: '',								// Whether in fullscreen mode the slider should use window height or parent height as reference. Useful when slider is used as background slider.
		externalPadding: 0,								// External Padding: padding of wrapping container, use data-external-padding for individual sliders
		scaleUnder: 1140,								// Width under which slider should scale if fullwidth is true							
		scaleMinHeight: 214,
		captionScaling: true,							// Scale captions: boolean
		
		// Carousel
		carousel: false,								// Carousel Slider: boolean
		carouselVisible: 1,								// Carousel visible slides: integer

		// Slideshow
		autoAdvance: true,								// Slideshow: boolean
		showProgressBar: true,							// Progress: boolean, wheter slider should show progress bar
		interval: 6000,									// Interval: milliseconds
		pauseOnHover: true,

		//Video
		useVideoAPI: true,								// Use YouTube/Vimeo/HTML5 APIs: boolean
		autoPlay: true,									// Play if active slide: boolean
		replayOnEnd: true,								// On video end reply: boolean
		nextSlideOnEnd: false,							// On video end move to next slide: boolean
		respectRatio: true,								// Scale video based on video ratio: boolean
		muteBkgVideo: false,							// Whether background video should be muted

		// Preload
		lazyLoad: true,									// Load progressively: boolean

		// Retina Support
		retinaSupport: true,							// Check for retina displays and serve retina image, affects all images within a slide
														// Use data-retina for individual swaps
		retinaSupportMobile: false,						// Whether swap should occur on mobile devices
		retinaSuffix: '@2x',							// Retina image suffix

		// Callback
		onSetup: null,									// Callback: on creation
		onLoadEnd: null,								// Callback: after all slides have loaded
		onSlideBefore: null,							// Callback: before slide animation
		onSlideAfter: null,								// Callback: after slide animation
		onSlideshowStart: null,							// Callback: on slideshow init
		onSlideshowPause: null,							// Callback: on slideshow pause
		onSlideshowEnd: null							// Callback: on slideshow end
	};
})(jQuery, document, window);