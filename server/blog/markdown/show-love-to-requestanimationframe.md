Show Love to requestAnimationFrame



<img src="http://o2js.com/assets/clock-tower.png" src="" title="Yield your time wisely" style="float:left;margin:1em">

If you have done **JavaScript** web application development for a while, you probably have used the `setTimeout(delegate, 0);` pattern a lot. 

<div style="clear:both"></div>

This excerpt from Nicholas C. Zakas’ [High Performance Javascript][high-perf-js] mentions certain scenarios where yielding with timers might be a good fit:

> *Despite your best efforts, there will be times when a Javascript task cannot be completed in **100 milliseconds or less** because of its complexity. In these cases, it’s ideal to yield control of the UI thread so that UI updates may occur. Yielding control means stopping Javascript execution and giving the UI a chance to update itself before continuing to execute the Javascript.*

<div stlye="clear:both;"></div>

[high-perf-js]: http://www.amazon.com/Performance-JavaScript-Faster-Application-Interfaces/dp/059680279X

### Introduction

`setTimeout(delegate, 0)` interface can be used to both allow user agent events and display updates to happen before continuing script execution and to avoid long running script dialogs to raise a [“JavaScript execution exceeded timeout”][js-timeout] error in certain user agents.

By yielding with `setTimeout` what you do is a **cooperation** [on a single thread][timers]; and for an untrained eye, this misleadingly looks like “multitasking” or “multithreading”. What we do, however, is just pumping events to the event pipe of the **main render thread** of the browser. 

> **JavaScript** is only one of the many things that the browser’s **main render thread** is supposed to run. The main render thread is also responsible for creating and **modifying the DOM** tree, **dispatching** user events, **parsing CSS**, doing **layout**; i.e., creating and managing pretty much everything you see on the browser.

If we use timers to defer UI manipulation, this chaotic nature of the browser’s main render thread makes it virtually impossible to fire the timer at a relatively less occupied time frame, where the browser can focus only on the UI manipulation we want to make. 

This is like… kind of… multi-tasking. The technically correct term for it is  “**cooperation**” (*since we cannot talk about true multitasking, when there is a single thread responsible for executing **JavaScript***). 

### What Does This All Mean?

What this all means is that timer-driven events update the screen when they want to, **NOT** when the browser is **able** to.

In this tutorial, we will…

* Analyze how the browser’s **main render thread** behaves; 
* Learn how to yield render operations with `setTimeout`;
* Discuss why this might not be the best solution at certain times;
* And create a more robust `requestAnimationFrame`-based task delegation alternative.

Before we continue further, here is a side note about multithreading in **JavaScript**:

> **Aside**:
> 
> One might argue that [GPU Compositing][gpu-acceleration], or [web workers][web-workers] makes **JavaScript** multi-threaded. This reasoning is flawed; and here’s why: 
> 
> * [Web Workers][web-workers] are background threads that operate independently of the browser’s main render thread; web workers only has access to a subset of JavaScript's features (*for instance you cannot access the **DOM***),  so it’s impossible to modify a **DOM** node, or access a global variable or a global function (*because access to the `window` object is disallowed, too*). 
> * And [GPU Compositing][gpu-acceleration] is a totally different story: At a very elementary level, the **GPU** works on a **copy** of a subset of the **DOM** tree, and synchronized it with the browser occasionally.
> 
> Neither of these are against the single-threaded nature of **JavaScript**.
> 
> **JavaScript** has always been, and will possibly always be, a single-threaded language.

[timers]:           http://ejohn.org/blog/how-javascript-timers-work/
[gpu-acceleration]: http://www.chromium.org/developers/design-documents/gpu-accelerated-compositing-in-chrome
[web-workers]:      http://www.html5rocks.com/en/tutorials/workers/basics/

### JavaScript Blocks Rendering

