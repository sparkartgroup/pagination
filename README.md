# st-stream

**Present aggregated content as a single blended and paginated stream.**
This jQuery plugin is designed for use in conjunction with the [Storyteller platform][storyteller], but could prove useful anywhere content is paginated by one of these methods:

 - **Numbered pages:** Pages are computed based on available content and accessed sequentially.
 - **Index/Offset:** Increments content by the index of the first content item in each “page” of content.
 - **Cursoring:** Specifies ranges of IDs or timestamps rather than pre-computing “pages” of results.
 - **Token-based:** Associates each page of content with a unique token, provided in each response for use in the next request.

### Popular Examples

<table>
    <thead>
        <tr>
            <th>Service</th>
            <th>Pagination Method</th>
            <th>Pagination Parameter</th>
            <th>Results Parameter</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><a href="http://developers.facebook.com/docs/reference/api/pagination">Facebook</a></td>
            <td>Cursoring</td>
            <td><code>after</code></td>
            <td><code>limit</code></td>
        </tr>
        <tr>
            <td><a href="http://developers.facebook.com/docs/reference/api/pagination">Facebook</a></td>
            <td>Index/Offset</td>
            <td><code>offset</code></td>
            <td><code>limit</code></td>
        </tr>
        <tr>
            <td><a href="http://www.flickr.com/services/api/flickr.photos.getRecent.html">Flickr</a></td>
            <td>Numbered Pages</td>
            <td><code>page</code></td>
            <td><code>per_page</code></td>
        </tr>
        <tr>
            <td><a href="https://developers.google.com/+/api/#pagination">Google+</a></td>
            <td>Token-based</td>
            <td><code>nextPageToken</code></td>
            <td><code>maxResults</code></td>
        </tr>
        <tr>
            <td><a href="http://instagram.com/developer/endpoints#pagination">Instagram</a></td>
            <td>Cursoring</td>
            <td><code>max_id</code></td>
            <td><code>count</code></td>
        </tr>
        <tr>
            <td><a href="http://developers.soundcloud.com/docs#pagination">SoundCloud</a></td>
            <td>Index/Offset</td>
            <td><code>offset</code></td>
            <td><code>limit</code></td>
        </tr>
        <tr>
            <td><a href="http://www.tumblr.com/docs/en/api/v2#posts">Tumblr</a></td>
            <td>Index/Offset</td>
            <td><code>offset</code></td>
            <td><code>limit</code></td>
        </tr>
        <tr>
            <td><a href="https://dev.twitter.com/docs/working-with-timelines">Twitter</a></td>
            <td>Cursoring</td>
            <td><code>max_id</code></td>
            <td><code>count</code></td>
        </tr>
        <tr>
            <td><a href="https://developers.google.com/youtube/2.0/reference#Paging_through_Results">YouTube</a></td>
            <td>Index/Offset</td>
            <td><code>start-index</code></td>
            <td><code>max-results</code></td>
        </tr>
        <tr>
            <td><a href="http://developer.vimeo.com/apis/advanced/methods/vimeo.videos.getAll">Vimeo</a></td>
            <td>Numbered Pages</td>
            <td><code>page</code></td>
            <td><code>per_page</code></td>
        </tr>
    </tbody>
</table>


Setup
--------------------------------------------------------------------------------

**[jQuery 1.5][jquery] or higher is required.**

### Container Markup

The plugin requires instantiated containers to start with a series of recently posted content items in a flat hierarchy. By default it expects to find `<article>` elements, which are automatically blended in reverse chronological order if they have `data-datetime` attributes. These attributes must be set to a date string supported by JavaScript’s `Date.parse` method.

To load additional content, each set of results must include a `<data>` element that provides key variables to the plugin. The service name must also be provided as a `data-service` parameter, matching the name provided in the pagination URL’s URI template.

``` html
<div class="stream" data-results-page="/results?twitter={twitter;max_id}/youtube={youtube;start-index}">
    <article data-datetime="2012-10-01T04:06:33.108Z">
        ···
    </article>
    <data class="nextPage" data-service="twitter" value="https://api.twitter.com/1.1/search/tweets.json?q=the+killers&count=15&max_id=222934460767797251"></data>
    <data class="nextPage" data-service="youtube" value="https://gdata.youtube.com/feeds/api/videos?q=the+killers&start-index=11&max-results=5&orderby=published&v=2"></data>
</div>
```

### Results Page Markup

A dedicated page is required to load new pages of content. It should feature the same kind of content and markup as the original instantiated container’s content, but accept URL parameters that it can pass on to each respective service for requesting additional content. This page should not have any wrapper markup other than a single attribute-less `<div>` container.

``` html
<div>
    <article data-datetime="2012-10-01T04:06:33.108Z">
        ···
    </article>
</div>
```

### Results Page URI Template

