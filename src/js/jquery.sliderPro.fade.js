// Fade module for Slider Pro.
// 
// Adds the possibility to navigate through slides using a cross-fade effect.
;(function( window, $ ) {

	"use strict";

	var NS = 'Fade.' + $.SliderPro.namespace;

	var Fade = {

		// Reference to the original 'gotoSlide' method
		fadeGotoSlideReference: null,

		initFade: function() {
			this.on( 'update.' + NS, $.proxy( this._fadeOnUpdate, this ) );
		},

		// If fade is enabled, store a reference to the original 'gotoSlide' method
		// and then assign a new function to 'gotoSlide'.
		_fadeOnUpdate: function() {
			if ( this.settings.fade === true ) {
				this.fadeGotoSlideReference = this.gotoSlide;
				this.gotoSlide = this._fadeGotoSlide;
			}
		},

		// Will replace the original 'gotoSlide' function by adding a cross-fade effect
		// between the previous and the next slide.
		_fadeGotoSlide: function( index ) {
			if ( index === this.selectedSlideIndex ) {
				return;
			}
			
			// If the slides are being swiped/dragged, don't use fade, but call the original method instead.
			// If not, which means that a new slide was selected through a button, arrows or direct call, then
			// use fade.
			if ( this.$slider.hasClass( 'sp-swiping' ) ) {
				this.fadeGotoSlideReference( index );
			} else {
				var that = this,
					$nextSlide,
					$previousSlide,
					newIndex = index;

				// Loop through all the slides and overlap the previous and next slide,
				// and hide the other slides.
				$.each( this.slides, function( index, element ) {
					var slideIndex = element.getIndex(),
						$slide = element.$slide;

					if ( slideIndex === newIndex ) {
						$slide.css({ 'opacity': 0, 'left': 0, 'top': 0, 'z-index': 20, visibility: 'visible' });
						$nextSlide = $slide;
					} else if ( slideIndex === that.selectedSlideIndex ) {
						$slide.css({ 'opacity': 1, 'left': 0, 'top': 0, 'z-index': 10, visibility: 'visible' });
						$previousSlide = $slide;
					} else {
						$slide.css({ 'opacity': 1, visibility: 'hidden', 'z-index': '' });
					}
				});

				// Set the new indexes for the previous and selected slides
				this.previousSlideIndex = this.selectedSlideIndex;
				this.selectedSlideIndex = index;

				// Re-assign the 'sp-selected' class to the currently selected slide
				this.$slides.find( '.sp-selected' ).removeClass( 'sp-selected' );
				this.$slides.find( '.sp-slide' ).eq( this.selectedSlideIndex ).addClass( 'sp-selected' );
			
				// Rearrange the slides if the slider is loop-able
				if ( that.settings.loop === true ) {
					that._updateSlidesOrder();
				}

				// Move the slides container so that the cross-fading slides (which now have the top and left
				// position set to 0) become visible.
				this._moveTo( 0, true );

				// Fade in the selected slide
				this._fadeSlideTo( $nextSlide, 1, function() {

					// This flag will indicate if all the fade transitions are complete,
					// in case there are multiple running at the same time, which happens
					// when the slides are navigated very quickly
					var allTransitionsComplete = true;

					// Go through all the slides and check if there is at least one slide 
					// that is still transitioning.
					$.each( that.slides, function( index, element ) {
						if ( typeof element.$slide.attr( 'data-transitioning' ) !== 'undefined' ) {
							allTransitionsComplete = false;
						}
					});

					if ( allTransitionsComplete === true ) {

						// After all the transitions are complete, make all the slides visible again
						$.each( that.slides, function( index, element ) {
							var $slide = element.$slide;
							$slide.css({ 'visibility': '', 'opacity': '', 'z-index': '' });
						});
						
						// Reset the position of the slides and slides container
						that._resetSlidesPosition();
					}

					// Fire the 'gotoSlideComplete' event
					that.trigger({ type: 'gotoSlideComplete', index: index, previousIndex: that.previousSlideIndex });
					if ( $.isFunction( that.settings.gotoSlideComplete ) ) {
						that.settings.gotoSlideComplete.call( that, { type: 'gotoSlideComplete', index: index, previousIndex: that.previousSlideIndex } );
					}
				});

				// Fade out the previous slide, if indicated, in addition to fading in the next slide
				if ( this.settings.fadeOutPreviousSlide === true ) {
					this._fadeSlideTo( $previousSlide, 0 );
				}

				if ( this.settings.autoHeight === true ) {
					this._resizeHeight();
				}

				// Fire the 'gotoSlide' event
				this.trigger({ type: 'gotoSlide', index: index, previousIndex: this.previousSlideIndex });
				if ( $.isFunction( this.settings.gotoSlide ) ) {
					this.settings.gotoSlide.call( this, { type: 'gotoSlide', index: index, previousIndex: this.previousSlideIndex });
				}
			}
		},

		// Fade the target slide to the specified opacity (0 or 1)
		_fadeSlideTo: function( target, opacity, callback ) {
			var that = this;

			// apply the attribute only to slides that fade in
			if ( opacity === 1 ) {
				target.attr( 'data-transitioning', true );
			}

			// Use CSS transitions if they are supported. If not, use JavaScript animation.
			if ( this.supportedAnimation === 'css-3d' || this.supportedAnimation === 'css-2d' ) {

				// There needs to be a delay between the moment the opacity is set
				// and the moment the transitions starts.
				setTimeout(function(){
					var css = { 'opacity': opacity };
					css[ that.vendorPrefix + 'transition' ] = 'opacity ' + that.settings.fadeDuration / 1000 + 's';
					target.css( css );
				}, 100 );

				target.on( this.transitionEvent, function( event ) {
					if ( event.target !== event.currentTarget ) {
						return;
					}
					
					target.off( that.transitionEvent );
					target.css( that.vendorPrefix + 'transition', '' );
					target.removeAttr( 'data-transitioning');

					if ( typeof callback === 'function' ) {
						callback();
					}
				});
			} else {
				target.stop().animate({ 'opacity': opacity }, this.settings.fadeDuration, function() {
					target.removeAttr( 'data-transitioning' );

					if ( typeof callback === 'function' ) {
						callback();
					}
				});
			}
		},

		// Destroy the module
		destroyFade: function() {
			this.off( 'update.' + NS );

			if ( this.fadeGotoSlideReference !== null ) {
				this.gotoSlide = this.fadeGotoSlideReference;
			}
		},

		fadeDefaults: {

			// Indicates if fade will be used
			fade: false,

			// Indicates if the previous slide will be faded out (in addition to the next slide being faded in)
			fadeOutPreviousSlide: true,

			// Sets the duration of the fade effect
			fadeDuration: 500
		}
	};

	$.SliderPro.addModule( 'Fade', Fade );

})( window, jQuery );