/**
*	Timber
*	Version: 1.2.6
*	URL: @ThemeMountain
*	Description: Components
*	Requires: jQuery 1.10+
*	Author: ThemeMountain
*	Copyright: Copyright 2014 ThemeMountain
*	License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/

$( document ).ready( function(){
	
	'use strict';

	/**
	*	Check for event type
	*/

	var eventType = mobile ? 'touchstart' : 'click';

	/**
	*	Side Navigation 
	*/

	// Reference classes
	var siteWrapper = '.wrapper';								// Site wrapper
	var revealLeft = '.element-reveal-left';					// Wrapper reveal left class
	var revealRight = '.element-reveal-right';					// Wrapper reveal right class
	var sideNav = '.side-navigation-wrapper';					// Side navigation wrapper
	var sideNavShow = '.side-nav-show, a.side-nav-show';		// Side nav show button.
	var sideNavHide = '.side-nav-hide a';						// Side nav hide button.
	var sideNavHelperClass = '.no-scroll';						// Helper class for side nav
	var showLeft = '.element-show-left';						// Show left class
	var showRight = '.element-show-right';						// Show right class
	var cntEasing = 'easeInOutQuint';							// Transition timing function, accepts cubic-bezier

	var sideNavigation = {
		init: function(){

			if( !$( sideNav ).length ) return false;

			// Nav active
			$( 'body' ).data( 'aux-nav', false );

			// Determine animation type & scrollbar setting
			var animation = $( sideNav ).data( 'animation' ) ? $( sideNav ).data( 'animation' ) : 'no-transition';
			var scrollbar = $( sideNav ).is( '[data-no-scrollbar]' ) ? 'no-scrollbar' : 'scrollbar';

			// Add reveal and reset classes
			if( animation === 'no-transition' ) $( siteWrapper ).addClass( animation + '-reset' );
			$( siteWrapper ).addClass( 'reveal-side-navigation' );
			$( sideNav ).addClass( animation + '-reset ' + scrollbar );

			// Determine wrapper animation direction 
			// based on side-nav position
			var menuPosition = $( sideNav ).hasClass( 'enter-right' ) ? 'right' : 'left';
			if( tSupport ){
				direction = menuPosition === 'left' ? revealLeft : revealRight;
			}else{
				direction = menuPosition === 'left' ? showLeft : showRight;
				$( sideNav ).addClass( 'hide' );
			}

			// Strip .
			var direction = direction.split('.').join('');
			sideNavHelperClass = sideNavHelperClass.split('.').join('');

			// Toggle buttons and actions
			$( sideNavShow ).on( eventType, function( event ){
				event.preventDefault();
				if( !$( sideNav ).hasClass( 'active' ) ){
					
					// Renable transitions if window has resized
					transitions.state( true );
					auxNavigation.state( true );

					// Nav now active add helper class to body
					$( 'body' ).data( 'aux-nav', true );
					$( 'html, body' ).addClass( sideNavHelperClass );

					// Lock Header
					var scrollPos = $( window ).scrollTop();
					if( !mobile ) $( '.header-inner' ).css({ top: scrollPos + 'px' });

					// Add animation & state classes
					if( tSupport ){
						$( siteWrapper ).addClass( direction + ' inactive ' + animation ).css({ transitionTimingFunction: easingArray[ cntEasing ] });
						$( sideNav ).addClass( 'active ' + animation ).css({ transitionTimingFunction: easingArray[ cntEasing ] });
					}else{
						$( siteWrapper ).addClass( direction );
						$( sideNav ).removeClass( 'hide' ).addClass( 'active' );
					}

					// Transition end remove listener
					$( siteWrapper ).on( transitionEnd, function( event ){
						if( event.target !== $( this )[0] ) return false;
						event.stopPropagation();
						$( this ).off( transitionEnd );

						// Add overlay click event
						$( '.reveal-side-navigation' ).on( eventType, function( event ) {
							$( '.reveal-side-navigation' ).off( eventType );
							sideNavigation.closeNav( direction, animation );
						});
					});
				}else{
					sideNavigation.closeNav( direction, animation );
				}
			});

			// sideNav close button
			$( sideNavHide ).on( eventType, function( event ){
				event.preventDefault();
				$( '.reveal-side-navigation' ).off( eventType );
				sideNavigation.closeNav( direction, animation );
			});

			// Window event
			$( window ).on( 'resize', function(){
				if( $( 'body' ).data( 'aux-nav' ) ){
					auxNavigation.state( true );
				}else{
					auxNavigation.state( false );
				}
			});
		},
		closeNav: function( direction, animation ){

			if( tSupport ){

				// Reenable transitions
				transitions.state( true );

				// Remove direction & animation classes
				$( siteWrapper ).removeClass( direction + ' ' + animation );
				$( sideNav ).removeClass( animation );

				// Remove classes directly if
				// no animation is set
				if( animation === 'no-transition' ){
					$( 'html, body' ).removeClass( sideNavHelperClass );
					$( siteWrapper ).removeClass( 'inactive' );
					$( sideNav ).removeClass( 'active' );
				}

				// On transition update nav status
				$( siteWrapper ).on( transitionEnd, function( event ){
					if( event.target !== $( this )[0] ) return false;
					event.stopPropagation();
					auxNavigation.state( false );
					$( this ).off( transitionEnd );
					$( 'html, body' ).removeClass( sideNavHelperClass );
					$( siteWrapper ).removeClass( 'inactive' );
					$( sideNav ).removeClass( 'active' );
					if( !mobile ) $( '.header-inner' ).css({ top: 0 });
				});
			}else{
				$( siteWrapper ).removeClass( direction + ' ' + animation );
				$( sideNav ).addClass( 'hide' ).removeClass( 'active' );
			}

			// Nav inactive
			$( 'body' ).data( 'aux-nav', false );
		}
	};

	/**
	*	Overlay Navigation 
	*/

	var overlayNav = '.overlay-navigation-wrapper';												// Overlay navigation
	var overlayNavInner = '.overlay-navigation-inner';											// Overlay navigation inner.
	var overlayNavShow = '.overlay-nav-show a, a.overlay-nav-show';								// Overlay nav show button.
	var overlayNavHide = '.overlay-nav-hide a, .one-page-nav .overlay-navigation .scroll-link';	// Overlay nav hide button.
	var overlayNavHelperClass = '.no-scroll';													// Helper class for side nav
	var overlayEasing = 'easeInOutQuint';														// Transition timing function, accepts cubic-bezier

	var overlayNavigation = {
		init: function(){

			if( !$( overlayNav ).length ) return false;

			// Determine animation type & scrollbar setting
			var animation = $( overlayNav ).data( 'animation' ) ? $( overlayNav ).data( 'animation' ) : 'no-transition';
			var scrollbar = $( overlayNav ).is( '[data-no-scrollbar]' ) ? 'no-scrollbar' : 'scrollbar';

			// Add reveal and reset classes
			$( overlayNav ).addClass( animation + '-reset ' + scrollbar );

			// Strip .
			overlayNavHelperClass = overlayNavHelperClass.split('.').join('');

			// Toggle button actions
			$( overlayNavShow ).on( eventType, function( event ){
				event.preventDefault();
				if( !$( overlayNav ).hasClass( 'active') ){

					// Nav active
					$( 'body' ).data( 'aux-nav', true );
					$( 'html, body' ).addClass( overlayNavHelperClass );

					// Add classes
					if( tSupport ){
						$( overlayNav ).addClass( 'active ' + animation ).css({ transitionTimingFunction: easingArray[ overlayEasing ] });
					}else{
						$( overlayNav ).addClass( 'active' );
					}

					// On transition update nav status
					$( overlayNav ).on( transitionEnd, function( event ){
						if( event.target !== $( this )[0] ) return false;
						event.stopPropagation();
						auxNavigation.state( true );
						$( this ).off( transitionEnd );

					});
				}else{
					overlayNavigation.closeNav( animation );
				}
			});

			// overlayNav screen
			$( overlayNavInner ).on( eventType, function( event ){
				if( event.target === this ){
					overlayNavigation.closeNav( animation );
				}
			});

			// overlayNav close button
			$( overlayNavHide ).on( eventType, function( event ){
				event.preventDefault();
				overlayNavigation.closeNav( animation );
			});

			// Window event
			$( window ).on( 'resize', function(){
				if( $( 'body' ).data( 'aux-nav' ) ){
					auxNavigation.state( true );
				}else{
					auxNavigation.state( false );
				}
			});
		},
		closeNav: function( animation ){
			if( tSupport ){
				$( overlayNav ).removeClass( animation );

				// Remove classes directly if
				// no animation is set
				if( animation === 'no-transition' ){
					$( 'html, body' ).removeClass( overlayNavHelperClass );
					$( overlayNav ).removeClass( 'active' );
				}

				// On transition update nav status
				$( overlayNav ).on( transitionEnd, function( event ){
					if( event.target !== $( this )[0] ) return false;
					event.stopPropagation();
					auxNavigation.state( false );
					$( this ).off( transitionEnd );
					$( 'html, body' ).removeClass( overlayNavHelperClass );
					$( overlayNav ).removeClass( 'active' );
				});
			}else{
				$( overlayNav ).removeClass( 'active' ).css({ top: '-100%' });
			}

			// Nav inactive
			$( 'body' ).data( 'aux-nav', false );
		}
	};

	/**
	*	Sub menu toggle
	*/

	var menuContainer = '.side-navigation-wrapper, .overlay-navigation-wrapper';	// Containers
	var subMenu = '.sub-menu';														// Sub menu
	var subMenuParentLink = '.contains-sub-menu';									// Sub menu parent link

	var toggleSubMenu ={
		init: function(){

			var subMenuItems;
			var subMenuHeight;

			// On startup
			var parentH = 0;
			$( $( menuContainer ).find( '.current' ).children( subMenuParentLink ).get().reverse() ).each( function (){
				subMenuHeight = calcSubMenuHeight( $( this ) );
				parentH += subMenuHeight;
				$( this ).siblings( subMenu ).css({ height: parentH  + 'px' }).addClass( 'open' );
			});

			// On event
			$( menuContainer ).find( subMenuParentLink ).each( function(){

				// On Event
				$( this ).on( eventType, function( event ) {
					event.preventDefault();

					// If sub menu is already animating
					if( $( this ).siblings( subMenu ).data( 'animating' ) ) return false;

					// Sub menu is now animating
					$( this ).siblings( subMenu ).data( 'animating', true );

					// Swap active of parent
					if( $( this ).parent().hasClass( 'current' ) ){
						$( this ).closest( 'ul' ).find( 'li' ).removeClass( 'current' );
					}else{
						if( $( this ).parents().eq( 2 ).is( 'nav' ) ) $( menuContainer ).find( 'nav' ).find( 'li' ).removeClass( 'current' );
						$( this ).parent().addClass( 'current' );
					}

					// Renable transitions in case
					// window has been resized
					transitions.state( true );

					// Calculate sub menu height
					subMenuHeight = calcSubMenuHeight( $( this ) );

					// Set sub menu height
					if( $( this ).siblings( subMenu ).hasClass( 'open' )){	
						closeSubMenus( $( this ) );
						updateParentHeights( $( this ), true );
					} else {
						closeSubMenus( $( this ) );
						$( this ).siblings( subMenu ).css({ height: subMenuHeight  + 'px' }).addClass( 'open' );
						updateParentHeights( $( this ), false );
					}

					// Update sub menu state on transition end
					$( this ).siblings( subMenu ).on( transitionEnd, function( event ){
						$( this ).data( 'animating', false );			
					});
				});
			});
			
			// Calculate height
			function calcSubMenuHeight( link ){
				subMenuItems = $( link ).siblings( subMenu ).children();
				subMenuHeight = 0;
				subMenuItems.each( function(){
					subMenuHeight += $( this ).outerHeight();
				});
				return subMenuHeight;
			}

			// Close sub menus
			function closeSubMenus( link ){
				if( $( link ).parents().eq( 2 ).is( 'nav' ) ){
					$( link ).closest( menuContainer ).find( subMenu ).css({ height: 0 }).removeClass( 'open' );
				}else{
					$( link ).closest( 'li' ).find( subMenu ).css({ height: 0 }).removeClass( 'open' );
				}
			}

			// Update parent heights
			function updateParentHeights( link, state ){
				$( link ).parents( subMenu ).each( function(){
					var parentH = parseFloat( $( this ).css( 'height' ) );
					var newHeight = state ? parentH - subMenuHeight : parentH + subMenuHeight;
					$( this ).css({ height: newHeight  + 'px' });
				});
			}
		}
	};

	/**
	*	Aux nav state
	*/

	var auxNavigation = {
		state: function( active ){
			if( !mobile ){
				if( active ){
					$( 'body' ).addClass( 'aux-navigation-active' );
				}else{
					if( !$( 'body' ).data( 'aux-nav' ) ) $( 'body' ).removeClass( 'aux-navigation-active' );
				}
			}else{
				if( active ){
					$( 'body' ).addClass( 'aux-navigation-active' );
				}else{
					$( 'body' ).removeClass( 'aux-navigation-active' );
				}
			}
		}
	};

	/**
	*	Transition Status
	*/

	// Elements to prevent transition on while resizing window
	var transitionEl = '.header, .header-inner, .logo, .logo a, .header .navigation';

	var transitions = {
		init: function(){
			if( !mobile ){
				$( window ).on( 'scroll', function(){
					transitions.state( true );
				});
			}
			$( window ).on( 'resize', function(){
				transitions.state( false );
			});
		},
		state: function( active ){
			if( active ){
				$( transitionEl ).removeClass( 'no-transition' );
			}else{
				$( transitionEl ).addClass( 'no-transition' );
			}
		}
	};

	/**
	*	To Top
	*/

	// Threshold before 
	// button appears
	var threshold = 300;

	// Scroll to top button
	// class ref
	var toTopButton = '.scroll-to-top';

	// Scroll to top speed
	var sttSpeed = 600;

	var scrollToTop = {
		init: function(){
			$( window ).on( 'scroll', function(){
				if ( $( toTopButton ).is( '[data-no-hide]' ) ) return false;
				if ( $( this ).scrollTop() > threshold ) {
					$( toTopButton ).addClass( 'active' );
				} else {
					$( toTopButton ).removeClass( 'active' );
				}
			});
			$( toTopButton ).on( eventType, function( event ){
				event.preventDefault();
				scrollToTop.scrollUp();
			});
		},
		scrollUp: function(){
			$( 'html, body' ).animate({ scrollTop : 0 }, sttSpeed );
		}
	};

	/**
	*	Framework Components
	*/

	// Header reference
	var header = '.header';

	// Tab class
	var tabs = '.tabs';
	var tabTriggerClick = '.tab-trigger-click';
	
	// Accodion class and 
	// open/close icon ref
	var accordion = '.accordion';
	var accIconOpen = 'icon-plus';
	var accIconClose = 'icon-minus';
	var accContent = '.accordion-content';
	var accTriggerClick = '.accordion-trigger-click';
	
	// Dismissable Element
	// and fadeout speed
	var dismissable = '.box.dismissable';
	var dismSpeed = 300;
	var dismEasing = 'swing';

	// Dropdown element
	// and fadeout speed
	var dropdown = '.dropdown';
	var ddSpeed = 300;
	var ddEasing = 'swing';
	
	// Thumb and overlay class
	// thumb rollover speed
	var thumb = '.thumbnail';
	var tmbAnimationEl = '.overlay-info, img';
	var tmbOverlay = '.overlay-info';
	var ovlSpeed = 400;
	var ovlEasing = 'easeInOutQuint';

	// Backgorund image
	var bkgImageContainer = '.background-image-container';

	var components = {
		init: function(){
			components.tabs();
			components.accordions();
			components.dismissable();
			components.dropdown();
			components.radioInputs();
			components.checkboxes();
			components.rollovers();
			components.thumbnailRatio();
			components.setAsBackground();
		},
		tabs: function(){
			$( tabs ).each( function(){
				var tabLink = $( this ).children( '.tab-nav' ).find( 'li > a' );
				$( this ).find( '.tab-panes > .active' ).addClass( 'animate-in' );
				tabLink.each( function(){
					$( this ).on( eventType , function(){
						
						// Return if disabled
						if( $( this ).parent().hasClass( 'disabled' ) ) return false;

						// Get references
						var tabRef = $( this ).attr( 'href' );
						var tabContent = $( this ).closest( '.tabs' ).find( tabRef );
						$( this ).closest( '.tab-nav' ).find( '.active' ).removeClass( 'active' );
						$( this ).parent().addClass( 'active' );
						$( this ).closest( '.tabs' ).children( '.tab-panes' ).children( '.active' ).removeClass( 'active animate-in' );
						tabContent.addClass( 'active' );

						// Force slider resize if a slider is found
						// required due to display none of tab panes
						if( tabContent.find( '.tm-slider-container' ).length > 0 ){
							var tabSlider = tabContent.find( '.tm-slider-container' ).data( 'avalancheSlider' );
								tabSlider.resizeSlider();
						}

						// Set animation timeout
						var toggleTimer = null;
						clearTimeout( toggleTimer );
						toggleTimer = setTimeout( function(){
							tabContent.addClass( 'animate-in' );
						}, 50 );
						return false;
					});
					if($( this ).parent().hasClass( 'active' )){
						$( this ).closest( '.tabs' ).find( $( this ).attr( 'href' ) ).addClass( 'active' );
					}
				});
			});
			$( tabTriggerClick ).each( function(){
				$( this ).on( 'click', function(){
					var targetTab = $( this ).data( 'target-tab' );
					$( tabs ).find( targetTab ).parent().removeClass( 'disabled' );
					$( tabs ).find( targetTab ).trigger( 'click' );
					return false;
				});
			});
		},
		accordions: function(){
			$( accordion ).each( function(){
				var accLink = $( this ).children().children().children( 'a' );
				accLink.each( function(){
					
					// Add Toggle icon
					if($( this ).closest( accordion ).is( '[data-toggle-icon]' )){
						if(!$( this ).find( 'span' ).length && !$( this ).parent().hasClass( 'active' )){
							$( this ).prepend('<span class="' + accIconOpen + '" />');
						}else if(!$( this ).find( 'span' ).length && $( this ).parent().hasClass( 'active' )){
							$( this ).prepend( '<span class="' + accIconClose +'" />' );
						}
					}		
					$( this ).on( eventType, function(){

						// Return if disabled
						if( $( this ).parent().hasClass( 'disabled' ) ) return false;

						// Get target panel reference
						var link = $( this );
						var accRef = link.attr( 'href' );
						var targetPanel = link.closest( accordion ).find( accRef );
						var allPanels = link.closest( accordion ).find( accContent ).parent();
						
						// Set height of all active
						// in case window has been resized
						link.closest( accordion ).children().children( '.active' ).children( 'div' ).each( function(){
							var activePanelHeight = $( this ).children().outerHeight();
							$( this ).addClass( 'no-transition' ).css({ height: activePanelHeight  + 'px' });
						});

						// Toggle panels
						var toggleTimer = null;
						clearTimeout( toggleTimer );
						if( link.parent().hasClass( 'active' ) ){
							toggleTimer = setTimeout( function(){
								if( !link.closest( accordion ).is( '[data-toggle-multiple]' )){
									link.siblings( 'div' ).removeClass( 'no-transition' ).css({ height: 0 });
								}else{
									link.siblings( targetPanel ).removeClass( 'no-transition' ).css({ height: 0 });
								}
								link.parent().removeClass( 'active' );
							}, 50 );
						}else{
							toggleTimer = setTimeout( function(){
								var targetPanelHeight = link.siblings( targetPanel ).find( accContent ).outerHeight();
								if( !link.closest( accordion ).is( '[data-toggle-multiple]' ) ){
									allPanels.removeClass( 'no-transition' ).css({ height: 0 });
									link.closest( accordion ).children().children( 'li' ).removeClass( 'active' );
								}
								link.parent().addClass( 'active' );
								link.siblings( targetPanel ).removeClass( 'no-transition' ).css({ height: targetPanelHeight  + 'px' });
							}, 50 );
						}
						
						// Toggle icon
						if( link.find( '.' + accIconClose ).length) {
							link.find( '.' + accIconClose ).removeClass( accIconClose ).addClass( accIconOpen );
						}else if( link.find( '.' + accIconOpen ).length ){
							if( !link.closest( accordion ).is( '[data-toggle-multiple]' )){
								link.closest( 'ul' ).find( '.' + accIconClose ).removeClass( accIconClose ).addClass( accIconOpen );
							}
							link.find( '.' + accIconOpen ).removeClass( accIconOpen ).addClass( accIconClose );
						}
						return false;
					});
				});
				$( accTriggerClick ).each( function(){
					$( this ).on( 'click', function(){
						var targetAcc = $( this ).data( 'target-accordion' );
						$( accordion ).find( targetAcc ).parent().removeClass( 'disabled' );
						$( accordion ).find( targetAcc ).trigger( 'click' );
						return false;
					});
				});

				// One window resize
				// set accordion panel to height auto
				$( window ).on( 'resize', function(){
					$( accordion ).each( function(){
						$( this ).children().children( '.active' ).children( 'div' ).addClass( 'no-transition' ).css({ height: 'auto' });
					});
				}); 
			});
		},
		dismissable: function(){
			$( dismissable ).each( function(){
				if( !$( this ).find( '.close' ).length ){
					$( this ).prepend( '<a href="" class="close icon-cancel" />' );
				}
				$( this ).find( '.close' ).on( eventType, function( event ){
					event.preventDefault();
					if( tSupport ){	
						$( this ).parent()
										.css({ 
											transitionProperty: 'opacity', 
											opacity: 0, transitionDuration: dismSpeed + 'ms', 
											transitionTimingFunction: easingArray[ dismEasing ] 
										})
										.on( transitionEnd, function( event ){
											event.stopPropagation();
											if( event.target !== $( this )[0] ) return false;
											$( this ).remove();
										});
					}else{
						$( this ).parent().animate({ opacity: 0 }, ovlSpeed, dismEasing, function(){
							$( this ).remove();
						});
					}
				});
			});
		},
		dropdown: function(){
			$( dropdown ).each( function(){
				$( this ).children( '.button, button' ).each( function(){
					var ddButton = $( this );
					var listItems;
					var listHeight;
					ddButton.on( eventType, function( event ){
						event.preventDefault();
						$( dropdown ).children( '.button, button' ).removeClass( 'active' );
						var dropdownList = $( this ).parent().children( '.dropdown-list' );
						if( $( this ).parent().hasClass( 'disabled' ) ) return false;
						if( $( this ).parent().hasClass( 'list-up' ) ){
							listHeight = $( dropdown ).children( '.button, button' ).outerHeight() + calcListHeight( dropdownList ) + 8;
							dropdownList.css({ transition: 'none', transform: 'translateY(' +  -( listHeight ) + 'px )' });
						}
						$( '.dropdown-list' ).not( dropdownList ).removeClass( 'active' );
						if( dropdownList.hasClass( 'active' ) ){
							dropdownList.removeClass( 'active' );
							$( this ).removeClass( 'active' );
						}else{
							dropdownList.addClass( 'active' );
							$( this ).addClass( 'active' );
							if( dropdownList.find( 'input' ).hasClass( 'set-focus' ) ){
								var input = dropdownList.find( 'input' );
								var setFocus;
								clearTimeout( setFocus );
								setFocus = setTimeout( function(){
									input.focus();
								}, 50 );
							}
							if( dropdownList.find( '.dropdown-aux-close' ) ){
								var auxClose = dropdownList.find( '.dropdown-aux-close' );
								auxClose.on( 'click', function( event ){
									$( this ).off( 'click' );
									event.preventDefault();
									closeAllDropdowns();
								});
							}
						}
						$( document ).on( 'click.closeDropdown', function(event) { 
							if( !$( event.target ).closest( dropdown ).length ) {
								closeAllDropdowns();
							}
						});
					});
					$( this ).parent().children( '.dropdown-list' ).find( 'li a' ).on( eventType, function( event ){
						event.preventDefault();
						$( '.dropdown-list' ).removeClass( 'active' );
						$( '.dropdown-list' ).find( '.active' ).removeClass( 'active' );
						$( this ).addClass( 'active' );
						if( $( this ).closest( '.dropdown' ).is( '[data-update-selection]' ) ){
							var selected = $( this ).text();
							$( this ).closest( '.dropdown' ).find( ddButton ).children( 'span:not([class*="icon-"])' ).text( selected );
						}
					});
					if( !mobile ){
						$( window ).on( 'scroll', function(){
							closeAllDropdowns();
						});
					}
					$( header ).find( '.navigation > ul > li > a' ).mouseenter( function() {
						closeAllDropdowns();
					});

					// Calculate list height
					function calcListHeight( link ){
						listItems = $( link ).children();
						listHeight = 0;
						listItems.each( function(){
							listHeight += $( this ).outerHeight();
						});
						return listHeight;
					}

					// Close all dropdowns
					var closeAllDropdowns = function(){
						$( dropdown ).each( function(){
							$( this ).find( '.button, button' ).removeClass( 'active' );
							$( this ).find( '.dropdown-list' ).removeClass( 'active' );
						});
						$( document ).off( 'click.closeDropdown' );
					};
				});
			});
		},
		radioInputs: function(){
			$( 'input:radio' ).each( function(){
				var toggleContent = $( this ).is( '[data-toggle-content]' ) ? true : false;
				if( toggleContent ){
					var name = $( this ).attr( 'name' );
					$( 'input[name="' + name + '"]' ).on( 'change', function(){
						if( $( this ).is( '[data-toggle-content]' ) ){
							var targetContent = $( this ).data( 'target-content' );
							closeTargetContent( $( this ) );
							$( targetContent ).addClass( 'active show' );
						}else{
							closeTargetContent( $( this ) );
						}
		 			});
		 			var closeTargetContent = function( radio ){
						$( radio ).siblings( '[data-toggle-content]' ).each( function(){
							var targetContent = $( this ).data( 'target-content' );
							$( targetContent ).removeClass( 'active show' );
						});
					};
		 		}
			});
		},
		checkboxes: function(){
			$( 'input:checkbox' ).each( function(){
				var toggleContent = $( this ).is( '[data-toggle-content]' ) ? true : false;
				if( toggleContent ){
					$( this ).on( 'change', function(){
						var targetContent = $( this ).data( 'target-content' );
						$( targetContent ).toggleClass( 'active show' );
		 			});
		 		}
			});
		},
		rollovers: function(){
			if( tSupport ){
				$( thumb ).each( function(){
					var rgba;
					var speed = $( this ).data( 'hover-speed' ) ? $( this ).data( 'hover-speed' ) : ovlSpeed;
					var easing = $( this ).data( 'hover-easing' ) ? $( this ).data( 'hover-easing' ) : ovlEasing;
					var opacity = $( this ).data( 'hover-bkg-opacity' ) ? $( this ).data( 'hover-bkg-opacity' ) : 1;

					// Check for backgorund color
					if( $( this ).data( 'hover-bkg-color' ) ){
						var bkg = $( this ).data( 'hover-bkg-color' );
						bkg = bkg.replace( '#','' );

						// Convert hex to rgba
						var r = parseInt( bkg.substring( 0,2 ), 16 );
						var g = parseInt( bkg.substring( 2,4 ), 16 );
						var b = parseInt( bkg.substring( 4,6 ), 16 );
						rgba = 'rgba( '+ r +','+ g +','+ b +','+ opacity / 1 +' )';

					}else{
						rgba = $( this ).find( tmbOverlay ).css( 'background-color' );
					}

					// Set speed, easing, and bkg color
					$( this ).find( tmbAnimationEl ).css({ transitionDuration: speed + 'ms', transitionTimingFunction: easingArray[ easing ] });
					if( $( this ).is( '[data-gradient]' ) ){
						var spread = $( this ).data( 'gradient-spread' ) ? $( this ).data( 'gradient-spread' ) : '50%';
						$( this ).find( tmbOverlay ).css({ backgroundImage: 'linear-gradient(to top, ' + rgba + ' 0%, transparent ' + spread + ')', backgroundColor: 'transparent' });
					}else{
						$( this ).find( tmbOverlay ).css({ backgroundColor: rgba });
					}
				});
			}else{
				$( thumb ).find( '.overlay-link' ).mouseenter( function() {
					$( this ).find( tmbOverlay ).css({ opacity: 0 }).stop().animate({ opacity: 1 }, ovlSpeed, ovlEasing );
				})
				.mouseleave( function() {
					$( this ).find( tmbOverlay ).stop().animate({ opacity: 0 }, ovlSpeed, ovlEasing );
				});
			}
		},
		thumbnailRatio: function(){
			if( $( 'body' ).hasClass( 'ie-be-11' ) ){
				$( window ).on( 'resize', function(){
					$( thumb ).each( function(){
						if( $( this ).find( '.caption-over-outer' ).length ){
							var media = $( this ).find( 'img, video' );
							var refW = media.attr( 'width' );
							var refH = media.attr( 'height' );
							var mediaW = $( this ).find( 'img, video' ).width();
							var ratio = refW >= refH ? refW / refH : refH / refW;
							var height = refW >= refH ? mediaW / ratio : mediaW  * ratio;
							$( this ).find( '.caption-over-outer' ).css({ opacity: 1 });
							$( this ).css({ height: height + 'px' });
						}
					});
				}).resize();
			}
		},
		setAsBackground: function(){
			$( bkgImageContainer ).each( function(){
				var imgURL = $( this ).children( 'img' ).attr( 'src' );
				$( this ).addClass( 'background-cover' ).css({ 'background-image': 'url(' + imgURL + ')' });
			});
		}
	};

	/**
	*	Transition Support and Prefixing
	*/
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
	var transitionTimingFunction = prefix + '-transition-timing-function';
	var transitionEnd = 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend';
	if( tSupport ) document.getElementsByTagName( 'body' )[0].className+=' transition-support';

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
		'easeInOutBack':'cubic-bezier(.68,-.55,.265,1.55)'
	};

	// Reaload if cached
	window.onpageshow = function( event ) {
		if ( event.persisted ) {
			$( 'body' ).addClass( 'page-fade-reset' )
					   .removeClass( 'page-fade-out' );
		}
	};

	// Add mobile class
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
			document.getElementsByTagName( 'body' )[0].className+=' mobile';
	}

	// Webkit
	var isWebkit = 'WebkitAppearance' in document.documentElement.style;
	if( isWebkit ) document.getElementsByTagName( 'body' )[0].className+=' webkit';

	// Safari Hack
	var isSafari = /constructor/i.test( window.HTMLElement );
	if( isSafari ) document.getElementsByTagName( 'body' )[0].className+=' safari-browser';

	// IE Hack
	var isIE = document.all && document.addEventListener || '-ms-scroll-limit' in document.documentElement.style && '-ms-ime-align' in document.documentElement.style;
	if( isIE ) document.getElementsByTagName( 'body' )[0].className+=' ie-browser';
	var isIe11below = document.all && document.addEventListener;
	if( isIe11below ){
		document.getElementsByTagName( 'body' )[0].className+=' ie-be-11';
		$( '.flex' ).removeClass( 'flex' ).addClass( 'equalize' );
	}

	// Init
	sideNavigation.init();
	overlayNavigation.init();
	toggleSubMenu.init();
	transitions.init();
	scrollToTop.init();
	components.init();
});