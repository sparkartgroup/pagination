# Pagination

This add-on simplifies the problem of paginating content from APIs. The following pagination methods are supported: 

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

Pagination may be easily added to your site using [Bower][bower], running the following command from the root directory of your site:

```
$ bower install storyarc/pagination
```

Usage
--------------------------------------------------------------------------------

The following example show how to paginate the content of three resources (tumblr, facebook, and twitter), each with its own pagination type. Whenever data is ready `.paginate` triggers the `success` or `error` events. To fetch the next page, trigger the `next` event on the `.paginate` element.

```html
<div id="my-stream"></div>

<script>
    $( "#my-stream" )
    .paginate([{
        resource: "tumblr-stream.json",
        pagination: {
            type: "index-offset",
            attributes: {
                limit: 15
            }
        }
    }, {
        resource: {
            url: "facebook.json",
            data: {foo: "bar"}
        },
        pagination: {
            type: "cursoring",
            attributes: {
                limit: 15
            }
        }
    }, {
        resource: "twitter.json",
        pagination: {
            type: "cursoring",
            attributes: {
                parameterNames: {
                    after: "max_id",
                    limit: "count"
                },
                limit: 15
            }
        }
    }])
    .on( "success", function( event, data ) {
        render( data ).appentTo( event.target );
    })
    .on( "error" , function( event, data ) {
        log.error( data );
    });

    $( "a.next" ).click(function( event ) {
        event.preventDefault();
        $( "#my-stream" ).trigger( "next" );
    });
</script>
```

API
--------------------------------------------------------------------------------

### `.paginate( attributes )`

### Attributes

- resource: String containing the resource URL or an Object of key-value pairs below.
 - url: String containing the resource URL.
 - data: Object of data to be sent to the server (obs: pagination data will be appended to this one).
- pagination: Object of key-value pairs below.
 - type: String containing the pagination type.
 - attributes: Object with specific pagination attributes.

### Pagination

##### Cursoring

TODO

##### Index/Offset

type: `"index-offset"`.   
attributes:
- limit: The number of posts to return.
- offset: Post number to start at (default: 0).
- parameterNames:
 - limit: String with the name of the limit parameter (default: "limit").
 - offset: String with the name of the offset parameter (default: "offset").

##### Numbered Pages

TODO

##### Token-based

TODO

### Events

##### `.on( "success" )`

Whenever `.paginate` successfully fetches pages, `success` event is triggered with received `data`.

##### `.on( "error" )`

Whenever `.paginate` has a failure fetching pages, `error` event is triggered with received `data`.

##### `.trigger( "next" )`

Whenever `.paginate` element listens for a `next` event, it fetches the appropriate next page (OBS: currently, it fetches the next page of each of the resources).

### Blending Results

TODO


[bower]: http://bower.io
[jquery]: http://jquery.com/download
[rfc6570]: http://tools.ietf.org/html/rfc6570
[storyteller]: http://storytellerhq.com+
