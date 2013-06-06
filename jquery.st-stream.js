(function( $ ){

	/// Storyteller Stream Plug-in 0.0.2
	/// Copyright © 2012 Story Arc Corporation · storytellerhq.com

	var loadingInProgress = false,
        scrollingDisabled = false,
		scrollingThreshold,

		methods = {

		initialize: function( options ){
			var options = options || {};

			return this.each( function(){
				var $this = $( this );

				scrollingThreshold = $this.height() + $this.scrollTop();

				$this.data( 'pagination', options.pagination || $this.data('pagination') ) || 'manual';
				$this.data( 'selector', options.selector || $this.data('selector') || 'article' );
				$this.data( 'results-page', options.resultsPage || $this.data('results-page') );

				if(!$this.data( 'results-page' ) && window.console && console.error ){
					console.error('Please provide a URI template for the results page in order to continue.');
					return false;
				}

				$this.stStream('blend');

				if( $this.data( 'pagination') === 'scrolling' ) $this.stStream('scrollToInfinity');

				// Bind passed events
				if( options.events ){
					for( var event in options.events ){
						if( options.events.hasOwnProperty( event ) ){
							var method = options.events[event];
							$this.on( event, method );
						}
					}
				}

			});

		},
		blend: function( data ){

			return this.each( function(){
				var $this = $(this);
				var	$data = data || $this;

				var	$content = $data.children( $this.data('selector') ).clone().sort( function( a, b ) {
						var datetimeA = $(a).data('datetime'),
							datetimeB = $(b).data('datetime');

						if( datetimeA && isNaN(parseInt( datetimeA ) ) ){
							return Date.parse( datetimeB ) - Date.parse( datetimeA );
						} else if( datetimeA ){
							return datetimeB - datetimeA;
						}
					}),
					$nextUrls = $data.children('.nextPage, .totalPages');

				var $blended = $.merge($content, $nextUrls);

				$this.trigger( 'blendStart', $this );

				if( data ){
					return $blended;
				}
				else if( $blended.length > 0 ){
					$this.empty().append( $blended );
    				$this.trigger( 'blend', $this );
				}
				else if( window.console && console.error ){
					console.error('Sorry, no content was found. Please try another selector.');
				}

			});

		},
		nextPage: function(){

            var pagesRemaining = false;

			$(this).each( function(){
				var $this = $(this),
					scrollPosition,
					nextUrls = {},
					values = [];

				// Don't specify elements in selectors below - data.class fails	in IE 8

				$this.find('.nextPage').each(function(){
					var nextPageUrl = $(this).attr('value');
					var query = $(this).stStream( 'parseQuery', nextPageUrl );

					if( nextPageUrl && nextPageUrl.length > 0 && !jQuery.isEmptyObject(query) ){
						nextUrls[ $(this).data('service') ] = query;
						pagesRemaining = true;
					}

					$(this).remove();
				});

				$this.find('.totalPages').each(function(){
					var currentPage = $(this).data('current-page') ? parseInt( $(this).data('current-page') ) : 1,
						perPage = parseInt( $(this).data('per-page') );
					var nextPage = $(this).stStream('calculateNextPage', currentPage, $(this).attr('value'), perPage);

					if( nextPage ){
						nextUrls[ $(this).data('service') ] = { 'page': nextPage };
						pagesRemaining = true;
					}

					$(this).remove();
				});

                if( pagesRemaining === false ){
                    $this.trigger( 'lastPage' );
                } else {
                    var	nextUrl = $this.data('results-page').replace( /[^{]+(?=\})/g, function(segment){
                        var service = segment.split(';').shift(),
                            param = segment.split(';').pop();

						if( nextUrls[service] ){
	                        return nextUrls[service][param] || '99999';
							/* HACK: this value usually returns 0 results.
							   Currently w must provide a value to segments. Later we'll pass parameter values in a query string. */
						} else {
							return '99999';
						}

                    }).replace( /[\{\}]/g, '');

                    $this.trigger( 'loadStart', $this );
                    $this.removeClass('loaded').addClass('loading');

                    loadingInProgress = true;

                    $.ajax({
                        url: nextUrl,
                        dataType: 'html'
                    }).success(function() {
                        scrollPosition = $(window).scrollTop();
                    }).done(function( results ){
                        $this.append( $(results).contents() ).removeClass('loading').addClass('loaded');
                        $this.trigger( 'load', $this );

                        $(window).scrollTop(scrollPosition);

                        scrollingThreshold = $this.height() + $this.scrollTop();
                        loadingInProgress = false;
                    });

                    return $(this);

                }

			});

		},
		parseQuery: function( uri ){
			/// Method adapted from: https://gist.github.com/2588921
			/// Itself a variation of: http://remysharp.com/2008/06/24/query-string-to-object-via-regex

			var query = {}, i = uri.indexOf('?');

			if( i != -1 )
				uri.substr(i+1).replace(/\+/g, ' ').replace( /([^&;=]+)=?([^&;]*)/g, function(m, k, v){
					query[ decodeURIComponent(k) ] = decodeURIComponent(v);
				});

			return query;
		},
		calculateNextPage: function( current, total, perPage ){
			if ((total / perPage) > current) {
				return current + 1;
			} else {
				return false;
			}
		},
		scrollToInfinity: function() {

			return this.each( function(){
				var $this = $(this),
					viewportHeight = $(window).height();

				$(window).resize(function() {
					viewportHeight = $(window).height();
				});

				$(window).scroll(function(data){
					if( scrollingThreshold - 200 < ($(window).scrollTop() + viewportHeight) && loadingInProgress === false )
						$this.stStream('nextPage');
				});

			});

		},
		toggleScrolling: function(){
			/// Method adapted from: http://stackoverflow.com/a/4770179/979684

			function disable(event) {
				event.preventDefault();
			}

			if( scrollingDisabled === false ) {
				if (window.addEventListener) window.addEventListener('DOMMouseScroll', disable, false);
				if (window.attachEvent)	window.attachEvent('DOMMouseScroll', disable);

				scrollingDisabled = true;
			} else {
				if (window.removeEventListener) window.removeEventListener('DOMMouseScroll', disable, false);
				if (window.detachEvent)	window.detachEvent('DOMMouseScroll', disable);

				scrollingDisabled = false;
			}

			$(window).keydown(event, function() {
				var keys = [37, 38, 39, 40]; // left: 37, up: 38, right: 39, down: 40, spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36 */
				if (scrollingDisabled === true && $.inArray(event.keyCode, keys) ) event.preventDefault();
			});

		}

	};

	$.fn.stStream = function( method ){
		if( methods[method] ){
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		}
		else if( typeof method === 'object' || ! method ){
			return methods.initialize.apply( this, arguments );
		}
	};

})( jQuery );