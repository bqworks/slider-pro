;(function( window, $ ) {

	"use strict";

	// Static methods for Slider Pro
	$.SliderPro = {

		// List of added modules
		modules: [],

		// Add a module by extending the core prototype
		addModule: function( name, module ) {
			this.modules.push( name );
			$.extend( SliderPro.prototype, module );
		}
	};

	// namespace
	var NS = $.SliderPro.namespace = 'SliderPro';

	var SliderPro = function( instance, options ) {

		// Reference to the slider instance
		this.instance = instance;

		// Reference to the slider jQuery element
		this.$slider = $( this.instance );

		// Reference to the slides (sp-slides) jQuery element
		this.$slides = null;

		// Reference to the mask (sp-mask) jQuery element
		this.$slidesMask = null;

		// Reference to the slides (sp-slides-container) jQuery element
		this.$slidesContainer = null;

		// Array of SliderProSlide objects, ordered by their DOM index
		this.slides = [];

		// Array of SliderProSlide objects, ordered by their left/top position in the slider.
		// This will be updated continuously if the slider is loopable.
		this.slidesOrder = [];

		// Holds the options passed to the slider when it was instantiated
		this.options = options;

		// Holds the final settings of the slider after merging the specified
		// ones with the default ones.
		this.settings = {};

		// Another reference to the settings which will not be altered by breakpoints or by other means
		this.originalSettings = {};

		// Reference to the original 'gotoSlide' method
		this.originalGotoSlide = null;

		// The index of the currently selected slide (starts with 0)
		this.selectedSlideIndex = 0;

		// The index of the previously selected slide
		this.previousSlideIndex = 0;

		// Indicates the position of the slide considered to be in the middle.
		// If there are 5 slides (0, 1, 2, 3, 4) the middle position will be 2.
		// If there are 6 slides (0, 1, 2, 3, 4, 5) the middle position will be approximated to 2.
		this.middleSlidePosition = 0;

		// Indicates the type of supported transition (CSS3 2D, CSS3 3D or JavaScript)
		this.supportedAnimation = null;

		// Indicates the required vendor prefix for CSS (i.e., -webkit, -moz, etc.)
		this.vendorPrefix = null;

		// Indicates the name of the CSS transition's complete event (i.e., transitionend, webkitTransitionEnd, etc.)
		this.transitionEvent = null;

		// Indicates the 'left' or 'top' position
		this.positionProperty = null;

		// Indicates if the current browser is IE
		this.isIE = null;

		// The position of the slides container
		this.slidesPosition = 0;

		// The width of the individual slide
		this.slideWidth = 0;

		// The height of the individual slide
		this.slideHeight = 0;

		// The width or height, depending on the orientation, of the individual slide
		this.slideSize = 0;

		// Reference to the old slide width, used to check if the width has changed
		this.previousSlideWidth = 0;

		// Reference to the old slide height, used to check if the height has changed
		this.previousSlideHeight = 0;
		
		// Reference to the old window width, used to check if the window width has changed
		this.previousWindowWidth = 0;
		
		// Reference to the old window height, used to check if the window height has changed
		this.previousWindowHeight = 0;

		// The distance from the margin of the slider to the left/top of the selected slide.
		// This is useful in calculating the position of the selected slide when there are 
		// more visible slides.
		this.visibleOffset = 0;

		// Property used for deferring the resizing of the slider
		this.allowResize = true;

		// Unique ID to be used for event listening
		this.uniqueId = new Date().valueOf();

		// Stores size breakpoints
		this.breakpoints = [];

		// Indicates the current size breakpoint
		this.currentBreakpoint = -1;

		// An array of shuffled indexes, based on which the slides will be shuffled
		this.shuffledIndexes = [];

		// Initialize the slider
		this._init();
	};

	SliderPro.prototype = {

		// The starting place for the slider
		_init: function() {
			var that = this;

			this.supportedAnimation = SliderProUtils.getSupportedAnimation();
			this.vendorPrefix = SliderProUtils.getVendorPrefix();
			this.transitionEvent = SliderProUtils.getTransitionEvent();
			this.isIE = SliderProUtils.checkIE();

			// Remove the 'sp-no-js' when the slider's JavaScript code starts running
			this.$slider.removeClass( 'sp-no-js' );

			// Add the 'ios' class if it's an iOS device
			if ( window.navigator.userAgent.match( /(iPad|iPhone|iPod)/g ) ) {
				this.$slider.addClass( 'ios' );
			}

			// Check if IE (older than 11) is used and add the version number as a class to the slider since
			// older IE versions might need CSS tweaks.
			var rmsie = /(msie) ([\w.]+)/,
				ieVersion = rmsie.exec( window.navigator.userAgent.toLowerCase() );
			
			if ( this.isIE ) {
				this.$slider.addClass( 'ie' );
			}

			if ( ieVersion !== null ) {
				this.$slider.addClass( 'ie' + parseInt( ieVersion[2], 10 ) );
			}

			// Set up the slides containers
			// slider-pro > sp-slides-container > sp-mask > sp-slides > sp-slide
			this.$slidesContainer = $( '<div class="sp-slides-container"></div>' ).appendTo( this.$slider );
			this.$slidesMask = $( '<div class="sp-mask"></div>' ).appendTo( this.$slidesContainer );
			this.$slides = this.$slider.find( '.sp-slides' ).appendTo( this.$slidesMask );
			this.$slider.find( '.sp-slide' ).appendTo( this.$slides );
			
			var modules = $.SliderPro.modules;

			// Merge the modules' default settings with the core's default settings
			if ( typeof modules !== 'undefined' ) {
				for ( var i = 0; i < modules.length; i++ ) {
					var defaults = modules[ i ].substring( 0, 1 ).toLowerCase() + modules[ i ].substring( 1 ) + 'Defaults';

					if ( typeof this[ defaults ] !== 'undefined' ) {
						$.extend( this.defaults, this[ defaults ] );
					}
				}
			}

			// Merge the specified setting with the default ones
			this.settings = $.extend( {}, this.defaults, this.options );

			// Initialize the modules
			if ( typeof modules !== 'undefined' ) {
				for ( var j = 0; j < modules.length; j++ ) {
					if ( typeof this[ 'init' + modules[ j ] ] !== 'undefined' ) {
						this[ 'init' + modules[ j ] ]();
					}
				}
			}

			// Keep a reference of the original settings and use it
			// to restore the settings when the breakpoints are used.
			this.originalSettings = $.extend( {}, this.settings );

			// Get the reference to the 'gotoSlide' method
			this.originalGotoSlide = this.gotoSlide;

			// Parse the breakpoints object and store the values into an array,
			// sorting them in ascending order based on the specified size.
			if ( this.settings.breakpoints !== null ) {
				for ( var sizes in this.settings.breakpoints ) {
					this.breakpoints.push({ size: parseInt( sizes, 10 ), properties:this.settings.breakpoints[ sizes ] });
				}

				this.breakpoints = this.breakpoints.sort(function( a, b ) {
					return a.size >= b.size ? 1: -1;
				});
			}

			// Set which slide should be selected initially
			this.selectedSlideIndex = this.settings.startSlide;

			// Shuffle/randomize the slides
			if ( this.settings.shuffle === true ) {
				var slides = this.$slides.find( '.sp-slide' ),
					shuffledSlides = [];

				// Populate the 'shuffledIndexes' with index numbers
				slides.each(function( index ) {
					that.shuffledIndexes.push( index );
				});

				for ( var k = this.shuffledIndexes.length - 1; k > 0; k-- ) {
					var l = Math.floor( Math.random() * ( k + 1 ) ),
						temp = this.shuffledIndexes[ k ];

					this.shuffledIndexes[ k ] = this.shuffledIndexes[ l ];
					this.shuffledIndexes[ l ] = temp;
				}

				// Reposition the slides based on the order of the indexes in the
				// 'shuffledIndexes' array
				$.each( this.shuffledIndexes, function( index, element ) {
					shuffledSlides.push( slides[ element ] );
				});
				
				// Append the sorted slides to the slider
				this.$slides.empty().append( shuffledSlides ) ;
			}
			
			// Resize the slider when the browser window resizes.
			// Also, deffer the resizing in order to not allow multiple
			// resizes in a 200 milliseconds interval.
			$( window ).on( 'resize.' + this.uniqueId + '.' + NS, function() {
			
				// Get the current width and height of the window
				var newWindowWidth = $( window ).width(),
					newWindowHeight = $( window ).height();
				
				// If the resize is not allowed yet or if the window size hasn't changed (this needs to be verified
				// because in IE8 and lower the resize event is triggered whenever an element from the page changes
				// its size) return early.
				if ( that.allowResize === false ||
					( that.previousWindowWidth === newWindowWidth && that.previousWindowHeight === newWindowHeight ) ) {
					return;
				}
				
				// Asign the new values for the window width and height
				that.previousWindowWidth = newWindowWidth;
				that.previousWindowHeight = newWindowHeight;
			
				that.allowResize = false;

				setTimeout(function() {
					that.resize();
					that.allowResize = true;
				}, 200 );
			});

			// Resize the slider when the 'update' method is called.
			this.on( 'update.' + NS, function() {

				// Reset the previous slide width
				that.previousSlideWidth = 0;

				// Some updates might require a resize
				that.resize();
			});

			this.update();

			// add the 'sp-selected' class to the initially selected slide
			this.$slides.find( '.sp-slide' ).eq( this.selectedSlideIndex ).addClass( 'sp-selected' );

			// Fire the 'init' event
			this.trigger({ type: 'init' });
			if ( $.isFunction( this.settings.init ) ) {
				this.settings.init.call( this, { type: 'init' });
			}
		},

		// Update the slider by checking for setting changes and for slides
		// that weren't initialized yet.
		update: function() {
			var that = this;

			// Check the current slider orientation and reset CSS that might have been
			// added for a different orientation, since the orientation can be changed
			// at runtime.
			if ( this.settings.orientation === 'horizontal' ) {
				this.$slider.removeClass( 'sp-vertical' ).addClass( 'sp-horizontal' );
				this.$slider.css({ 'height': '', 'max-height': '' });
				this.$slides.find( '.sp-slide' ).css( 'top', '' );
			} else if ( this.settings.orientation === 'vertical' ) {
				this.$slider.removeClass( 'sp-horizontal' ).addClass( 'sp-vertical' );
				this.$slides.find( '.sp-slide' ).css( 'left', '' );
			}

			// Set the position that will be used to arrange elements, like the slides,
			// based on the orientation.
			this.positionProperty = this.settings.orientation === 'horizontal' ? 'left' : 'top';

			// Reset the 'gotoSlide' method
			this.gotoSlide = this.originalGotoSlide;

			// Loop through the array of SliderProSlide objects and if a stored slide is found
			// which is not in the DOM anymore, destroy that slide.
			for ( var i = this.slides.length - 1; i >= 0; i-- ) {
				if ( this.$slider.find( '.sp-slide[data-index="' + i + '"]' ).length === 0 ) {
					var slide = this.slides[ i ];

					slide.destroy();
					this.slides.splice( i, 1 );
				}
			}

			this.slidesOrder.length = 0;

			// Loop through the list of slides and initialize newly added slides if any,
			// and reset the index of each slide.
			this.$slider.find( '.sp-slide' ).each(function( index ) {
				var $slide = $( this );

				if ( typeof $slide.attr( 'data-init' ) === 'undefined' ) {
					that._createSlide( index, $slide );
				} else {
					that.slides[ index ].setIndex( index );
				}

				that.slidesOrder.push( index );
			});

			// Calculate the position/index of the middle slide
			this.middleSlidePosition = parseInt( ( that.slidesOrder.length - 1 ) / 2, 10 );

			// Arrange the slides in a loop
			if ( this.settings.loop === true ) {
				this._updateSlidesOrder();
			}

			// Fire the 'update' event
			this.trigger({ type: 'update' });
			if ( $.isFunction( this.settings.update ) ) {
				this.settings.update.call( this, { type: 'update' } );
			}
		},

		// Create a SliderProSlide instance for the slide passed as a jQuery element
		_createSlide: function( index, element ) {
			var that = this,
				slide = new SliderProSlide( $( element ), index, this.settings );

			this.slides.splice( index, 0, slide );
		},

		// Arrange the slide elements in a loop inside the 'slidesOrder' array
		_updateSlidesOrder: function() {
			var	slicedItems,
				i,

				// Calculate the distance between the selected element and the middle position
				distance = $.inArray( this.selectedSlideIndex, this.slidesOrder ) - this.middleSlidePosition;

			// If the distance is negative it means that the selected slider is before the middle position, so
			// slides from the end of the array will be added at the beginning, in order to shift the selected slide
			// forward.
			// 
			// If the distance is positive, slides from the beginning of the array will be added at the end.
			if ( distance < 0 ) {
				slicedItems = this.slidesOrder.splice( distance, Math.abs( distance ) );

				for ( i = slicedItems.length - 1; i >= 0; i-- ) {
					this.slidesOrder.unshift( slicedItems[ i ] );
				}
			} else if ( distance > 0 ) {
				slicedItems = this.slidesOrder.splice( 0, distance );

				for ( i = 0; i <= slicedItems.length - 1; i++ ) {
					this.slidesOrder.push( slicedItems[ i ] );
				}
			}
		},

		// Set the left/top position of the slides based on their position in the 'slidesOrder' array
		_updateSlidesPosition: function() {
			var selectedSlidePixelPosition = parseInt( this.$slides.find( '.sp-slide' ).eq( this.selectedSlideIndex ).css( this.positionProperty ), 10 );

			for ( var slideIndex = 0; slideIndex < this.slidesOrder.length; slideIndex++ ) {
				var slide = this.$slides.find( '.sp-slide' ).eq( this.slidesOrder[ slideIndex ] );
				slide.css( this.positionProperty, selectedSlidePixelPosition + ( slideIndex - this.middleSlidePosition  ) * ( this.slideSize + this.settings.slideDistance ) );
			}
		},

		// Set the left/top position of the slides based on their position in the 'slidesOrder' array,
		// and also set the position of the slides container.
		_resetSlidesPosition: function() {
			for ( var slideIndex = 0; slideIndex < this.slidesOrder.length; slideIndex++ ) {
				var slide = this.$slides.find( '.sp-slide' ).eq( this.slidesOrder[ slideIndex ] );
				slide.css( this.positionProperty, slideIndex * ( this.slideSize + this.settings.slideDistance ) );
			}

			var newSlidesPosition = - parseInt( this.$slides.find( '.sp-slide' ).eq( this.selectedSlideIndex ).css( this.positionProperty ), 10 ) + this.visibleOffset;
			this._moveTo( newSlidesPosition, true );
		},

		// Called when the slider needs to resize
		resize: function() {
			var that = this;

			// Check if the current window width is bigger than the biggest breakpoint
			// and if necessary reset the properties to the original settings.
			// 
			// If the window width is smaller than a certain breakpoint, apply the settings specified
			// for that breakpoint but only after merging them with the original settings
			// in order to make sure that only the specified settings for the breakpoint are applied
			if ( this.settings.breakpoints !== null && this.breakpoints.length > 0 ) {
				if ( $( window ).width() > this.breakpoints[ this.breakpoints.length - 1 ].size && this.currentBreakpoint !== -1 ) {
					this.currentBreakpoint = -1;
					this._setProperties( this.originalSettings, false );
				} else {
					for ( var i = 0, n = this.breakpoints.length; i < n; i++ ) {
						if ( $( window ).width() <= this.breakpoints[ i ].size ) {
							if ( this.currentBreakpoint !== this.breakpoints[ i ].size ) {
								var eventObject = { type: 'breakpointReach', size: this.breakpoints[ i ].size, settings: this.breakpoints[ i ].properties };
								this.trigger( eventObject );
								if ( $.isFunction( this.settings.breakpointReach ) )
									this.settings.breakpointReach.call( this, eventObject );

								this.currentBreakpoint = this.breakpoints[ i ].size;
								var settings = $.extend( {}, this.originalSettings, this.breakpoints[ i ].properties );
								this._setProperties( settings, false );
								
								return;
							}

							break;
						}
					}
				}
			}

			// Set the width of the main slider container based on whether or not the slider is responsive,
			// full width or full size
			if ( this.settings.responsive === true ) {
				if ( ( this.settings.forceSize === 'fullWidth' || this.settings.forceSize === 'fullWindow' ) &&
					( this.settings.visibleSize === 'auto' || this.settings.visibleSize !== 'auto' && this.settings.orientation === 'vertical' )
				) {
					this.$slider.css( 'margin', 0 );
					this.$slider.css({ 'width': $( window ).width(), 'max-width': '', 'marginLeft': - this.$slider.offset().left });
				} else {
					this.$slider.css({ 'width': '100%', 'max-width': this.settings.width, 'marginLeft': '' });
				}
			} else {
				this.$slider.css({ 'width': this.settings.width });
			}

			// Calculate the aspect ratio of the slider
			if ( this.settings.aspectRatio === -1 ) {
				this.settings.aspectRatio = this.settings.width / this.settings.height;
			}
			
			// Initially set the slide width to the size of the slider.
			// Later, this will be set to less if there are multiple visible slides.
			this.slideWidth = this.$slider.width();

			// Set the height to the same size as the browser window if the slider is set to be 'fullWindow',
			// or calculate the height based on the width and the aspect ratio.
			if ( this.settings.forceSize === 'fullWindow' ) {
				this.slideHeight = $( window ).height();
			} else {
				this.slideHeight = isNaN( this.settings.aspectRatio ) ? this.settings.height : this.slideWidth / this.settings.aspectRatio;
			}

			// Resize the slider only if the size of the slider has changed
			// If it hasn't, return.
			if ( this.previousSlideWidth !== this.slideWidth ||
				this.previousSlideHeight !== this.slideHeight ||
				this.settings.visibleSize !== 'auto' ||
				this.$slider.outerWidth() > this.$slider.parent().width() ||
				this.$slider.width() !== this.$slidesMask.width()
			) {
				this.previousSlideWidth = this.slideWidth;
				this.previousSlideHeight = this.slideHeight;
			} else {
				return;
			}

			// The slide width or slide height is needed for several calculation, so create a reference to it
			// based on the current orientation.
			this.slideSize = this.settings.orientation === 'horizontal' ? this.slideWidth : this.slideHeight;
			
			// Initially set the visible size of the slides and the offset of the selected slide as if there is only
			// on visible slide.
			// If there will be multiple visible slides (when 'visibleSize' is different than 'auto'), these will
			// be updated accordingly.
			this.visibleSlidesSize = this.slideSize;
			this.visibleOffset = 0;

			// Loop through the existing slides and reset their size.
			$.each( this.slides, function( index, element ) {
				element.setSize( that.slideWidth, that.slideHeight );
			});

			// Set the initial size of the mask container to the size of an individual slide
			this.$slidesMask.css({ 'width': this.slideWidth, 'height': this.slideHeight });

			// Adjust the height if it's set to 'auto'
			if ( this.settings.autoHeight === true ) {

				// Delay the resizing of the height to allow for other resize handlers
				// to execute first before calculating the final height of the slide
				setTimeout( function() {
					that._resizeHeight();
				}, 1 );
			} else {
				this.$slidesMask.css( this.vendorPrefix + 'transition', '' );
			}

			// The 'visibleSize' option can be set to fixed or percentage size to make more slides
			// visible at a time.
			// By default it's set to 'auto'.
			if ( this.settings.visibleSize !== 'auto' ) {
				if ( this.settings.orientation === 'horizontal' ) {

					// If the size is forced to full width or full window, the 'visibleSize' option will be
					// ignored and the slider will become as wide as the browser window.
					if ( this.settings.forceSize === 'fullWidth' || this.settings.forceSize === 'fullWindow' ) {
						this.$slider.css( 'margin', 0 );
						this.$slider.css({ 'width': $( window ).width(), 'max-width': '', 'marginLeft': - this.$slider.offset().left });
					} else {
						this.$slider.css({ 'width': this.settings.visibleSize, 'max-width': '100%', 'marginLeft': 0 });
					}
					
					this.$slidesMask.css( 'width', this.$slider.width() );

					this.visibleSlidesSize = this.$slidesMask.width();
					this.visibleOffset = Math.round( ( this.$slider.width() - this.slideWidth ) / 2 );
				} else {

					// If the size is forced to full window, the 'visibleSize' option will be
					// ignored and the slider will become as high as the browser window.
					if ( this.settings.forceSize === 'fullWindow' ) {
						this.$slider.css({ 'height': $( window ).height(), 'max-height': '' });
					} else {
						this.$slider.css({ 'height': this.settings.visibleSize, 'max-height': '100%' });
					}

					this.$slidesMask.css( 'height', this.$slider.height() );

					this.visibleSlidesSize = this.$slidesMask.height();
					this.visibleOffset = Math.round( ( this.$slider.height() - this.slideHeight ) / 2 );
				}
			}

			this._resetSlidesPosition();

			// Fire the 'sliderResize' event
			this.trigger({ type: 'sliderResize' });
			if ( $.isFunction( this.settings.sliderResize ) ) {
				this.settings.sliderResize.call( this, { type: 'sliderResize' });
			}
		},

		// Resize the height of the slider to the height of the selected slide.
		// It's used when the 'autoHeight' option is set to 'true'.
		_resizeHeight: function() {
			var that = this,
				selectedSlide = this.getSlideAt( this.selectedSlideIndex ),
				size = selectedSlide.getSize();

			selectedSlide.off( 'imagesLoaded.' + NS );
			selectedSlide.on( 'imagesLoaded.' + NS, function( event ) {
				if ( event.index === that.selectedSlideIndex ) {
					var size = selectedSlide.getSize();
					that._resizeHeightTo( size.height );
				}
			});

			// If the selected slide contains images which are still loading,
			// wait for the loading to complete and then request the size again.
			if ( size !== 'loading' ) {
				this._resizeHeightTo( size.height );
			}
		},

		// Open the slide at the specified index
		gotoSlide: function( index ) {
			if ( index === this.selectedSlideIndex || typeof this.slides[ index ] === 'undefined' ) {
				return;
			}

			var that = this;

			this.previousSlideIndex = this.selectedSlideIndex;
			this.selectedSlideIndex = index;

			// Re-assign the 'sp-selected' class to the currently selected slide
			this.$slides.find( '.sp-selected' ).removeClass( 'sp-selected' );
			this.$slides.find( '.sp-slide' ).eq( this.selectedSlideIndex ).addClass( 'sp-selected' );

			// If the slider is loopable reorder the slides to have the selected slide in the middle
			// and update the slides' position.
			if ( this.settings.loop === true ) {
				this._updateSlidesOrder();
				this._updateSlidesPosition();
			}

			// Adjust the height of the slider
			if ( this.settings.autoHeight === true ) {
				this._resizeHeight();
			}

			// Calculate the new position that the slides container need to take
			var newSlidesPosition = - parseInt( this.$slides.find( '.sp-slide' ).eq( this.selectedSlideIndex ).css( this.positionProperty ), 10 ) + this.visibleOffset;

			// Move the slides container to the new position
			this._moveTo( newSlidesPosition, false, function() {
				if ( that.settings.loop === true ) {
					that._resetSlidesPosition();
				}

				// Fire the 'gotoSlideComplete' event
				that.trigger({ type: 'gotoSlideComplete', index: index, previousIndex: that.previousSlideIndex });
				if ( $.isFunction( that.settings.gotoSlideComplete ) ) {
					that.settings.gotoSlideComplete.call( that, { type: 'gotoSlideComplete', index: index, previousIndex: that.previousSlideIndex } );
				}
			});

			// Fire the 'gotoSlide' event
			this.trigger({ type: 'gotoSlide', index: index, previousIndex: this.previousSlideIndex });
			if ( $.isFunction( this.settings.gotoSlide ) ) {
				this.settings.gotoSlide.call( this, { type: 'gotoSlide', index: index, previousIndex: this.previousSlideIndex } );
			}
		},

		// Open the next slide
		nextSlide: function() {
			var index = ( this.selectedSlideIndex >= this.getTotalSlides() - 1 ) ? 0 : ( this.selectedSlideIndex + 1 );
			this.gotoSlide( index );
		},

		// Open the previous slide
		previousSlide: function() {
			var index = this.selectedSlideIndex <= 0 ? ( this.getTotalSlides() - 1 ) : ( this.selectedSlideIndex - 1 );
			this.gotoSlide( index );
		},

		// Move the slides container to the specified position.
		// The movement can be instant or animated.
		_moveTo: function( position, instant, callback ) {
			var that = this,
				css = {};

			if ( position === this.slidesPosition ) {
				return;
			}
			
			this.slidesPosition = position;
			
			if ( ( this.supportedAnimation === 'css-3d' || this.supportedAnimation === 'css-2d' ) && this.isIE === false ) {
				var transition,
					left = this.settings.orientation === 'horizontal' ? position : 0,
					top = this.settings.orientation === 'horizontal' ? 0 : position;

				if ( this.supportedAnimation === 'css-3d' ) {
					css[ this.vendorPrefix + 'transform' ] = 'translate3d(' + left + 'px, ' + top + 'px, 0)';
				} else {
					css[ this.vendorPrefix + 'transform' ] = 'translate(' + left + 'px, ' + top + 'px)';
				}

				if ( typeof instant !== 'undefined' && instant === true ) {
					transition = '';
				} else {
					this.$slides.addClass( 'sp-animated' );
					transition = this.vendorPrefix + 'transform ' + this.settings.slideAnimationDuration / 1000 + 's';

					this.$slides.on( this.transitionEvent, function( event ) {
						if ( event.target !== event.currentTarget ) {
							return;
						}

						that.$slides.off( that.transitionEvent );
						that.$slides.removeClass( 'sp-animated' );
						
						if ( typeof callback === 'function' ) {
							callback();
						}
					});
				}

				css[ this.vendorPrefix + 'transition' ] = transition;

				this.$slides.css( css );
			} else {
				css[ 'margin-' + this.positionProperty ] = position;

				if ( typeof instant !== 'undefined' && instant === true ) {
					this.$slides.css( css );
				} else {
					this.$slides.addClass( 'sp-animated' );
					this.$slides.animate( css, this.settings.slideAnimationDuration, function() {
						that.$slides.removeClass( 'sp-animated' );

						if ( typeof callback === 'function' ) {
							callback();
						}
					});
				}
			}
		},

		// Stop the movement of the slides
		_stopMovement: function() {
			var css = {};

			if ( ( this.supportedAnimation === 'css-3d' || this.supportedAnimation === 'css-2d' ) && this.isIE === false) {

				// Get the current position of the slides by parsing the 'transform' property
				var	matrixString = this.$slides.css( this.vendorPrefix + 'transform' ),
					matrixType = matrixString.indexOf( 'matrix3d' ) !== -1 ? 'matrix3d' : 'matrix',
					matrixArray = matrixString.replace( matrixType, '' ).match( /-?[0-9\.]+/g ),
					left = matrixType === 'matrix3d' ? parseInt( matrixArray[ 12 ], 10 ) : parseInt( matrixArray[ 4 ], 10 ),
					top = matrixType === 'matrix3d' ? parseInt( matrixArray[ 13 ], 10 ) : parseInt( matrixArray[ 5 ], 10 );
					
				// Set the transform property to the value that the transform had when the function was called
				if ( this.supportedAnimation === 'css-3d' ) {
					css[ this.vendorPrefix + 'transform' ] = 'translate3d(' + left + 'px, ' + top + 'px, 0)';
				} else {
					css[ this.vendorPrefix + 'transform' ] = 'translate(' + left + 'px, ' + top + 'px)';
				}

				css[ this.vendorPrefix + 'transition' ] = '';

				this.$slides.css( css );
				this.$slides.off( this.transitionEvent );
				this.slidesPosition = this.settings.orientation === 'horizontal' ? left : top;
			} else {
				this.$slides.stop();
				this.slidesPosition = parseInt( this.$slides.css( 'margin-' + this.positionProperty ), 10 );
			}

			this.$slides.removeClass( 'sp-animated' );
		},

		// Resize the height of the slider to the specified value
		_resizeHeightTo: function( height ) {
			var that = this,
				css = { 'height': height };

			if ( this.supportedAnimation === 'css-3d' || this.supportedAnimation === 'css-2d' ) {
				css[ this.vendorPrefix + 'transition' ] = 'height ' + this.settings.heightAnimationDuration / 1000 + 's';

				this.$slidesMask.off( this.transitionEvent );
				this.$slidesMask.on( this.transitionEvent, function( event ) {
					if ( event.target !== event.currentTarget ) {
						return;
					}

					that.$slidesMask.off( that.transitionEvent );

					// Fire the 'resizeHeightComplete' event
					that.trigger({ type: 'resizeHeightComplete' });
					if ( $.isFunction( that.settings.resizeHeightComplete ) ) {
						that.settings.resizeHeightComplete.call( that, { type: 'resizeHeightComplete' } );
					}
				});

				this.$slidesMask.css( css );
			} else {
				this.$slidesMask.stop().animate( css, this.settings.heightAnimationDuration, function( event ) {
					// Fire the 'resizeHeightComplete' event
					that.trigger({ type: 'resizeHeightComplete' });
					if ( $.isFunction( that.settings.resizeHeightComplete ) ) {
						that.settings.resizeHeightComplete.call( that, { type: 'resizeHeightComplete' } );
					}
				});
			}
		},

		// Destroy the slider instance
		destroy: function() {
			// Remove the stored reference to this instance
			this.$slider.removeData( 'sliderPro' );
			
			// Clean the CSS
			this.$slider.removeAttr( 'style' );
			this.$slides.removeAttr( 'style' );

			// Remove event listeners
			this.off( 'update.' + NS );
			$( window ).off( 'resize.' + this.uniqueId + '.' + NS );

			// Destroy modules
			var modules = $.SliderPro.modules;

			if ( typeof modules !== 'undefined' ) {
				for ( var i = 0; i < modules.length; i++ ) {
					if ( typeof this[ 'destroy' + modules[ i ] ] !== 'undefined' ) {
						this[ 'destroy' + modules[ i ] ]();
					}
				}
			}

			// Destroy all slides
			$.each( this.slides, function( index, element ) {
				element.destroy();
			});

			this.slides.length = 0;

			// Move the slides to their initial position in the DOM and 
			// remove the container elements created dynamically.
			this.$slides.prependTo( this.$slider );
			this.$slidesContainer.remove();
		},

		// Set properties on runtime
		_setProperties: function( properties, store ) {
			// Parse the properties passed as an object
			for ( var prop in properties ) {
				this.settings[ prop ] = properties[ prop ];

				// Alter the original settings as well unless 'false' is passed to the 'store' parameter
				if ( store !== false ) {
					this.originalSettings[ prop ] = properties[ prop ];
				}
			}

			this.update();
		},

		// Attach an event handler to the slider
		on: function( type, callback ) {
			return this.$slider.on( type, callback );
		},

		// Detach an event handler
		off: function( type ) {
			return this.$slider.off( type );
		},

		// Trigger an event on the slider
		trigger: function( data ) {
			return this.$slider.triggerHandler( data );
		},

		// Return the slide at the specified index
		getSlideAt: function( index ) {
			return this.slides[ index ];
		},

		// Return the index of the currently opened slide
		getSelectedSlide: function() {
			return this.selectedSlideIndex;
		},

		// Return the total amount of slides
		getTotalSlides: function() {
			return this.slides.length;
		},

		// The default options of the slider
		defaults: {
			// Width of the slide
			width: 500,

			// Height of the slide
			height: 300,

			// Indicates if the slider is responsive
			responsive: true,

			// The aspect ratio of the slider (width/height)
			aspectRatio: -1,

			// The scale mode for images (cover, contain, exact and none)
			imageScaleMode: 'cover',

			// Indicates if the image will be centered
			centerImage: true,

			// Indicates if height of the slider will be adjusted to the
			// height of the selected slide
			autoHeight: false,

			// Indicates the initially selected slide
			startSlide: 0,

			// Indicates if the slides will be shuffled
			shuffle: false,

			// Indicates whether the slides will be arranged horizontally
			// or vertically. Can be set to 'horizontal' or 'vertical'.
			orientation: 'horizontal',

			// Indicates if the size of the slider will be forced to 'fullWidth' or 'fullWindow'
			forceSize: 'none',

			// Indicates if the slider will be loopable
			loop: true,

			// The distance between slides
			slideDistance: 10,

			// The duration of the slide animation
			slideAnimationDuration: 700,

			// The duration of the height animation
			heightAnimationDuration: 700,

			// Sets the size of the visible area, allowing the increase of it in order
			// to make more slides visible.
			// By default, only the selected slide will be visible. 
			visibleSize: 'auto',

			// Breakpoints for allowing the slider's options to be changed
			// based on the size of the window.
			breakpoints: null,

			// Called when the slider is initialized
			init: function() {},

			// Called when the slider is updates
			update: function() {},

			// Called when the slider is resized
			sliderResize: function() {},

			// Called when a new slide is selected
			gotoSlide: function() {},

			// Called when the navigation to the newly selected slide is complete
			gotoSlideComplete: function() {},

			// Called when the height animation of the slider is complete
			resizeHeightComplete: function() {},

			// Called when a breakpoint is reached
			breakpointReach: function() {}
		}
	};

	var SliderProSlide = function( slide, index, settings ) {

		// Reference to the slide jQuery element
		this.$slide = slide;

		// Reference to the main slide image
		this.$mainImage = null;

		// Reference to the container that will hold the main image
		this.$imageContainer = null;

		// Indicates whether the slide has a main image
		this.hasMainImage = false;

		// Indicates whether the main image is loaded
		this.isMainImageLoaded = false;

		// Indicates whether the main image is in the process of being loaded
		this.isMainImageLoading = false;

		// Indicates whether the slide has any image. There could be other images (i.e., in layers)
		// besides the main slide image.
		this.hasImages = false;

		// Indicates if all the images in the slide are loaded
		this.areImagesLoaded = false;

		// The width and height of the slide
		this.width = 0;
		this.height = 0;

		// Reference to the global settings of the slider
		this.settings = settings;

		// Set the index of the slide
		this.setIndex( index );

		// Initialize the slide
		this._init();
	};

	SliderProSlide.prototype = {

		// The starting point for the slide
		_init: function() {
			var that = this;

			// Mark the slide as initialized
			this.$slide.attr( 'data-init', true );

			// Get the main slide image if there is one
			this.$mainImage = this.$slide.find( '.sp-image' ).length !== 0 ? this.$slide.find( '.sp-image' ) : null;

			// If there is a main slide image, create a container for it and add the image to this container.
			// The container will allow the isolation of the image from the rest of the slide's content. This is
			// helpful when you want to show some content below the image and not cover it.
			if ( this.$mainImage !== null ) {
				this.hasMainImage = true;

				this.$imageContainer = $( '<div class="sp-image-container"></div>' ).prependTo( this.$slide );

				if ( this.$mainImage.parent( 'a' ).length !== 0 ) {
					this.$mainImage.parent( 'a' ).appendTo( this.$imageContainer );
				} else {
					this.$mainImage.appendTo( this.$imageContainer );
				}
			}

			this.hasImages = this.$slide.find( 'img' ).length !== 0 ? true : false;
		},

		// Set the size of the slide
		setSize: function( width, height ) {
			var that = this;
			
			this.width = width;
			this.height = this.settings.autoHeight === true ? 'auto' : height;

			this.$slide.css({
				'width': this.width,
				'height': this.height
			});

			if ( this.hasMainImage === true ) {
				this.$imageContainer.css({
					'width': this.width,
					'height': this.height
				});

				// Resize the main image if it's loaded. If the 'data-src' attribute is present it means
				// that the image will be lazy-loaded
				if ( typeof this.$mainImage.attr( 'data-src' ) === 'undefined' ) {
					this.resizeMainImage();
				}
			}
		},

		// Get the size (width and height) of the slide
		getSize: function() {
			var that = this,
				size;

			// Check if all images have loaded, and if they have, return the size, else, return 'loading'
			if ( this.hasImages === true && this.areImagesLoaded === false && typeof this.$slide.attr( 'data-loading' ) === 'undefined' ) {
				this.$slide.attr( 'data-loading', true );

				var status = SliderProUtils.checkImagesComplete( this.$slide, function() {
					that.areImagesLoaded = true;
					that.$slide.removeAttr( 'data-loading' );
					that.trigger({ type: 'imagesLoaded.' + NS, index: that.index });
				});

				if ( status === 'complete' ) {
					size = this.calculateSize();

					return {
						'width': size.width,
						'height': size.height
					};
				} else {
					return 'loading';
				}
			} else {
				size = this.calculateSize();

				return {
					'width': size.width,
					'height': size.height
				};
			}
		},

		// Calculate the width and height of the slide by going
		// through all the child elements and measuring their 'bottom'
		// and 'right' properties. The element with the biggest
		// 'right'/'bottom' property will determine the slide's
		// width/height.
		calculateSize: function() {
			var width = this.$slide.width(),
				height = this.$slide.height();

			this.$slide.children().each(function( index, element ) {
				var child = $( element );

				if ( child.is( ':hidden' ) === true ) {
					return;
				}

				var	rect = element.getBoundingClientRect(),
					bottom = child.position().top + ( rect.bottom - rect.top ),
					right = child.position().left + ( rect.right - rect.left );

				if ( bottom > height ) {
					height = bottom;
				}

				if ( right > width ) {
					width = right;
				}
			});

			return { width: width, height: height };
		},

		// Resize the main image.
		// 
		// Call this when the slide resizes or when the main image has changed to a different image.
		resizeMainImage: function( isNewImage ) {
			var that = this;

			// If the main image has changed, reset the 'flags'
			if ( isNewImage === true ) {
				this.isMainImageLoaded = false;
				this.isMainImageLoading = false;
			}

			// If the image was not loaded yet and it's not in the process of being loaded, load it
			if ( this.isMainImageLoaded === false && this.isMainImageLoading === false ) {
				this.isMainImageLoading = true;

				SliderProUtils.checkImagesComplete( this.$mainImage, function() {
					that.isMainImageLoaded = true;
					that.isMainImageLoading = false;
					that.resizeMainImage();
					that.trigger({ type: 'imagesLoaded.' + NS, index: that.index });
				});

				return;
			}

			// After the main image has loaded, resize it
			if ( this.settings.autoHeight === true ) {
				this.$mainImage.css({ width: '100%', height: 'auto', 'marginLeft': '', 'marginTop': '' });
			} else {
				if ( this.settings.imageScaleMode === 'cover' ) {
					if ( this.$mainImage.width() / this.$mainImage.height() <= this.width / this.height ) {
						this.$mainImage.css({ width: '100%', height: 'auto' });
					} else {
						this.$mainImage.css({ width: 'auto', height: '100%' });
					}
				} else if ( this.settings.imageScaleMode === 'contain' ) {
					if ( this.$mainImage.width() / this.$mainImage.height() >= this.width / this.height ) {
						this.$mainImage.css({ width: '100%', height: 'auto' });
					} else {
						this.$mainImage.css({ width: 'auto', height: '100%' });
					}
				} else if ( this.settings.imageScaleMode === 'exact' ) {
					this.$mainImage.css({ width: '100%', height: '100%' });
				}

				if ( this.settings.centerImage === true ) {
					this.$mainImage.css({ 'marginLeft': ( this.$imageContainer.width() - this.$mainImage.width() ) * 0.5, 'marginTop': ( this.$imageContainer.height() - this.$mainImage.height() ) * 0.5 });
				}
			}
		},

		// Destroy the slide
		destroy: function() {
			// Clean the slide element from attached styles and data
			this.$slide.removeAttr( 'style' );
			this.$slide.removeAttr( 'data-init' );
			this.$slide.removeAttr( 'data-index' );
			this.$slide.removeAttr( 'data-loaded' );

			// If there is a main image, remove its container
			if ( this.hasMainImage === true ) {
				this.$slide.find( '.sp-image' )
					.removeAttr( 'style' )
					.appendTo( this.$slide );

				this.$slide.find( '.sp-image-container' ).remove();
			}
		},

		// Return the index of the slide
		getIndex: function() {
			return this.index;
		},

		// Set the index of the slide
		setIndex: function( index ) {
			this.index = index;
			this.$slide.attr( 'data-index', this.index );
		},

		// Attach an event handler to the slide
		on: function( type, callback ) {
			return this.$slide.on( type, callback );
		},

		// Detach an event handler to the slide
		off: function( type ) {
			return this.$slide.off( type );
		},

		// Trigger an event on the slide
		trigger: function( data ) {
			return this.$slide.triggerHandler( data );
		}
	};

	window.SliderPro = SliderPro;
	window.SliderProSlide = SliderProSlide;

	$.fn.sliderPro = function( options ) {
		var args = Array.prototype.slice.call( arguments, 1 );

		return this.each(function() {
			// Instantiate the slider or alter it
			if ( typeof $( this ).data( 'sliderPro' ) === 'undefined' ) {
				var newInstance = new SliderPro( this, options );

				// Store a reference to the instance created
				$( this ).data( 'sliderPro', newInstance );
			} else if ( typeof options !== 'undefined' ) {
				var	currentInstance = $( this ).data( 'sliderPro' );

				// Check the type of argument passed
				if ( typeof currentInstance[ options ] === 'function' ) {
					currentInstance[ options ].apply( currentInstance, args );
				} else if ( typeof currentInstance.settings[ options ] !== 'undefined' ) {
					var obj = {};
					obj[ options ] = args[ 0 ];
					currentInstance._setProperties( obj );
				} else if ( typeof options === 'object' ) {
					currentInstance._setProperties( options );
				} else {
					$.error( options + ' does not exist in sliderPro.' );
				}
			}
		});
	};

	// Contains useful utility functions
	var SliderProUtils = {

		// Indicates what type of animations are supported in the current browser
		// Can be CSS 3D, CSS 2D or JavaScript
		supportedAnimation: null,

		// Indicates the required vendor prefix for the current browser
		vendorPrefix: null,

		// Indicates the name of the transition's complete event for the current browser
		transitionEvent: null,

		// Indicates if the current browser is Internet Explorer (any version)
		isIE: null,

		// Check whether CSS3 3D or 2D transforms are supported. If they aren't, use JavaScript animations
		getSupportedAnimation: function() {
			if ( this.supportedAnimation !== null ) {
				return this.supportedAnimation;
			}

			var element = document.body || document.documentElement,
				elementStyle = element.style,
				isCSSTransitions = typeof elementStyle.transition !== 'undefined' ||
									typeof elementStyle.WebkitTransition !== 'undefined' ||
									typeof elementStyle.MozTransition !== 'undefined' ||
									typeof elementStyle.OTransition !== 'undefined';

			if ( isCSSTransitions === true ) {
				var div = document.createElement( 'div' );

				// Check if 3D transforms are supported
				if ( typeof div.style.WebkitPerspective !== 'undefined' || typeof div.style.perspective !== 'undefined' ) {
					this.supportedAnimation = 'css-3d';
				}

				// Additional checks for Webkit
				if ( this.supportedAnimation === 'css-3d' && typeof div.styleWebkitPerspective !== 'undefined' ) {
					var style = document.createElement( 'style' );
					style.textContent = '@media (transform-3d),(-webkit-transform-3d){#test-3d{left:9px;position:absolute;height:5px;margin:0;padding:0;border:0;}}';
					document.getElementsByTagName( 'head' )[0].appendChild( style );

					div.id = 'test-3d';
					document.body.appendChild( div );

					if ( ! ( div.offsetLeft === 9 && div.offsetHeight === 5 ) ) {
						this.supportedAnimation = null;
					}

					style.parentNode.removeChild( style );
					div.parentNode.removeChild( div );
				}

				// If CSS 3D transforms are not supported, check if 2D transforms are supported
				if ( this.supportedAnimation === null && ( typeof div.style['-webkit-transform'] !== 'undefined' || typeof div.style.transform !== 'undefined' ) ) {
					this.supportedAnimation = 'css-2d';
				}
			} else {
				this.supportedAnimation = 'javascript';
			}
			
			return this.supportedAnimation;
		},

		// Check what vendor prefix should be used in the current browser
		getVendorPrefix: function() {
			if ( this.vendorPrefix !== null ) {
				return this.vendorPrefix;
			}

			var div = document.createElement( 'div' ),
				prefixes = [ 'Webkit', 'Moz', 'ms', 'O' ];
			
			if ( 'transform' in div.style ) {
				this.vendorPrefix = '';
				return this.vendorPrefix;
			}
			
			for ( var i = 0; i < prefixes.length; i++ ) {
				if ( ( prefixes[ i ] + 'Transform' ) in div.style ) {
					this.vendorPrefix = '-' + prefixes[ i ].toLowerCase() + '-';
					break;
				}
			}
			
			return this.vendorPrefix;
		},

		// Check the name of the transition's complete event in the current browser
		getTransitionEvent: function() {
			if ( this.transitionEvent !== null ) {
				return this.transitionEvent;
			}

			var div = document.createElement( 'div' ),
				transitions = {
					'transition': 'transitionend',
					'WebkitTransition': 'webkitTransitionEnd',
					'MozTransition': 'transitionend',
					'OTransition': 'oTransitionEnd'
				};

			for ( var transition in transitions ) {
				if ( transition in div.style ) {
					this.transitionEvent = transitions[ transition ];
					break;
				}
			}

			return this.transitionEvent;
		},

		// If a single image is passed, check if it's loaded.
		// If a different element is passed, check if there are images
		// inside it, and check if these images are loaded.
		checkImagesComplete: function( target, callback ) {
			var that = this,

				// Check the initial status of the image(s)
				status = this.checkImagesStatus( target );

			// If there are loading images, wait for them to load.
			// If the images are loaded, call the callback function directly.
			if ( status === 'loading' ) {
				var checkImages = setInterval(function() {
					status = that.checkImagesStatus( target );

					if ( status === 'complete' ) {
						clearInterval( checkImages );

						if ( typeof callback === 'function' ) {
							callback();
						}
					}
				}, 100 );
			} else if ( typeof callback === 'function' ) {
				callback();
			}

			return status;
		},

		checkImagesStatus: function( target ) {
			var status = 'complete';

			if ( target.is( 'img' ) && target[0].complete === false ) {
				status = 'loading';
			} else {
				target.find( 'img' ).each(function( index ) {
					var image = $( this )[0];

					if ( image.complete === false ) {
						status = 'loading';
					}
				});
			}

			return status;
		},

		checkIE: function() {
			if ( this.isIE !== null ) {
				return this.isIE;
			}

			var userAgent = window.navigator.userAgent,
				msie = userAgent.indexOf( 'MSIE' );

			if ( userAgent.indexOf( 'MSIE' ) !== -1 || userAgent.match( /Trident.*rv\:11\./ ) ) {
				this.isIE = true;
			} else {
				this.isIE = false;
			}

			return this.isIE;
		}
	};

	window.SliderProUtils = SliderProUtils;

})( window, jQuery );