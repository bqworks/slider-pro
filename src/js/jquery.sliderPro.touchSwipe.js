// Touch Swipe module for Slider Pro.
// 
// Adds touch-swipe functionality for slides.
;(function( window, $ ) {

	"use strict";
	
	var NS = 'TouchSwipe.' + $.SliderPro.namespace;

	var TouchSwipe = {

		// The x and y coordinates of the pointer/finger's starting position
		touchStartPoint: {x: 0, y: 0},

		// The x and y coordinates of the pointer/finger's end position
		touchEndPoint: {x: 0, y: 0},

		// The distance from the starting to the end position on the x and y axis
		touchDistance: {x: 0, y: 0},

		// The position of the slides when the touch swipe starts
		touchStartPosition: 0,

		// Indicates if the slides are being swiped
		isTouchMoving: false,

		// Stores the names of the events
		touchSwipeEvents: { startEvent: '', moveEvent: '', endEvent: '' },

		initTouchSwipe: function() {
			var that = this;

			// check if touch swipe is enabled
			if ( this.settings.touchSwipe === false ) {
				return;
			}

			this.touchSwipeEvents.startEvent = 'touchstart' + '.' + NS + ' mousedown' + '.' + NS;
			this.touchSwipeEvents.moveEvent = 'touchmove' + '.' + NS + ' mousemove' + '.' + NS;
			this.touchSwipeEvents.endEvent = 'touchend' + '.' + this.uniqueId + '.' + NS + ' mouseup' + '.' + this.uniqueId + '.' + NS;

			// Listen for touch swipe/mouse move events
			this.$slidesMask.on( this.touchSwipeEvents.startEvent, $.proxy( this._onTouchStart, this ) );
			this.$slidesMask.on( 'dragstart.' + NS, function( event ) {
				event.preventDefault();
			});

			// Add the grabbing icon
			this.$slidesMask.addClass( 'sp-grab' );
		},

		// Called when the slides starts being dragged
		_onTouchStart: function( event ) {
		
			// Disable dragging if the element is set to allow selections
			if ( $( event.target ).closest( '.sp-selectable' ).length >= 1 ) {
				return;
			}

			var that = this,
				eventObject = typeof event.originalEvent.touches !== 'undefined' ? event.originalEvent.touches[0] : event.originalEvent;

			// Prevent default behavior only for mouse events
			if ( typeof event.originalEvent.touches === 'undefined' ) {
				event.preventDefault();
			}

			// Disable click events on links
			$( event.target ).parents( '.sp-slide' ).find( 'a' ).one( 'click.' + NS, function( event ) {
				event.preventDefault();
			});

			// Get the initial position of the mouse pointer and the initial position
			// of the slides' container
			this.touchStartPoint.x = eventObject.pageX || eventObject.clientX;
			this.touchStartPoint.y = eventObject.pageY || eventObject.clientY;
			this.touchStartPosition = this.slidesPosition;

			// Clear the previous distance values
			this.touchDistance.x = this.touchDistance.y = 0;

			// If the slides are being grabbed while they're still animating, stop the
			// current movement
			if ( this.$slides.hasClass( 'sp-animated' ) ) {
				this.isTouchMoving = true;
				this._stopMovement();
				this.touchStartPosition = this.slidesPosition;
			}

			// Listen for move and end events
			this.$slidesMask.on( this.touchSwipeEvents.moveEvent, $.proxy( this._onTouchMove, this ) );
			$( document ).on( this.touchSwipeEvents.endEvent, $.proxy( this._onTouchEnd, this ) );

			// Swap grabbing icons
			this.$slidesMask.removeClass( 'sp-grab' ).addClass( 'sp-grabbing' );

			// Add 'sp-swiping' class to indicate that the slides are being swiped
			this.$slider.addClass( 'sp-swiping' );
		},

		// Called during the slides' dragging
		_onTouchMove: function( event ) {
			var eventObject = typeof event.originalEvent.touches !== 'undefined' ? event.originalEvent.touches[0] : event.originalEvent;

			// Indicate that the move event is being fired
			this.isTouchMoving = true;

			// Get the current position of the mouse pointer
			this.touchEndPoint.x = eventObject.pageX || eventObject.clientX;
			this.touchEndPoint.y = eventObject.pageY || eventObject.clientY;

			// Calculate the distance of the movement on both axis
			this.touchDistance.x = this.touchEndPoint.x - this.touchStartPoint.x;
			this.touchDistance.y = this.touchEndPoint.y - this.touchStartPoint.y;
			
			// Calculate the distance of the swipe that takes place in the same direction as the orientation of the slides
			// and calculate the distance from the opposite direction.
			// 
			// For a swipe to be valid there should more distance in the same direction as the orientation of the slides.
			var distance = this.settings.orientation === 'horizontal' ? this.touchDistance.x : this.touchDistance.y,
				oppositeDistance = this.settings.orientation === 'horizontal' ? this.touchDistance.y : this.touchDistance.x;

			// If the movement is in the same direction as the orientation of the slides, the swipe is valid
			if ( Math.abs( distance ) > Math.abs( oppositeDistance ) ) {
				event.preventDefault();
			} else {
				return;
			}

			if ( this.settings.loop === false ) {
				// Make the slides move slower if they're dragged outside its bounds
				if ( ( this.slidesPosition > this.touchStartPosition && this.selectedSlideIndex === 0 ) ||
					( this.slidesPosition < this.touchStartPosition && this.selectedSlideIndex === this.getTotalSlides() - 1 )
				) {
					distance = distance * 0.2;
				}
			}

			this._moveTo( this.touchStartPosition + distance, true );
		},

		// Called when the slides are released
		_onTouchEnd: function( event ) {
			var that = this,
				touchDistance = this.settings.orientation === 'horizontal' ? this.touchDistance.x : this.touchDistance.y;

			// Remove the move and end listeners
			this.$slidesMask.off( this.touchSwipeEvents.moveEvent );
			$( document ).off( this.touchSwipeEvents.endEvent );

			// Swap grabbing icons
			this.$slidesMask.removeClass( 'sp-grabbing' ).addClass( 'sp-grab' );

			// Check if there is intention for a tap
			if ( this.isTouchMoving === false || this.isTouchMoving === true && Math.abs( this.touchDistance.x ) < 10 && Math.abs( this.touchDistance.y ) < 10 ) {
				// Re-enable click events on links
				$( event.target ).parents( '.sp-slide' ).find( 'a' ).off( 'click.' + NS );
				this.$slider.removeClass( 'sp-swiping' );
			}

			// Remove the 'sp-swiping' class but with a delay
			// because there might be other event listeners that check
			// the existence of this class, and this class should still be 
			// applied for those listeners, since there was a swipe event
			setTimeout(function() {
				that.$slider.removeClass( 'sp-swiping' );
			}, 1 );

			// Return if the slides didn't move
			if ( this.isTouchMoving === false ) {
				return;
			}

			this.isTouchMoving = false;

			$( event.target ).parents( '.sp-slide' ).one( 'click', function( event ) {
				event.preventDefault();
			});

			// Calculate the old position of the slides in order to return to it if the swipe
			// is below the threshold
			var oldSlidesPosition = - parseInt( this.$slides.find( '.sp-slide' ).eq( this.selectedSlideIndex ).css( this.positionProperty ), 10 ) + this.visibleOffset;

			if ( Math.abs( touchDistance ) < this.settings.touchSwipeThreshold ) {
				this._moveTo( oldSlidesPosition );
			} else {

				// Calculate by how many slides the slides container has moved
				var slideArrayDistance = touchDistance / ( this.slideSize + this.settings.slideDistance );

				// Floor the obtained value and add or subtract 1, depending on the direction of the swipe
				slideArrayDistance = parseInt( slideArrayDistance, 10 ) + ( slideArrayDistance > 0 ? 1 : - 1 );

				// Get the index of the currently selected slide and subtract the position index in order to obtain
				// the new index of the selected slide. 
				var nextSlideIndex = this.slidesOrder[ $.inArray( this.selectedSlideIndex, this.slidesOrder ) - slideArrayDistance ];

				if ( this.settings.loop === true ) {
					this.gotoSlide( nextSlideIndex );
				} else {
					if ( typeof nextSlideIndex !== 'undefined' ) {
						this.gotoSlide( nextSlideIndex );
					} else {
						this._moveTo( oldSlidesPosition );
					}
				}
			}
		},

		// Destroy the module
		destroyTouchSwipe: function() {
			this.$slidesMask.off( this.touchSwipeEvents.startEvent );
			this.$slidesMask.off( this.touchSwipeEvents.moveEvent );
			this.$slidesMask.off( 'dragstart.' + NS );
			$( document ).off( this.touchSwipeEvents.endEvent );
			this.$slidesMask.removeClass( 'sp-grab' );
		},

		touchSwipeDefaults: {
			
			// Indicates whether the touch swipe will be enabled
			touchSwipe: true,

			// Sets the minimum amount that the slides should move
			touchSwipeThreshold: 50
		}
	};

	$.SliderPro.addModule( 'TouchSwipe', TouchSwipe );
	
})( window, jQuery );