A `data-results-page` attribute is required in the container markup that defines a URI template for the results page. Any [pagination variables][#pagination-variables] are indicated where necessary using a `{service-name;parameter-name}` syntax that matches their associated `<data>` elements and the parameters used by each API.

```
data-results-page="/results?twitter={twitter;max_id}&youtube={youtube;start-index}&vimeo={vimeo;page}"
```

When using the numbered page pagination method, specify “page” as the parameter name.

### Blending Results

Note that results aren’t automatically blended, even if `data-datetime` attributes are present. This is to avoid a disorienting “jump” in the page’s scroll position that can be caused when content items with varying heights are re-inserted into the DOM. If strict chronological order is required, or heights are consistent, simply call the [blend method](#blend) on the [load event](#load).


Pagination Variables
--------------------------------------------------------------------------------

### Numbered Page Method

APIs providing numbered page-based pagination don’t consistently provide the next page number, so this must be calculated based on the current page compared to the total number of results and the number of items per page.

```
<data class="currentPage" value="2" data-total="573" data-per-page="5" data-service="vimeo"></data>
```

 - `value` Current page, assumes `1` if omitted
 - `total` Total number of results. Required
 - `per-page` Number of items per page. Required

### Other Methods

All other pagination methods require that each service provide a URL pointing to the next page of results.

```
<data class="nextPage" value="https://gdata.youtube.com/feeds/api/videos?q=the+killers&start-index=11&max-results=5&orderby=published&v=2" data-service="youtube"></data>
```

This leaves actual implementation in the hands of API providers, a responsibility commonly accepted in the interest of performance.

##### Example Mapping

Referencing the Results Page URI Template, values for pagination variables are extracted from the URLs in the API responses:

 - **max_id:** 252620416600928260 &larr; https://api.twitter.com/1.1/search/tweets.json?q=the+killers&count=15&max_id=252620416600928260

 - **start-index:** 11 &larr; https://gdata.youtube.com/feeds/api/videos?q=the+killers&max-results=5&start-index=11&orderby=published&v=2

&rarr; `/results?twitter={twitter;max_id}&youtube={youtube;start-index}&vimeo={vimeo;page}`


Usage
--------------------------------------------------------------------------------

To activate the plugin, simply select an element containing the initial stream of content and call the plugin:

``` js
$('.stream').stStream();
```

New content can be loaded on any desired event by calling the plugin’s [nextPage method](#nextpage). [See a Demo][manual-demo]

##### Example

``` js
$('.next').click(function() {
    $('.stream').stStream('nextPage');
});

$('.stream').stStream().on({
    next: function() {
        $('.next').attr('disabled', true);
    },
    load: function() {
        $('.next').removeAttr('disabled');
    }
});
```

### Scrolling Pagination

The plugin can also automatically load the next page of content when the user scrolls to the end of the stream. This UX pattern is commonly referred to as [“endless pagination”][pagination]. The scrolling threshold can be optionally adjusted in pixels to jumpstart the asynchronous request for likely completion before the user has reached the end. [See a Demo][scrolling-demo]

##### Example

``` js
$('.stream').stStream({ pagination: 'scrolling' });
```


Options
--------------------------------------------------------------------------------

Options may be set by passing them in a configuration object when calling the plugin or by setting `data` attributes on the instantiated element. Both methods are interchangeable, but note that the configuration object takes priority.

### pagination `string`

 - **`manual`** Requires the [nextPage method](#nextpage) method to be called on a desired event.

 - `scrolling` Enables scrolling pagination

### selector `string`

Selects matching children of the element on which the plugin has been instantiated. Selected elements are blended if they have a valid `data-datetime` attribute. **Default:** `article`

### scrollingThreshold `integer`

Adjusts the scrolling threshold (in pixels) that triggers the next page load when reached. **Default:** `-200` offset from the end of the container element

### results-page `string`

Defines a relative URI template where additional content may be loaded. Pagination variables should be specified with a `{service-name;parameter-name}` syntax. Any number of these may exist as path segments or in the query string. **Default:** none


Events
--------------------------------------------------------------------------------

The following events may prove useful for:

 - Binding interactions with a UI control to trigger a new page load
 - Offering feedback to users when new content is loading
 - Adjusting scroll position after new content has been loaded

### `blendStart`

Triggered before blended content is inserted into the DOM.

### `blend`

Triggered after blended content has been inserted into the DOM.

### `lastPage`

Triggered when no additional content is available to load.

### `loadStart`

Triggered before new content is requested asynchronously.

### `load`

Triggered after new content has been successfully returned, blended, and inserted into the DOM.


Methods
--------------------------------------------------------------------------------

### `blend(data)`

A jQuery object may be optionally passed to this method to be blended but skipping insertion into the DOM.

### `nextPage`

Triggers a request for the next page of content, building the relative pagination URL from the `<data>` elements. The response is appended to the stream.

### `toggleScrolling`

Disables scrolling by intercepting mouse scrolling events and keyboard events for relevant keys such as arrow keys, the spacebar, page up/down, and home/end. Scrolling is restored with another call. This can be useful in maintaining the scrolling position when new content is manipulated prior to insertion.


License
--------------------------------------------------------------------------------

**This plugin is available under the MIT License (Expat).**
Copyright © 2012 Story Arc Corporation

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


[storyteller]: http://storytellerhq.com

[manual-demo]: http://264-st-stream.sites.storytellerhq.com/the+killers
[scrolling-demo]: http://264-st-stream.sites.storytellerhq.com/the+killers?pagination=scrolling

[jquery]: http://jquery.com/download
[inview]: https://github.com/protonet/jquery.inview
[appear]: http://code.google.com/p/jquery-appear

[rfc6570]: http://tools.ietf.org/html/rfc6570
[pagination]: http://codinghorror.com/blog/2012/03/the-end-of-pagination.html