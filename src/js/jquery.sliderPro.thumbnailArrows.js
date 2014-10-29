// Thumbnail Arrows module for Slider Pro.
// 
// Adds thumbnail arrows for moving the thumbnail scroller.
;(function( window, $ ) {

	"use strict";
	
	var NS = 'ThumbnailArrows.' + $.SliderPro.namespace;

	var ThumbnailArrows = {

		// Reference to the arrows container
		$thumbnailArrows: null,

		// Reference to the 'previous' thumbnail arrow
		$previousThumbnailArrow: null,

		// Reference to the 'next' thumbnail arrow
		$nextThumbnailArrow: null,

		initThumbnailArrows: function() {
			var that = this;

			this.on( 'update.' + NS, $.proxy( this._thumbnailArrowsOnUpdate, this ) );
			
			// Check if the arrows need to be visible or invisible when the thumbnail scroller
			// resizes and when the thumbnail scroller moves.
			this.on( 'sliderResize.' + NS + ' ' + 'thumbnailsMoveComplete.' + NS, function() {
				if ( that.isThumbnailScroller === true && that.settings.thumbnailArrows === true ) {
					that._checkThumbnailArrowsVisibility();
				}
			});
		},
		
		// Called when the slider is updated
		_thumbnailArrowsOnUpdate: function() {
			var that = this;
			
			if ( this.isThumbnailScroller === false ) {
				return;
			}

			// Create or remove the thumbnail scroller arrows
			if ( this.settings.thumbnailArrows === true && this.$thumbnailArrows === null ) {
				this.$thumbnailArrows = $( '<div class="sp-thumbnail-arrows"></div>' ).appendTo( this.$thumbnailsContainer );
				
				this.$previousThumbnailArrow = $( '<div class="sp-thumbnail-arrow sp-previous-thumbnail-arrow"></div>' ).appendTo( this.$thumbnailArrows );
				this.$nextThumbnailArrow = $( '<div class="sp-thumbnail-arrow sp-next-thumbnail-arrow"></div>' ).appendTo( this.$thumbnailArrows );

				this.$previousThumbnailArrow.on( 'click.' + NS, function() {
					var previousPosition = Math.min( 0, that.thumbnailsPosition + that.thumbnailsContainerSize );
					that._moveThumbnailsTo( previousPosition );
				});

				this.$nextThumbnailArrow.on( 'click.' + NS, function() {
					var nextPosition = Math.max( that.thumbnailsContainerSize - that.thumbnailsSize, that.thumbnailsPosition - that.thumbnailsContainerSize );
					that._moveThumbnailsTo( nextPosition );
				});
			} else if ( this.settings.thumbnailArrows === false && this.$thumbnailArrows !== null ) {
				this._removeThumbnailArrows();
			}

			// Add fading functionality and check if the arrows need to be visible or not
			if ( this.settings.thumbnailArrows === true ) {
				if ( this.settings.fadeThumbnailArrows === true ) {
					this.$thumbnailArrows.addClass( 'sp-fade-thumbnail-arrows' );
				} else if ( this.settings.fadeThumbnailArrows === false ) {
					this.$thumbnailArrows.removeClass( 'sp-fade-thumbnail-arrows' );
				}

				this._checkThumbnailArrowsVisibility();
			}
		},

		// Checks if the 'next' or 'previous' arrows need to be visible or hidden,
		// based on the position of the thumbnail scroller
		_checkThumbnailArrowsVisibility: function() {
			if ( this.thumbnailsPosition === 0 ) {
				this.$previousThumbnailArrow.css( 'display', 'none' );
			} else {
				this.$previousThumbnailArrow.css( 'display', 'block' );
			}

			if ( this.thumbnailsPosition === this.thumbnailsContainerSize - this.thumbnailsSize ) {
				this.$nextThumbnailArrow.css( 'display', 'none' );
			} else {
				this.$nextThumbnailArrow.css( 'display', 'block' );
			}
		},

		// Remove the thumbnail arrows
		_removeThumbnailArrows: function() {
			if ( this.$thumbnailArrows !== null ) {
				this.$previousThumbnailArrow.off( 'click.' + NS );
				this.$nextThumbnailArrow.off( 'click.' + NS );
				this.$thumbnailArrows.remove();
				this.$thumbnailArrows = null;
			}
		},

		// Destroy the module
		destroyThumbnailArrows: function() {
			this._removeThumbnailArrows();
			this.off( 'update.' + NS );
			this.off( 'sliderResize.' + NS );
			this.off( 'thumbnailsMoveComplete.' + NS );
		},

		thumbnailArrowsDefaults: {

			// Indicates whether the thumbnail arrows will be enabled
			thumbnailArrows: false,

			// Indicates whether the thumbnail arrows will be faded
			fadeThumbnailArrows: true
		}
	};

	$.SliderPro.addModule( 'ThumbnailArrows', ThumbnailArrows );

})( window, jQuery );