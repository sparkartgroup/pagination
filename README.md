# Pagination

This add-on simplifies the problem of paginating content from APIs. The following pagination methods are supported: 

 - **Numbered pages:** Pages are computed based on available content and accessed sequentially.
 - **Index/Offset:** Increments content by the index of the first content item in each “page” of content.
 - **Cursoring:** Specifies ranges of IDs or timestamps rather than pre-computing “pages” of results.
 - **Token-based:** Associates each page of content with a unique token, provided in each response for use in the next request.

## Popular Examples

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

Pagination may be easily added to your site using [Bower][bower], running the following command from the root directory of your site:

```
$ bower install storyarc/pagination
```

Usage
--------------------------------------------------------------------------------

The following example shows how to paginate the content of a proxied Tumblr blog resource, fetched via `GET /tumblr.json`. Whenever data is ready `.paginate` triggers the `success` or `error` events.

```html
<div id="tumblr-stream">
    <button type="button">More</button>
</div>

<script>
var Tumblr = Resource.extend({
    url: "/tumblr.json",
    pagination: IndexOffsetPagination
});

$( "#tumblr-stream" )
    .on( "success", function( event, data ) {
        render( data ).appentTo( event.target );
    })
    .on( "error" , function( event, data ) {
        log.error( data );
    })
    .paginate({
        resource: new Tumblr(),
        moreButton: "button"
    });
</script>
```

If you need to customize your pagination parameters, simply extend a paginantion type and create your own custom one.

```html
<div id="twitter-stream">
    <button type="button">More</button>
</div>

<script>
var TwitterPagination = CursoringPagination.extend({
    parameterNames: {
        after: "max_id",
        limit: "count"
    },
    limit: 15
});

var Twitter = Resource.extend({
    url: "/twitter.json",
    pagination: TwitterPagination
});

$( "#twitter-stream" )
.on( "success", function( event, data ) {
    render( data ).appentTo( event.target );
})
.on( "error" , function( event, data ) {
    log.error( data );
})
.paginate({
    resource: new Twitter(),
    moreButton: "button"
});
</script>
```

API
--------------------------------------------------------------------------------

The building blocks.

## `$.fn.paginate`

The jQuery plugin `$.fn.paginate` is a widget that binds a resource with DOM elements. It's a helper that maps user events (via DOM events, eg. `click`) into resource actions (eg. `resource.next()`), or resource events (eg. data fetched) into DOM events (eg. the custom `success`/`error` events).

```javascript
$( element ).paginate( attributes );
```

The attributes are:
- resource: a [Resource](#resource) instance.
- moreButton: A selector, or DOM Element, or jQuery object that upon click will trigger the next page (by internally calling `resource.next()`).

The plugin fetches the 1st page on initialization, and it pre-caches the next ones in advance (one at a time).

*Future plan: allow different types of pagination interfaces (eg. auto paginate on scroll).*

Events:

### `.on( "success" )`

Whenever `.paginate` successfully fetches pages, `success` event is triggered with received `data`.

### `.on( "error" )`

Whenever `.paginate` has a failure fetching pages, `error` event is triggered with received `data`.

## Resource

Handles resource's data-fetch. It encapsulates the resources attributes (url, and pagination type) and offers a simple set of methods to manage it: `.get()`, and `.next()` (via pagination's instance `.next()`).

```javascript
var myResource = new Resource( attributes );
```

Create your own custom resource by extending Resource with custom attributes. The new class will use such attributes as default. (note, you are also allowed to extend your just extended class and so on.)

```javascript
var MyResource = Resource.extend( attributes );
var myResource = new MyResource();
```

The attributes are:
 - url: String containing the resource URL.
 - params: key-value pairs of params to be sent to the server on every request (note that pagination params will be appended to this one).
 - pagination: a [Pagination](pagination) class.

### `resource.get( params )`

`params` are optional parameters to include in the GET querystring. This method returns a Deferred object of the request.

## Pagination

Handles the pagination logic and exports `.next()` method used internally by [Resource](resource). This class is extended by the specific types of paginations below. See their respective docs for more information of each type.

### `pagination.next()`

Returns a Deferred object of the request (made internally via resource). All pagination logic is done internally, and any needed pagination-querystring is appended automatically.

`.next()` prevents any possible while-the-page-is-still-being-fetched further calls. In that case, it returns the same on-progress Deferred object.

### Cursoring

Pagination extended with the cursoring pagination logic.