> A browser has to do a number of things pretty much all at once, and as we’ve seen **only** one of those is executing **JavaScript**. And one of the things **JavaScript** is very often used for is to ask the browser to build or update a display element.
>  
> The catch is, both updating the display and **JavaScript** execution happen on a single thread: the browser’s main render thread. 

Let’s create a simple sample to illustrate why we need yielding with `setTimeout(fn, 0)` in the first place:

We will begin with a very basic test **html** file:

~~~
<!doctype html>
<!—- examples/timer/index.html —>
<html>
<head>
<title>o2.js - o2.timer Example</title>
</head>
<body>
    <div id="Container"></div>
    <script src="../../bower_components/requirejs/require.js" 
    data-main=“index.js"></script>
</body>
</html>
~~~

where we we are loading the following **index.js** *[AMD][amd]* module:

~~~
define([
    '../../amd/o2/debug/core'
], function(
    debugUtil
) {
    'use strict';

    var log = debugUtil.log;

    /**
     * The specifics of this function is not important.
     * This is just a function that intentionally takes too long to execute.
     *
     * @param {Element} container
     *
     * @returns {string}
     */
    function longOperation(container) {
        var i, len;

        for (i = 0, len = 1000000; i < len; i++) {
            container.setAttribute('foo',
                '' + Math.sin(
                        (Math.random() / (0.1 + Math.random())) * len * Math.PI
                    )
            );
        }

        return container.getAttribute('foo');
    }

    /**
     *
     * @param {Integer} i
     * @param {Element} container
     *
     * @returns {string}
     */
    function calculateIndex(i, container) {
        return (i + 1) + '.' + longOperation(container);
    }

    /**
     * 
     */
    function render() {
        var container = document.getElementById('Container'),
            i, len;

        for (i = 0, len = 20; i < len; i++) {
            container.innerHTML = '<h1>' +
                calculateIndex(i, container) +
                '</h1>';

            log('set innerHTML to: "' + container.innerHTML + '"');
        }
    }

    render();
});
~~~

Typically, we would expect to page to update with some random data, every time we set `container.innerHTML` in the `render` method. 

What happens is quite different, though. We will see something similar to the following on the console:

~~~
set innerHTML to: "<h1>1.-0.9955066846723479</h1>"
set innerHTML to: "<h1>2.-0.9801537754701567</h1>"
set innerHTML to: "<h1>3.-0.9995175331737401</h1>"
set innerHTML to: "<h1>4.0.553635703625517</h1>"
set innerHTML to: "<h1>5.0.6583057642335193</h1>"
set innerHTML to: "<h1>6.-0.8452200693925425</h1>"
set innerHTML to: "<h1>7.0.4115753425986823</h1>"
set innerHTML to: "<h1>8.0.867877567903952</h1>"
set innerHTML to: "<h1>9.-0.6289886186681879</h1>"
set innerHTML to: "<h1>10.-0.9602593187446585</h1>"
set innerHTML to: "<h1>11.0.6327588491061965</h1>"
set innerHTML to: "<h1>12.0.7298410708685396</h1>"
set innerHTML to: "<h1>13.0.23048518219482983</h1>"
set innerHTML to: "<h1>14.0.9870993812969409</h1>"
set innerHTML to: "<h1>15.0.6538473489011852</h1>"
set innerHTML to: "<h1>16.-0.5544700180848542</h1>"
set innerHTML to: "<h1>17.0.6411672594472291</h1>"
set innerHTML to: "<h1>18.0.2551281346254461</h1>"
set innerHTML to: "<h1>19.0.5356435213718317</h1>"
set innerHTML to: "<h1>20.-0.5435228879607441</h1>" 
~~~

and the web page won’t reflect these changes until all the **JavaScript** execution finishes. 

> This is not a bug, **it’s a feature**.

Let’s recap once more: 

> Browser’s main render thread has the responsibility of **executing JavaScript** and **updating the rendered page** among many other tasks. 

Which means the render thread cannot update the page while it’s doing **JavaScript**; therefore, it will queue all the rendering operations and do them **after** the script execution finishes.

