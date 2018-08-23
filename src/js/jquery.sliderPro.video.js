// Video module for Slider Pro
//
// Adds automatic control for several video players and providers
;(function( window, $ ) {

	"use strict";

	var NS = 'Video.' + $.SliderPro.namespace;
	
	var Video = {

		firstInit: false,

		initVideo: function() {
			this.on( 'update.' + NS, $.proxy( this._videoOnUpdate, this ) );
			this.on( 'gotoSlide.' + NS, $.proxy( this._videoOnGotoSlide, this ) );
			this.on( 'gotoSlideComplete.' + NS, $.proxy( this._videoOnGotoSlideComplete, this ) );
		},

		_videoOnUpdate: function() {
			var that = this;

			// Find all the inline videos and initialize them
			this.$slider.find( '.sp-video' ).not( 'a, [data-video-init]' ).each(function() {
				var video = $( this );
				that._initVideo( video );
			});

			// Find all the lazy-loaded videos and preinitialize them. They will be initialized
			// only when their play button is clicked.
			this.$slider.find( 'a.sp-video' ).not( '[data-video-preinit]' ).each(function() {
				var video = $( this );
				that._preinitVideo( video );
			});

			// call the 'gotoSlideComplete' method in case the first slide contains a video that
			// needs to play automatically
			if ( this.firstInit === false ) {
				this.firstInit = true;
				this._videoOnGotoSlideComplete({ index: this.selectedSlideIndex, previousIndex: -1 });
			}
		},

		// Initialize the target video
		_initVideo: function( video ) {
			var that = this;

			video.attr( 'data-video-init', true )
				.videoController();

			// When the video starts playing, pause the autoplay if it's running
			video.on( 'videoPlay.' + NS, function() {
				if ( that.settings.playVideoAction === 'stopAutoplay' && typeof that.stopAutoplay !== 'undefined' ) {
					that.stopAutoplay();
					that.settings.autoplay = false;
				}

				// Fire the 'videoPlay' event
				var eventObject = { type: 'videoPlay', video: video };
				that.trigger( eventObject );
				if ( $.isFunction( that.settings.videoPlay ) ) {
					that.settings.videoPlay.call( that, eventObject );
				}
			});

			// When the video is paused, restart the autoplay
			video.on( 'videoPause.' + NS, function() {
				if ( that.settings.pauseVideoAction === 'startAutoplay' && typeof that.startAutoplay !== 'undefined' ) {
					that.stopAutoplay();
					that.startAutoplay();
					that.settings.autoplay = true;
				}

				// Fire the 'videoPause' event
				var eventObject = { type: 'videoPause', video: video };
				that.trigger( eventObject );
				if ( $.isFunction( that.settings.videoPause ) ) {
					that.settings.videoPause.call( that, eventObject );
				}
			});

			// When the video ends, restart the autoplay (which was paused during the playback), or
			// go to the next slide, or replay the video
			video.on( 'videoEnded.' + NS, function() {
				if ( that.settings.endVideoAction === 'startAutoplay' && typeof that.startAutoplay !== 'undefined' ) {
					that.stopAutoplay();
					that.startAutoplay();
					that.settings.autoplay = true;
				} else if ( that.settings.endVideoAction === 'nextSlide' ) {
					that.nextSlide();
				} else if ( that.settings.endVideoAction === 'replayVideo' ) {
					video.videoController( 'replay' );
				}

				// Fire the 'videoEnd' event
				var eventObject = { type: 'videoEnd', video: video };
				that.trigger( eventObject );
				if ( $.isFunction(that.settings.videoEnd ) ) {
					that.settings.videoEnd.call( that, eventObject );
				}
			});
		},

		// Pre-initialize the video. This is for lazy loaded videos.
		_preinitVideo: function( video ) {
			var that = this;

			video.attr( 'data-video-preinit', true );

			// When the video poster is clicked, remove the poster and create
			// the inline video
			video.on( 'click.' + NS, function( event ) {

				// If the video is being dragged, don't start the video
				if ( that.$slider.hasClass( 'sp-swiping' ) ) {
					return;
				}

				event.preventDefault();

				var href = video.attr( 'href' ),
					iframe,
					provider,
					regExp,
					match,
					id,
					src,
					videoAttributes,
					videoWidth = video.children( 'img' ).attr( 'width' ) || video.children( 'img' ).width(),
					videoHeight = video.children( 'img' ).attr( 'height') || video.children( 'img' ).height();

				// Check if it's a youtube or vimeo video
				if ( href.indexOf( 'youtube' ) !== -1 || href.indexOf( 'youtu.be' ) !== -1 ) {
					provider = 'youtube';
				} else if ( href.indexOf( 'vimeo' ) !== -1 ) {
					provider = 'vimeo';
				}

				// Get the id of the video
				regExp = provider === 'youtube' ? /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/ : /http:\/\/(www\.)?vimeo.com\/(\d+)/;
				match = href.match( regExp );
				id = match[2];

				// Get the source of the iframe that will be created
				src = provider === 'youtube' ? '//www.youtube.com/embed/' + id + '?enablejsapi=1&wmode=opaque' : '//player.vimeo.com/video/'+ id;
				
				// Get the attributes passed to the video link and then pass them to the iframe's src
				videoAttributes = href.split( '?' )[ 1 ];

				if ( typeof videoAttributes !== 'undefined' ) {
					videoAttributes = videoAttributes.split( '&' );

					$.each( videoAttributes, function( index, value ) {
						if ( value.indexOf( id ) === -1 ) {
							src += '&' + value;
						}
					});
				}

				// Create the iframe
				iframe = $( '<iframe></iframe>' )
					.attr({
						'src': src,
						'width': videoWidth,
						'height': videoHeight,
						'class': video.attr( 'class' ),
						'frameborder': 0,
						'allowfullscreen': 'allowfullscreen'
					}).insertBefore( video );

				// Initialize the video and play it
				that._initVideo( iframe );
				iframe.videoController( 'play' );

				// Hide the video poster
				video.css( 'display', 'none' );
			});
		},

		// Called when a new slide is selected
		_videoOnGotoSlide: function( event ) {

			// Get the video from the previous slide
			var previousVideo = this.$slides.find( '.sp-slide' ).eq( event.previousIndex ).find( '.sp-video[data-video-init]' );

			// Handle the video from the previous slide by stopping it, or pausing it,
			// or remove it, depending on the value of the 'leaveVideoAction' option.
			if ( event.previousIndex !== -1 && previousVideo.length !== 0 ) {
				if ( this.settings.leaveVideoAction === 'stopVideo' ) {
					previousVideo.videoController( 'stop' );
				} else if ( this.settings.leaveVideoAction === 'pauseVideo' ) {
					previousVideo.videoController( 'pause' );
				} else if ( this.settings.leaveVideoAction === 'removeVideo'  ) {
					// If the video was lazy-loaded, remove it and show the poster again. If the video
					// was not lazy-loaded, but inline, stop the video.
					if ( previousVideo.siblings( 'a.sp-video' ).length !== 0 ) {
						previousVideo.siblings( 'a.sp-video' ).css( 'display', '' );
						previousVideo.videoController( 'destroy' );
						previousVideo.remove();
					} else {
						previousVideo.videoController( 'stop' );
					}
				}
			}
		},

		// Called when a new slide is selected, 
		// after the transition animation is complete.
		_videoOnGotoSlideComplete: function( event ) {

			// Handle the video from the selected slide
			if ( this.settings.reachVideoAction === 'playVideo' && event.index === this.selectedSlideIndex ) {
				var loadedVideo = this.$slides.find( '.sp-slide' ).eq( event.index ).find( '.sp-video[data-video-init]' ),
					unloadedVideo = this.$slides.find( '.sp-slide' ).eq( event.index ).find( '.sp-video[data-video-preinit]' );

				// If the video was already initialized, play it. If it's not initialized (because
				// it's lazy loaded) initialize it and play it.
				if ( loadedVideo.length !== 0 ) {
					loadedVideo.videoController( 'play' );
				} else if ( unloadedVideo.length !== 0 ) {
					unloadedVideo.trigger( 'click.' + NS );
				}

				// Autoplay is stopped when the video starts playing
				// and the video's 'play' event is fired, but on slower connections,
				// the video's playing will be delayed and the 'play' event
				// will not fire in time to stop the autoplay, so we'll
				// stop it here as well.
				if ( ( loadedVideo.length !== 0 || unloadedVideo.length !== 0 ) && this.settings.playVideoAction === 'stopAutoplay' && typeof this.stopAutoplay !== 'undefined' ) {
					this.stopAutoplay();
					this.settings.autoplay = false;
				}
			}
		},

		// Destroy the module
		destroyVideo: function() {
			this.$slider.find( '.sp-video[ data-video-preinit ]' ).each(function() {
				var video = $( this );
				video.removeAttr( 'data-video-preinit' );
				video.off( 'click.' + NS );
			});

			// Loop through the all the videos and destroy them
			this.$slider.find( '.sp-video[ data-video-init ]' ).each(function() {
				var video = $( this );
				video.removeAttr( 'data-video-init' );
				video.off( 'Video' );
				video.videoController( 'destroy' );
			});

			this.off( 'update.' + NS );
			this.off( 'gotoSlide.' + NS );
			this.off( 'gotoSlideComplete.' + NS );
		},

		videoDefaults: {

			// Sets the action that the video will perform when its slide container is selected
			// ( 'playVideo' and 'none' )
			reachVideoAction: 'none',

			// Sets the action that the video will perform when another slide is selected
			// ( 'stopVideo', 'pauseVideo', 'removeVideo' and 'none' )
			leaveVideoAction: 'pauseVideo',

			// Sets the action that the slider will perform when the video starts playing
			// ( 'stopAutoplay' and 'none' )
			playVideoAction: 'stopAutoplay',

			// Sets the action that the slider will perform when the video is paused
			// ( 'startAutoplay' and 'none' )
			pauseVideoAction: 'none',

			// Sets the action that the slider will perform when the video ends
			// ( 'startAutoplay', 'nextSlide', 'replayVideo' and 'none' )
			endVideoAction: 'none',

			// Called when the video starts playing
			videoPlay: function() {},

			// Called when the video is paused
			videoPause: function() {},

			// Called when the video ends
			videoEnd: function() {}
		}
	};

	$.SliderPro.addModule( 'Video', Video );
	
})( window, jQuery );