```javascript
var myResource = new Resource({
    pagination: CursoringPagination( attributes )
});
```

The attributes are:
- after: The cursor that points to the end of the page. Next page will continue from this point (default: null).
- getAfter: A function that accepts one argument: the fetched data; and returns the cursor from which the next page will continue.
- limit: The number of posts to return (default: null).
- parameterNames:
 - after: String with the name of the after parameter (default: "after").
 - limit: String with the name of the limit parameter (default: "limit").

Create your own custom cursoring pagination by extending CursoringPagination with custom attributes. The new class will use such attributes as default. (note, you are also allowed to extend your just extended class and so on.)

```javascript
var MyPagination = CursoringPagination.extend( attributes );
var myResource = new Resource({
    pagination: MyPagination
});
```

### Index/Offset

Pagination extended with the index/offset pagination logic.

```javascript
var myResource = new Resource({
    pagination: IndexOffsetPagination( attributes )
});
```

The attributes are:
- count: A function that accepts one argument: the fetched data; and returns the number of fetched items.
- limit: The number of posts to return (default: null).
- offset: Post number to start at (default: 0).
- parameterNames:
 - limit: String with the name of the limit parameter (default: "limit").
 - offset: String with the name of the offset parameter (default: "offset").

Create your own custom index/offset pagination by extending IndexOffsetPagination with custom attributes. The new class will use such attributes as default. (note, you are also allowed to extend your just extended class and so on.)

```javascript
var MyPagination = IndexOffsetPagination.extend( attributes );
var myResource = new Resource({
    pagination: MyPagination
});
```

### Numbered Pages

Pagination extended with the numbered page pagination logic.

```javascript
var myResource = new Resource({
    pagination: NumberedPagePagination( attributes )
});
```

The attributes are:
- continue: A function that accepts one argument: the fetched data; and returns a boolean telling whether or not there are next pages.
- page: Page number to start at (default: 1).
- per_page: The number of items to return per page (default: null).
- parameterNames:
 - page: String with the name of the page parameter (default: "page").
 - perPage: String with the name of the perPage parameter (default: "per_page").

Create your own custom numbered page pagination by extending NumberedPagePagination with custom attributes. The new class will use such attributes as default. (note, you are also allowed to extend your just extended class and so on.)

```javascript
var MyPagination = IndexOffsetPagination.extend( attributes );
var myResource = new Resource({
    pagination: MyPagination
});
```

### Token-based

Pagination extended with the token pagination logic.

```javascript
var myResource = new Resource({
    pagination: TokenPagination( attributes )
});
```

The attributes are:
- getNextToken: A function that accepts one argument: the fetched data; and returns the next token.
- token: The token of the next page (default: null).
- limit: The number of posts to return (default: null).
- parameterNames:
 - token: String with the name of the after parameter (default: "token").
 - limit: String with the name of the limit parameter (default: "limit").

Create your own custom token pagination by extending TokenPagination with custom attributes. The new class will use such attributes as default. (note, you are also allowed to extend your just extended class and so on.)

```javascript
var MyPagination = TokenPagination.extend( attributes );
var myResource = new Resource({
    pagination: MyPagination
});
```

## Blending Resources

Blend several resources into a single "virtual" one with BlendResources.

```html
<div id="stream">
    <button type="button">More</button>
</div>

<script>
var blendedResource = new BlendResources({
    tumblr: new Tumblr(),
    twitter: new Twitter(),
    facebook: new Facebook()
});

$( "#stream" )
    .on( "success", function( event, data ) {
        render( data ).appentTo( event.target );
    })
    .on( "error" , function( event, data ) {
        log.error( data );
    })
    .paginate({
        resource: blendedResource,
        moreButton: "button"
    });
</script>
```

### `blendedResource.get( params )`

Calls `.get( params )` of all resources in bulk and returns a merged Deferred object that succeeds when *all* individuals succeeds, and fails when *any* individual fails.

On success, returns the merged data as a key-value pairs where key is the resource's `name`, ane value is the resource's data. Eg.
```
{
    tumblr: {...},
    twitter: {...},
    facebook: {...}
}
```

### `blendedResource.next()`

Calls `.next()` of all resources in bulk and returns a merged Deferred object that succeeds when *all* individuals succeeds, and fails when *any* individual fails.

Returns data in the same format as above.

[bower]: http://bower.io
[jquery]: http://jquery.com/download
[rfc6570]: http://tools.ietf.org/html/rfc6570
[storyteller]: http://storytellerhq.com+