When we look at the browser’s timeline, it’s more obvious:

<a href="http://o2js.com/assets/parsing-large.png"><img src="http://o2js.com/assets/parsing.png" alt="parsing chart" title="Click to see a larger version"></a>

At each loop iteration, HTML is parsed, but no rendering is done. Only after the script ends, the main render thread finds time to paint the screen.

[amd]: http://requirejs.org/docs/whyamd.html

> Note that this example has intentionally been crafted in a way that it takes an absurdly long amount of time execute **JavaScript**. It’s an exaggeration; yet it’s not uncommon to coincide with similar issues in real life, especially if you are dealing with highly dynamic UI like [infinite scrolls][infinite-scroll].
> 
> As a rule of thumb no **JavaScript** execution on a browser should **not** take more than **300 milliseconds**, otherwise it will create a [janky][jankfree] user experience. And nobody likes jank.
 
As a rule of thumb, if a script takes more than a few hundred milliseconds, it should be split into smaller chunks and yielded with `setTimeout` as follows:

[infinite-scroll]: http://ui-patterns.com/patterns/ContinuousScrolling
[jankfree]: http://jankfree.org/

### Yielding Rendering With **setTimeout**

To get what we desire (*i.e., updating the user interface whenever we change the innerHTML*) we will need to slightly modify the code:

~~~
    /**
     *
     */
    function render() {
        var i = 0, len = 20;

        setTimeout(function loop() {
            var container = document.getElementById('Container');

            container.innerHTML = '<h1>' +
                calculateIndex(i, container) +
                '</h1>';

            log('set innerHTML to: "' + container.innerHTML + '"');

            i++;

            if(i <= len) {
                setTimeout(loop, 0);
            }
        }, 0);
    }
~~~

In the code above, we are yielding with `setTimeout(fn, 0)` to give the **CPU** some time to breathe and catch up with stuff live triggering user events, rendering, etc. 

If you are not new to front-end development, you would agree that this is a common coding pattern that you see all around: When we experience some UI lag in our web application, one solution is to use `setTimeout(fn, 0)` to even things out. 

Here is how the timeline looks like after yielding thing with a `setTimeout`:

<a href="http://o2js.com/assets/timeline-timeout-large.png"><img src="http://o2js.com/assets/timeline-timeout.png" alt="" title="Click to see a larger version"></a>

### Got It… And Is There a Problem With That?

So what’s the problem with that? 

For a simple example like this, it does not really matter; however as we yield more and more with `setTimeout`, and alter the **DOM** after each of those yields, we are faced with several problems:

* When the timer fires, we don’t know exactly whether it’s the best time to do the rendering: The paint event (that we just yielded) might happen at a time when the browser is not quite ready to do the paint. This might create a [suboptimal][jankfree] user experience. – Yes, [there is a better way of doing this called “`requestAnimationFrame`”][requestanimationframe]. 
* In addition, setTimeout **doesn’t** take into account what else is happening in the browser (whereas `requestAnimationFrame` does). – The page could be hidden behind a tab, the window might be minimized. Why waste your precious CPU cycles, and drain your battery when you don’t have to? – Especially, if you are developing for mobile for instance, “battery” is one of your most precious assets.
* Moreover, liberally using `setTimeouts` here, and there, and everywhere will create a hard-to-manage **performance architecture**. Or to put it better, using too many `setTimeout(fn, 0)`s will gradually make it harder to evaluate the performance of your **JavaScript architecture**: You might bump into occasional headaches that are hard to replicate (*like, for instance, every once in a while, too many timers firing all at once back-to-back making the UI feel sluggish*).

[requestanimationframe]: https://developer.mozilla.org/en-US/docs/Web/API/window.requestAnimationFrame
[js-timeout]:            https://www.google.com/search?q="JavaScript+execution+exceeded+timeout."

### Yield Cleverly **;)**