// Video Controller jQuery plugin
// Creates a universal controller for multiple video types and providers
;(function( $ ) {

	"use strict";

// Check if an iOS device is used.
// This information is important because a video can not be
// controlled programmatically unless the user has started the video manually.
var	isIOS = window.navigator.userAgent.match( /(iPad|iPhone|iPod)/g ) ? true : false;

var VideoController = function( instance, options ) {
	this.$video = $( instance );
	this.options = options;
	this.settings = {};
	this.player = null;

	this._init();
};

VideoController.prototype = {

	_init: function() {
		this.settings = $.extend( {}, this.defaults, this.options );

		var that = this,
			players = $.VideoController.players,
			videoID = this.$video.attr( 'id' );

		// Loop through the available video players
		// and check if the targeted video element is supported by one of the players.
		// If a compatible type is found, store the video type.
		for ( var name in players ) {
			if ( typeof players[ name ] !== 'undefined' && players[ name ].isType( this.$video ) ) {
				this.player = new players[ name ]( this.$video );
				break;
			}
		}

		// Return if the player could not be instantiated
		if ( this.player === null ) {
			return;
		}

		// Add event listeners
		var events = [ 'ready', 'start', 'play', 'pause', 'ended' ];
		
		$.each( events, function( index, element ) {
			var event = 'video' + element.charAt( 0 ).toUpperCase() + element.slice( 1 );

			that.player.on( element, function() {
				that.trigger({ type: event, video: videoID });
				if ( $.isFunction( that.settings[ event ] ) ) {
					that.settings[ event ].call( that, { type: event, video: videoID } );
				}
			});
		});
	},
	
	play: function() {
		if ( isIOS === true && this.player.isStarted() === false || this.player.getState() === 'playing' ) {
			return;
		}

		this.player.play();
	},
	
	stop: function() {
		if ( isIOS === true && this.player.isStarted() === false || this.player.getState() === 'stopped' ) {
			return;
		}

		this.player.stop();
	},
	
	pause: function() {
		if ( isIOS === true && this.player.isStarted() === false || this.player.getState() === 'paused' ) {
			return;
		}

		this.player.pause();
	},

	replay: function() {
		if ( isIOS === true && this.player.isStarted() === false ) {
			return;
		}
		
		this.player.replay();
	},

	on: function( type, callback ) {
		return this.$video.on( type, callback );
	},
	
	off: function( type ) {
		return this.$video.off( type );
	},

	trigger: function( data ) {
		return this.$video.triggerHandler( data );
	},

	destroy: function() {
		if ( this.player.isStarted() === true ) {
			this.stop();
		}

		this.player.off( 'ready' );
		this.player.off( 'start' );
		this.player.off( 'play' );
		this.player.off( 'pause' );
		this.player.off( 'ended' );

		this.$video.removeData( 'videoController' );
	},

	defaults: {
		videoReady: function() {},
		videoStart: function() {},
		videoPlay: function() {},
		videoPause: function() {},
		videoEnded: function() {}
	}
};

$.VideoController = {
	players: {},

	addPlayer: function( name, player ) {
		this.players[ name ] = player;
	}
};

$.fn.videoController = function( options ) {
	var args = Array.prototype.slice.call( arguments, 1 );

	return this.each(function() {
		// Instantiate the video controller or call a function on the current instance
		if ( typeof $( this ).data( 'videoController' ) === 'undefined' ) {
			var newInstance = new VideoController( this, options );

			// Store a reference to the instance created
			$( this ).data( 'videoController', newInstance );
		} else if ( typeof options !== 'undefined' ) {
			var	currentInstance = $( this ).data( 'videoController' );

			// Check the type of argument passed
			if ( typeof currentInstance[ options ] === 'function' ) {
				currentInstance[ options ].apply( currentInstance, args );
			} else {
				$.error( options + ' does not exist in videoController.' );
			}
		}
	});
};

// Base object for the video players
var Video = function( video ) {
	this.$video = video;
	this.player = null;
	this.ready = false;
	this.started = false;
	this.state = '';
	this.events = $({});

	this._init();
};

Video.prototype = {
	_init: function() {},

	play: function() {},

	pause: function() {},

	stop: function() {},

	replay: function() {},

	isType: function() {},

	isReady: function() {
		return this.ready;
	},

	isStarted: function() {
		return this.started;
	},

	getState: function() {
		return this.state;
	},

	on: function( type, callback ) {
		return this.events.on( type, callback );
	},
	
	off: function( type ) {
		return this.events.off( type );
	},

	trigger: function( data ) {
		return this.events.triggerHandler( data );
	}
};

// YouTube video
var YoutubeVideoHelper = {
	youtubeAPIAdded: false,
	youtubeVideos: []
};

var YoutubeVideo = function( video ) {
	this.init = false;
	var youtubeAPILoaded = window.YT && window.YT.Player;

	if ( typeof youtubeAPILoaded !== 'undefined' ) {
		Video.call( this, video );
	} else {
		YoutubeVideoHelper.youtubeVideos.push({ 'video': video, 'scope': this });
		
		if ( YoutubeVideoHelper.youtubeAPIAdded === false ) {
			YoutubeVideoHelper.youtubeAPIAdded = true;

			var tag = document.createElement( 'script' );
			tag.src = "//www.youtube.com/player_api";
			var firstScriptTag = document.getElementsByTagName( 'script' )[0];
			firstScriptTag.parentNode.insertBefore( tag, firstScriptTag );

			window.onYouTubePlayerAPIReady = function() {
				$.each( YoutubeVideoHelper.youtubeVideos, function( index, element ) {
					Video.call( element.scope, element.video );
				});
			};
		}
	}
};

YoutubeVideo.prototype = new Video();
YoutubeVideo.prototype.constructor = YoutubeVideo;
$.VideoController.addPlayer( 'YoutubeVideo', YoutubeVideo );

YoutubeVideo.isType = function( video ) {
	if ( video.is( 'iframe' ) ) {
		var src = video.attr( 'src' );

		if ( src.indexOf( 'youtube.com' ) !== -1 || src.indexOf( 'youtu.be' ) !== -1 ) {
			return true;
		}
	}

	return false;
};

YoutubeVideo.prototype._init = function() {
	this.init = true;
	this._setup();
};
	
YoutubeVideo.prototype._setup = function() {
	var that = this;

	// Get a reference to the player
	this.player = new YT.Player( this.$video[0], {
		events: {
			'onReady': function() {
				that.trigger({ type: 'ready' });
				that.ready = true;
			},
			
			'onStateChange': function( event ) {
				switch ( event.data ) {
					case YT.PlayerState.PLAYING:
						if (that.started === false) {
							that.started = true;
							that.trigger({ type: 'start' });
						}

						that.state = 'playing';
						that.trigger({ type: 'play' });
						break;
					
					case YT.PlayerState.PAUSED:
						that.state = 'paused';
						that.trigger({ type: 'pause' });
						break;
					
					case YT.PlayerState.ENDED:
						that.state = 'ended';
						that.trigger({ type: 'ended' });
						break;
				}
			}
		}
	});
};

YoutubeVideo.prototype.play = function() {
	var that = this;

	if ( this.ready === true ) {
		this.player.playVideo();
	} else {
		var timer = setInterval(function() {
			if ( that.ready === true ) {
				clearInterval( timer );
				that.player.playVideo();
			}
		}, 100 );
	}
};

YoutubeVideo.prototype.pause = function() {
	// On iOS, simply pausing the video can make other videos unresponsive
	// so we stop the video instead.
	if ( isIOS === true ) {
		this.stop();
	} else {
		this.player.pauseVideo();
	}
};

YoutubeVideo.prototype.stop = function() {
	this.player.seekTo( 1 );
	this.player.stopVideo();
	this.state = 'stopped';
};

YoutubeVideo.prototype.replay = function() {
	this.player.seekTo( 1 );
	this.player.playVideo();
};

YoutubeVideo.prototype.on = function( type, callback ) {
	var that = this;

	if ( this.init === true ) {
		Video.prototype.on.call( this, type, callback );
	} else {
		var timer = setInterval(function() {
			if ( that.init === true ) {
				clearInterval( timer );
				Video.prototype.on.call( that, type, callback );
			}
		}, 100 );
	}
};

// Vimeo video
var VimeoVideoHelper = {
	vimeoAPIAdded: false,
	vimeoVideos: []
};

var VimeoVideo = function( video ) {
	this.init = false;

	if ( typeof window.Vimeo !== 'undefined' ) {
		Video.call( this, video );
	} else {
		VimeoVideoHelper.vimeoVideos.push({ 'video': video, 'scope': this });

		if ( VimeoVideoHelper.vimeoAPIAdded === false ) {
			VimeoVideoHelper.vimeoAPIAdded = true;

			var tag = document.createElement('script');
			tag.src = "//player.vimeo.com/api/player.js";
			var firstScriptTag = document.getElementsByTagName( 'script' )[0];
			firstScriptTag.parentNode.insertBefore( tag, firstScriptTag );
		
			var checkVimeoAPITimer = setInterval(function() {
				if ( typeof window.Vimeo !== 'undefined' ) {
					clearInterval( checkVimeoAPITimer );
					
					$.each( VimeoVideoHelper.vimeoVideos, function( index, element ) {
						Video.call( element.scope, element.video );
					});
				}
			}, 100 );
		}
	}
};

VimeoVideo.prototype = new Video();
VimeoVideo.prototype.constructor = VimeoVideo;
$.VideoController.addPlayer( 'VimeoVideo', VimeoVideo );

VimeoVideo.isType = function( video ) {
	if ( video.is( 'iframe' ) ) {
		var src = video.attr('src');

		if ( src.indexOf( 'vimeo.com' ) !== -1 ) {
			return true;
		}
	}

	return false;
};

VimeoVideo.prototype._init = function() {
	this.init = true;
	this._setup();
};

VimeoVideo.prototype._setup = function() {
	var that = this;

	// Get a reference to the player
	this.player = new Vimeo.Player( this.$video[0] );
	
	that.ready = true;
	that.trigger({ type: 'ready' });
		
	that.player.on( 'play', function() {
		if ( that.started === false ) {
			that.started = true;
			that.trigger({ type: 'start' });
		}

		that.state = 'playing';
		that.trigger({ type: 'play' });
	});
		
	that.player.on( 'pause', function() {
		that.state = 'paused';
		that.trigger({ type: 'pause' });
	});
		
	that.player.on( 'ended', function() {
		that.state = 'ended';
		that.trigger({ type: 'ended' });
	});
};

VimeoVideo.prototype.play = function() {
	var that = this;
 
    if ( this.ready === true ) {
        this.player.play();
    } else {
        var timer = setInterval(function() {
            if ( that.ready === true ) {
                clearInterval( timer );
                that.player.play();
            }
        }, 100 );
    }
};

VimeoVideo.prototype.pause = function() {
	this.player.pause();
};

VimeoVideo.prototype.stop = function() {
	var that = this;

	this.player.setCurrentTime( 0 ).then( function() {
		that.player.pause();
		that.state = 'stopped';
	} );
};

VimeoVideo.prototype.replay = function() {
	var that = this;

	this.player.setCurrentTime( 0 ).then( function() {
		that.player.play();
	} );
};

VimeoVideo.prototype.on = function( type, callback ) {
	var that = this;

	if ( this.init === true ) {
		Video.prototype.on.call( this, type, callback );
	} else {
		var timer = setInterval(function() {
			if ( that.init === true ) {
				clearInterval( timer );
				Video.prototype.on.call( that, type, callback );
			}
		}, 100 );
	}
};

// HTML5 video
var HTML5Video = function( video ) {
	Video.call( this, video );
};

HTML5Video.prototype = new Video();
HTML5Video.prototype.constructor = HTML5Video;
$.VideoController.addPlayer( 'HTML5Video', HTML5Video );

HTML5Video.isType = function( video ) {
	if ( video.is( 'video' ) && video.hasClass( 'video-js' ) === false && video.hasClass( 'sublime' ) === false ) {
		return true;
	}

	return false;
};

HTML5Video.prototype._init = function() {
	var that = this;

	// Get a reference to the player
	this.player = this.$video[0];
	
	var checkVideoReady = setInterval(function() {
		if ( that.player.readyState === 4 ) {
			clearInterval( checkVideoReady );

			that.ready = true;
			that.trigger({ type: 'ready' });

			that.player.addEventListener( 'play', function() {
				if ( that.started === false ) {
					that.started = true;
					that.trigger({ type: 'start' });
				}

				that.state = 'playing';
				that.trigger({ type: 'play' });
			});
			
			that.player.addEventListener( 'pause', function() {
				that.state = 'paused';
				that.trigger({ type: 'pause' });
			});
			
			that.player.addEventListener( 'ended', function() {
				that.state = 'ended';
				that.trigger({ type: 'ended' });
			});
		}
	}, 100 );
};

HTML5Video.prototype.play = function() {
	var that = this;

	if ( this.ready === true ) {
		this.player.play();
	} else {
		var timer = setInterval(function() {
			if ( that.ready === true ) {
				clearInterval( timer );
				that.player.play();
			}
		}, 100 );
	}
};

HTML5Video.prototype.pause = function() {
	this.player.pause();
};

HTML5Video.prototype.stop = function() {
	this.player.currentTime = 0;
	this.player.pause();
	this.state = 'stopped';
};

HTML5Video.prototype.replay = function() {
	this.player.currentTime = 0;
	this.player.play();
};

// VideoJS video
var VideoJSVideo = function( video ) {
	Video.call( this, video );
};

VideoJSVideo.prototype = new Video();
VideoJSVideo.prototype.constructor = VideoJSVideo;
$.VideoController.addPlayer( 'VideoJSVideo', VideoJSVideo );

VideoJSVideo.isType = function( video ) {
	if ( ( typeof video.attr( 'data-videojs-id' ) !== 'undefined' || video.hasClass( 'video-js' ) ) && typeof videojs !== 'undefined' ) {
		return true;
	}

	return false;
};

VideoJSVideo.prototype._init = function() {
	var that = this,
		videoID = this.$video.hasClass( 'video-js' ) ? this.$video.attr( 'id' ) : this.$video.attr( 'data-videojs-id' );
	
	this.player = videojs( videoID );

	this.player.ready(function() {
		that.ready = true;
		that.trigger({ type: 'ready' });

		that.player.on( 'play', function() {
			if ( that.started === false ) {
				that.started = true;
				that.trigger({ type: 'start' });
			}

			that.state = 'playing';
			that.trigger({ type: 'play' });
		});
		
		that.player.on( 'pause', function() {
			that.state = 'paused';
			that.trigger({ type: 'pause' });
		});
		
		that.player.on( 'ended', function() {
			that.state = 'ended';
			that.trigger({ type: 'ended' });
		});
	});
};

VideoJSVideo.prototype.play = function() {
	this.player.play();
};

VideoJSVideo.prototype.pause = function() {
	this.player.pause();
};

VideoJSVideo.prototype.stop = function() {
	this.player.currentTime( 0 );
	this.player.pause();
	this.state = 'stopped';
};

VideoJSVideo.prototype.replay = function() {
	this.player.currentTime( 0 );
	this.player.play();
};

// Sublime video
var SublimeVideo = function( video ) {
	Video.call( this, video );
};

SublimeVideo.prototype = new Video();
SublimeVideo.prototype.constructor = SublimeVideo;
$.VideoController.addPlayer( 'SublimeVideo', SublimeVideo );

SublimeVideo.isType = function( video ) {
	if ( video.hasClass( 'sublime' ) && typeof sublime !== 'undefined' ) {
		return true;
	}

	return false;
};

SublimeVideo.prototype._init = function() {
	var that = this;

	sublime.ready(function() {
		// Get a reference to the player
		that.player = sublime.player( that.$video.attr( 'id' ) );

		that.ready = true;
		that.trigger({ type: 'ready' });

		that.player.on( 'play', function() {
			if ( that.started === false ) {
				that.started = true;
				that.trigger({ type: 'start' });
			}

			that.state = 'playing';
			that.trigger({ type: 'play' });
		});

		that.player.on( 'pause', function() {
			that.state = 'paused';
			that.trigger({ type: 'pause' });
		});

		that.player.on( 'stop', function() {
			that.state = 'stopped';
			that.trigger({ type: 'stop' });
		});

		that.player.on( 'end', function() {
			that.state = 'ended';
			that.trigger({ type: 'ended' });
		});
	});
};

SublimeVideo.prototype.play = function() {
	this.player.play();
};

SublimeVideo.prototype.pause = function() {
	this.player.pause();
};

SublimeVideo.prototype.stop = function() {
	this.player.stop();
};

SublimeVideo.prototype.replay = function() {
	this.player.stop();
	this.player.play();
};

// JWPlayer video
var JWPlayerVideo = function( video ) {
	Video.call( this, video );
};

JWPlayerVideo.prototype = new Video();
JWPlayerVideo.prototype.constructor = JWPlayerVideo;
$.VideoController.addPlayer( 'JWPlayerVideo', JWPlayerVideo );

JWPlayerVideo.isType = function( video ) {
	if ( ( typeof video.attr( 'data-jwplayer-id' ) !== 'undefined' || video.hasClass( 'jwplayer' ) || video.find( "object[data*='jwplayer']" ).length !== 0 ) &&
		typeof jwplayer !== 'undefined') {
		return true;
	}

	return false;
};

JWPlayerVideo.prototype._init = function() {
	var that = this,
		videoID;

	if ( this.$video.hasClass( 'jwplayer' ) ) {
		videoID = this.$video.attr( 'id' );
	} else if ( typeof this.$video.attr( 'data-jwplayer-id' ) !== 'undefined' ) {
		videoID = this.$video.attr( 'data-jwplayer-id');
	} else if ( this.$video.find( "object[data*='jwplayer']" ).length !== 0 ) {
		videoID = this.$video.find( 'object' ).attr( 'id' );
	}

	// Get a reference to the player
	this.player = jwplayer( videoID );

	this.player.onReady(function() {
		that.ready = true;
		that.trigger({ type: 'ready' });
	
		that.player.onPlay(function() {
			if ( that.started === false ) {
				that.started = true;
				that.trigger({ type: 'start' });
			}

			that.state = 'playing';
			that.trigger({ type: 'play' });
		});

		that.player.onPause(function() {
			that.state = 'paused';
			that.trigger({ type: 'pause' });
		});
		
		that.player.onComplete(function() {
			that.state = 'ended';
			that.trigger({ type: 'ended' });
		});
	});
};

JWPlayerVideo.prototype.play = function() {
	this.player.play( true );
};

JWPlayerVideo.prototype.pause = function() {
	this.player.pause( true );
};

JWPlayerVideo.prototype.stop = function() {
	this.player.stop();
	this.state = 'stopped';
};

JWPlayerVideo.prototype.replay = function() {
	this.player.seek( 0 );
	this.player.play( true );
};

})( jQuery );