jquery.smartpopover
===================

Auto layouting balloon popover always inside window for jQuery.

Refer to the jQuery SmartPopover site for examples.


Usage
-----

Requires jQuery 1.8+.

``` html
<script src='jquery-1.8.1.js'></script>
<script src='jquery.smartpopover.js'></script>
```


Creates new popover.

``` javascript
$("#target").smartPopover("<div>Hi!!</div>");
```


To delete popover, click outside of the popover or call "destroy".
``` javascript
$("#target").smartPopover("destroy");
```


Options
---------------

To change color of popover and set no border-radius. (like Metro UI style)
``` javascript
$("#target").smartPopover("<div>...</div>", {"background-color":"#48b1f2", "border-radius": 0 });
```


Other options
``` javascript
//TODO
```


Acknowledgements
----------------

© 2013, mofukuma. Released under the [MIT 
License](http://www.opensource.org/licenses/mit-license.php).

 * Website http://kumaden.grrr.jp
 * Twitter [@mofukuma](http://twitter.com/mofukuma)