<img src="http://o2js.com/assets/marty_and_doc.jpeg" alt="Marty and Doc" title="Back to the Future">

A better way sending rendering tasks to the future is to…

* Utilize `requestAnimationFrame` API **whenever** we can;
* Use a single, infinitely-running **event loop** to register the tasks;
* Maybe keep track of how long the task has run (*for diagnostic purposes*, so that we can raise a warning when a task takes too long to execute); 
* Implement [HTML5 WindowTimers interface][window-timers] so that we can use it as a drop-in replacement for `window.setTimeout`.

When we implement all these, we will have a snappier task delegation mechanism that will make the browser (and our users) happier.

> **Aside**:
> 
> I am not the first one to come up with this idea.
> 
> [Om Framework][om-framework] for instance triggers render events in a similar fashion:  When something needs to be drawn on the page, **Om** schedules a re-render of data via `requestAnimationFrame`.
>
> Here is how [David Nolen][david-nolen] puts it into words:
> 
>> “**Om** feels natural, while *Backbone.js* will feel a bit *janky*. This is probably because Om always re-renders on requestAnimationFrame. A pretty nice optimization to have enabled in your applications.” 

> **Aside**:
> 
> There is a [**W3C** recommendation for `window.setImmediate` API][setimmediate], which allows the browser to yield an operation to a future time, and run it as soon as it can (*i.e., as soon as it updated the UI, and delegates any waiting user agent events*); however it is not widely implemented by browser vendors. At the time of this writing, only **IE10** supports `window.setImmediate` API. – So [the only cross-browser API that serves our needs right now][caniuse-raf] is `window.requestAnimationFrame`.

[window-timers]: http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#timers
[om-framework]:  http://swannodette.github.io/2013/12/17/the-future-of-javascript-mvcs/
[david-nolen]:   https://github.com/swannodette/
[setimmediate]:  https://dvcs.w3.org/hg/webperf/raw-file/tip/specs/setImmediate/Overview.html 
[caniuse-raf]:   http://caniuse.com/requestanimationframe

### This Is the Way We Loop the Loop

Let us start by creating an event loop, shall we?

~~~
'use strict';

if (!window) {
    throw new Error('o2.timer should run in a browser.');
}

var tick = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function( delegate ) {
            return window.setTimeout( delegate, 17 );
        },
    commandQueue = [];

function noop() {}

function parse(item) {
    if (item) {
        if (typeof item === 'string') {
            return JSON.parse(item);
        } else {
            return item;
        }
    }

    return {};
}

function getMetaInfoFromQueueItem(item) {
    var parsed = parse(item);

    if (!parsed.delegate) {
        parsed.delegate = noop;
    }

    return parsed;
}

function delegateCommand(command) {
    if (!command) {return false;}

    getMetaInfoFromQueueItem(command).delegate();

    return true;
}

function getNextCommand() {
    return commandQueue.shift();
}

function delegateNextCommand() {
    return delegateCommand(getNextCommand());
}

function loop() {
    tick(loop);

    delegateNextCommand();
}

exports.initialize = function() {
    loop();

    exports.initialize = noop;
};

exports.setTimeout = function(delegate, timeout) {
    return setTimeout(function() {
        commandQueue.push({delegate: delegate});
    }, timeout || 0);
};

exports.clearTimeout = function(id) {
    clearTimeout(id);
};
~~~

If we leave certain implementation details aside, the above code simply creates an [event loop][event-loop] that uses [requestAnimationFrame][raf].

The heavy-lifting is done by the `loop` method:

~~~
function loop() {
    tick(loop);

    delegateNextCommand();
}
~~~

Where `tick` is a [requestAnimationFrame][raf] [polyfill][polyfill].

So whenever we call the `setTimeout` method, we push the callback to an **[event loop][event-loop]** to be processed at the most appropriate time.

And using this new timer requires *minimal* change on our code:

~~~
    /**
     *
     */
    function render() {
        var i = 0, len = 20;

        timer.setTimeout(function loop() {
            var container = document.getElementById('Container');

            container.innerHTML = '<h1>' +
                calculateIndex(i, container) +
                '</h1>';

            log('set innerHTML to: "' + container.innerHTML + '"');

            i++;

            if(i <= len) {
                timer.setTimeout(loop);
            }
        });
    }
~~~

The only thing we did is to use `timer.setTimeout`, instead of `window.setTimeout`. The rest of the code remains intact.

[event-loop]: http://en.wikipedia.org/wiki/Event_loop
[raf]:        https://developer.mozilla.org/en-US/docs/Web/API/window.requestAnimationFrame
[polyfill]:   http://remysharp.com/2010/10/08/what-is-a-polyfill/

### Controlling the “Pipe Congestion”

There is one hidden problem with this setup though:

> The Achille’s Heel of this message queue architecture is the event loop itself. 

If, for some reason, more delegates are pushed to the queue than the loop can handle, then things will slow down and the user will get UI updates and other updates too late. 

Let’s see this with an example:

~~~
        function queue(i) {
            console.log('queued ' + i);

            timer.setTimeout(function() {
                console.log('timed out ' + i);
            });
        }

        // Simulates timer congestion.
        for(j = 0; j < 200; j++) {
            queue(j);
        }
~~~

In the above code 200 delegates are queued in the timer’s event loop, and they will be asynchronously executed in order.  

> The timer event loop is a [FIFO][fifo] structure. 
> 
> Consequentially, if we add more delegates to the queue, than we consume, then the lastly added delegates will never find a chance to get executed, and the timer **event queue**’s size will grow over time. 
> 
> In that case, the message traffic is so high, and our event pipe is so congested that it fails to handle subsequent tasks in a timely manner.

To solve this problem let us use a similar algorithm to [TCP slow start][slow-start]:

* Every time the delegate is processed, if there is less than **N** waiting delegates in the queue, it is a **HIT** (*i.e.*, the pipe is healthy and the size of the queue is not increasing abruptly.*);
* Every time the delegate is processed, if there are more than **N** waiting delegates in the queue, it is a **MISS** (*i.e., the size of the event queue appears to have been increasing, the pipe might be unhealthy.*);
* At every miss, the pipe starts executing delegates in batches in geometrically increasing sizes. So, instead of executing them one at a time; it will execute two at a time after the first miss, it will execute four at a time after the second miss… and so on;
* At every consecutive **K** hits, the batch size is decreased (*i.e., if the pipe was executing 4 delegates at a time, it will start executing 2 delegates after **K** consecutive hits, then if there is **K** more consecutive hits, it will execute one delegate per event loop cycle as usual*).

Here is the final **o2/timer/core** source code after having implemented the above mechanism:

~~~
'use strict';

/*
 *  This program is distributed under the terms of the MIT license.
 *  Please see the LICENSE.md file for details.
 */

/**
 * @module o2.timer
 * @require o2.object
 */

/**
 * @class o2.timer.core
 * @static
 */

var rConfig = require('./config'),

    o = require('./node_modules/o2.object/core'),
    clone = o.clone,
    extend = o.extend,

    config,

    misses = 0,
    hits = 0;

if (!window) {
    throw new Error('o2.timer should run in a browser.');
}

var tick = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function( delegate ) {
                    return window.setTimeout( delegate, 17 );
                },
    commandQueue = [];

/**
 *
 */
function noop() {}

/**
 *
 * @param item
 */
function parse(item) {
    if (item) {
        if (typeof item === 'string') {
            return JSON.parse(item);
        } else {
            return item;
        }
    }

    return {};
}

/**
 *
 * @param item
 *
 * @returns {Object}
 */
function getMetaInfoFromQueueItem(item) {
    var parsed = parse(item);

    if (!parsed.delegate) {
        parsed.delegate = noop;
    }

    return parsed;
}

/**
 *
 * @param command
 *
 * @returns {boolean}
 */
function delegateCommand(command) {
    if (!command) {return false;}

    getMetaInfoFromQueueItem(command).delegate();

    return true;
}

/**
 *
 * @returns {*}
 */
function getNextCommand() {
    return commandQueue.shift();
}

/**
 *
 * @returns {*}
 */
function delegateNextCommand() {
    return delegateCommand(getNextCommand());
}

/**
 *
 */
function multiplex() {
    var len = Math.pow(2, misses),
        i;

    for(i = 0; i < len; i++) {
        if (!delegateNextCommand()) {break;}
    }
}

/**
 *
 * @returns {boolean}
 */
function executeMultiplex() {
    if (commandQueue.length > config.multiplexThreshold) {
        hits = 0;
        misses++;

        multiplex();

        return true;
    }

    return false;
}

/**
 *
 */
function adjustHitCount() {
    if (misses <= 0) {return;}

    hits++;

    if (hits >= config.batchSizeDecreaseThreshold) {
        misses--;
        hits = 0;
    }
}

/**
 * The main event loop.
 */
function loop() {
    tick(loop);

    var didProcessQueue = executeMultiplex();

    if (didProcessQueue) {return;}

    adjustHitCount();

    delegateNextCommand();
}

/**
 * Initializes `o2.timer.core`.
 *
 * Call this method, before using other methods of `o2.timer.core`.
 *
 * @method initialize
 * @static
 * @final
 *
 * @param {Object} newConfig - configuration to override.
 */
exports.initialize = function(newConfig) {
    config = clone(rConfig);

    extend(config, newConfig);

    loop();

    exports.initialize = noop;
};

/**
 * Defers tasks to `requestAnimationFrame`.
 *
 * Use this instead of `window.setTimeout`.
 *
 * @method setTimeout
 * @static
 * @final
 *
 * @example
 *     var timer = require('amd/o2/timer/core');
 *
 *     var id = timer.setTimeout(function() {
 *         console.log('This will run at least after a second');
 *     }, 1000);
 *
 * @param {Function} delegate - the delegate to execute in the future.
 * @param {Number} timeout - timeout in milliseconds.
 *
 * @returns {Number} - a timeout id that we can use to clear the timeout.
 */
exports.setTimeout = function(delegate, timeout) {
    return setTimeout(function() {
        commandQueue.push({delegate: delegate});
    }, timeout || 0);
};

/**
 * Clears the timer scheduled with the given id.
 *
 * @method clearTimeout
 * @static
 * @final
 *
 * @example
 *     var timer = require('amd/o2/timer/core');
 *
 *     var id = timer.setTimeout(function() {
 *         console.log('This will run at least after a second');
 *     }, 1000);
 *
 *     ...
 *
 *     // Now the task won't run.
 *     timer.clearTimeout(id);
 *
 * @param {Number} id - the **id** of the timer.
 */
exports.clearTimeout = function(id) {
    clearTimeout(id);
};
~~~

[fifo]:       http://en.wikipedia.org/wiki/FIFO
[slow-start]: http://en.wikipedia.org/wiki/Slow-start
[nodejs]:     http://nodejs.org/
[o2js-git]:   https://github.com/v0lkan/o2.js/tree/dev

### Wait! This is a **[Common.JS][nodejs]** Module!

Nice observation! 

This module is impossible to be used in it’s current form in a web project.

Luckily, **[o2.js][o2js-git]** has a `grunt publish` task that generates **[AMD][amd]** modules for you:

> When you go to **o2.js** project root and run `grunt publish`, all **[Common.JS][nodejs]** modules in the **src** folder will be exported as **[AMD][amd]** modules into the **amd** folder.

When we use the exported **[AMD][amd]** modules, our **timer/index.js** will be as follows:

~~~
define([
    '../../amd/o2/debug/core',
    '../../amd/o2/timer/core'
], function(
    debugUtil,
    timer
) {
    'use strict';

    var log = debugUtil.log;

    timer.initialize();

    /**
     * The specifics of this function is not important.
     * This is just a function that intentionally takes too long to execute.
     *
     * @param {Element} container
     *
     * @returns {string}
     */
    function longOperation(container) {
        var i, len;

        for (i = 0, len = 1000000; i < len; i++) {
            container.setAttribute('foo',
                '' + Math.sin(
                        (Math.random() / (0.1 + Math.random())) * len * Math.PI
                    )
            );
        }

        return container.getAttribute('foo');
    }

    /**
     *
     * @param {Integer} i
     * @param {Element} container
     *
     * @returns {string}
     */
    function calculateIndex(i, container) {
        return (i + 1) + '.' + longOperation(container);
    }

    /**
     *
     */
    function render() {
        var i = 0, j, len = 20;

        timer.setTimeout(function loop() {
            var container = document.getElementById('Container');

            container.innerHTML = '<h1>' +
                calculateIndex(i, container) +
                '</h1>';

            log('set innerHTML to: "' + container.innerHTML + '"');

            i++;

            if(i <= len) {
                timer.setTimeout(loop, 0);
            }
        }, 0);


        function queue(i) {
            console.log('queued ' + i);

            timer.setTimeout(function() {
                console.log('timed out ' + i);
            });
        }

        // Simulates timer congestion.
        for(j = 0; j < 200; j++) {
            queue(j);
        }
    }

    render();
});
~~~

And here’s our index page, for the record:

~~~
<!doctype html>
<!—- examples/timer/index.html —>
<html>
<head>
<title>o2.js - o2.timer Example</title>
</head>
<body>
    <div id="Container"></div>
    <script src="../../bower_components/requirejs/require.js" 
    data-main="timer.js"></script>
</body>
</html>
~~~

### Minifying Our Code

In a conceptual demo like this, code minification is not that important; however for a real-life application, we would have wanted to minify our code. Luckily, [require.js][require]’s friend **[r.js][rjs]** can automate this for us:

~~~
cd examples/timer;
r.js -o name=timer \
baseUrl=. paths.requireLib=../../bower_components/requirejs/require \
include=requireLib out=timer-min.js;
~~~

The above command will pack all the code necessary for this example into a single **timer-min.js**.

In order to use **timer-min.js**, will need to modify our index a little:

~~~
<!doctype html>
<!—- examples/timer/index.html —>
<html>
<head>
<title>o2.js - o2.timer Example</title>
</head>
<body>
    <div id="Container"></div>

    <script src="timer-min.js"></script>
    <script>require(["timer"]);</script>
</body>
</html>
~~~

[rjs]:     http://requirejs.org/docs/optimization.html
[require]: http://requirejs.org/

### Read the Source Luke

You can find the final code [at this **o2.js** *GitHub* history snapshot][source].

[source]: https://github.com/v0lkan/o2.js/tree/86756f22a3de4f1662ff6874960bac01cbc54aff/examples/timer

### Conclusion

In this tutorial we have seen…

* Why **JavaScript** execution may block UI rendering;
* How yielding with `setTimeout` gives the **CPU** some time to breathe;
* Why yielding with `setTimeout` might not be the best option and what we can do about it.

We have also created an **o2.timer** module that addresses all of these, and briefly looked at how we can minify and obfuscate our code. 

The interested might want to read more about [how google team experimented with timers][gmail-timers], [High Performance JavaScript (*book; by Nicholas C. Zakas*)][highperf-js], [how **JavaScript** timers work][timers], and [why **JavaScript** timers are not accurate][timers-accuracy].

[gmail-timers]:    http://googlecode.blogspot.com/2009/07/gmail-for-mobile-html5-series-using.html
[highperf-js]:     http://www.amazon.com/gp/product/059680279X
[timers-accuracy]: http://ejohn.org/blog/accuracy-of-javascript-time/

That’s all for now **:)** 

Until the next blog post, **may the source be with you**!