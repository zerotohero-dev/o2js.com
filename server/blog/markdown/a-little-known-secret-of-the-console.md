A Little-Known Secret of the Console



<img src="http://o2js.com/assets/logs.gif" title="working on logs" alt="" width="320" height="271" style="float:left;margin:1em;">

In this article, we will observe that the **Node.JS** console API (*i.e., `console.log`, `console.warn`, `console.error` etc.*) is blocking most of the time. 

Then, we will analyze how this blocking nature might affect our application if we have to do **excessive** logging. 

And finally, we will create a simple non-blocking logger that pushes data to a file stream.

> Before diving into the details, please keep in mind that there are excellent battle-tested async logging libraries for **Node.JS**. The most popular one, as of the time of this writing, is [Winston][winston]. 
> 
> For a production code, instead of reinventing the wheel, using a bullet proof library might be a better option; however, knowing how the console API works in **Node.JS** will help us understand why such loggers are useful. 
> 
> In addition, if we are using an external logging library, knowing how things work behind the scenes, will be extremely helpful if we need to submit a patch to the library for our use case, or if we need to **[hack][ready2hack]** our logger further for our needs.

[ready2hack]: http://blog.geekli.st/post/93269743717/are-you-ready-to-hack
[winston]: https://github.com/flatiron/winston

### How Does the **console** Behave?

Assume that we have a **Node.JS** project that is concurrently accessed by millions of users, where we need to log huge amounts of data for each user’s interaction with the system. 

If we use `console.log` to log things, then we might experience some slowdown in the application’s response time, because `console.log` is **almost always** guaranteed to be a **blocking** operation.

The key phrase here is “**almost** always”. Let’s see how:

**Node.JS** is open-source; and that’s wonderful: You can read the source and see how things are implemented, and abstracted behind the scenes.

[Here’s what `console.log` does][console-src]:

~~~
Console.prototype.log = function() {
  this._stdout.write(util.format.apply(this, arguments) + '\n');
};
~~~

By the end of the file, we see the following export:

~~~
module.exports = new Console(process.stdout, process.stderr);
~~~

So the module basically does some formatting and yields the main processing to the **process.stdout** stream.

[console-src]: https://github.com/joyent/node/blob/1cd48c7ae5f592307741865f2ba650515a0c4f01/lib/console.js#L52

### process.stdout

And you can also look at [how **process.stdout** writable stream is initialized][process-src].

Here’s a small excerpt from that code:

~~~
...
      case 'FILE':
        var fs = NativeModule.require('fs');
        stream = new fs.SyncWriteStream(fd, { autoClose: false });
        stream._type = 'fs';
        break;
...
~~~

Hey wait! When the **stdout** is a file, it is using a **SyncWriteStream**, which blocks until the write operation is completed.

As a matter of fact, unlike many streams in **Node.JS**, `process.stdout`, and `process.stderr` are usually blocking. This is an architectural decision that **Node.JS** has been following since version **0.6**.

Here is how [**Node.JS** documentation states that][process-doc].

> `process.stderr` and `process.stdout` are, unlike other streams in Node, in that writes to them are usually blocking.
>
> They are **blocking** in the case that they refer to regular **files** or **TTY file descriptors**.
> 
> In the case they refer to **pipes**:
> 
> * **They are blocking in Linux/Unix**.
> * They are non-blocking like other streams in Windows.

Do you know anyone who uses a non-Linux box to run a **Node.JS** server in production? Me neither. – So, **practically**, calls to the **console** API, albeit they use streams internally, are blocking.

There are a few reasons for that:

* The asynchronous nature of streams might sometimes be confusing. Especially if the program terminates, and not all of the `console.log` statements have been printed, it might make debugging harder.
* There might be an IO bottleneck; i.e., printing faster than **stdout** can handle would populate a backlog stream buffer. And this would lead to excessive memory usage.

Both are fair enough reasons to keep the console API sync. 

And generally **console** API is pretty fast to respond. So if you are not doing massive amounts of logging, or if you don’t have a massively concurrently used application, then you won’t feel the blocking nature of the **console** API.

[process-src]: https://github.com/joyent/node/blob/832ec1cd507ed344badd2ed97d3da92975650a95/src/node.js#L432
[process-doc]: http://nodejs.org/api/process.html#process_process_stdout

### A Simple Test Case

We can create a simple setup to see the blocking nature of **process.stdout** and hence **console**:

~~~
// file: examples/debug/node/benchmark001.js

'use strict';

var data = '...................................................';

for (var i = 0, l = 22; i < l; i++) {
    data += data;
}

var start = Date.now();

console.log(data);

console.log('wrote %d bytes in %dms', data.length, Date.now() - start);
~~~

The output would be something like

~~~
... a lot of "."s ... 

wrote 213909504 bytes in 10622ms
~~~

> For the sake of completeness, I’m running this code (*and all of the following codes*) in **Mac OSX 10.9.4**; however, The results will be similar in any unix-like system.

Ummm… maybe it’s because we are directly running it in **TTY** (*i.e., `Boolean(process.stdout.isTTY)` is `true`*). Let’s try to run a **daemon** process using [`nohup`][nohup].

~~~
$ nohup node benchmark001.js
~~~

Here’s the output:

~~~
... a lot of "."s ... 

wrote 213909504 bytes in 1138ms
~~~

It is faster, because it’s directly streaming to a file via a socket connection, instead of displaying things on the console. Though, the `console.log` write operation is still blocking.

And the blocking nature is not so clear. Maybe it takes ~1sec just to initially prepare to push a big chunk of data to the stream.

Let’s change the code a little to see whether that’s the case.

~~~
// file: examples/debug/node/benchmark001.js

'use strict';

var data = '...................................................';

for (var i = 0, l = 22; i < l; i++) {
    data += data;
}

var start = Date.now();

console.log(data);

console.log('wrote %d bytes in %dms', data.length, Date.now() - start);

process.on('exit', function() {
    console.log('exited');
    console.log('Total processing time: ' + (Date.now() - start) + 'ms.');
});

process.on('error', function() {
    console.log('err');
});
~~~

And we get:

~~~
... a lot of "."s ... 

wrote 213909504 bytes in 1107ms
exited
Total processing time: 1109ms.
~~~

Since the two timestamps are only a few millisecond apart, we can be certain that the logging operation is blocking.

Let’s give [forever][forever] a try too:

~~~
$ forever start -l 4ver.log -o out.log -e err.log benchmark001.js 
... wait for a while ...
$ forever stop 0
$ cat out.log | grep ms
wrote 213909504 bytes in 2703ms
Total processing time: 2715ms.
wrote 213909504 bytes in 2048ms
Total processing time: 2059ms.
wrote 213909504 bytes in 2070ms
Total processing time: 2081ms.
~~~

Same result, just a little slower.

On a unix-like system, no matter what you do (i.e., `tee` the standard output to a file, run node.js as a Daemon using [forever.js][forever], or using `nohup` etc; the console.log will be [blocking the program flow for a while][blocking].)

For a final stab at it, let’s modify the code a little, and do the same test using [Winston][winston] file logger:

~~~
// file: examples/debug/node/benchmark002.js

'use strict';

var winston = require('winston'),

    transports = [],
    handlers = [];

transports.push(new winston.transports.File(
    {filename: 'aggr.log'}
));
handlers.push(new winston.transports.File(
    {filename: 'exception.log'}
));

var logger = new (winston.Logger)({
    transports: transports,
    exceptionHandlers: handlers
});

var data = '...................................................';

for (var i = 0, l = 22; i < l; i++) {
    data += data;
}

var start = Date.now();

logger.log('info', data);

console.log('wrote %d bytes in %dms', data.length, Date.now() - start);

process.on('exit', function() {
    console.log('exited');
    console.log('Total processing time: ' + (Date.now() - start) + 'ms.');
});
~~~

And the output is as follows:

~~~
$node benchmark002.js
wrote 213909504 bytes in 1742ms
exited
Total processing time: 3617ms.
~~~

It looks like using [Winston][winston], increases the total processing time (i.e., `nohup` approach takes ~1sec, [forever][forever] takes ~2sec, and [Winston][winston] takes ~4sec with the same scenario; however, when we look at the differences in the timestamps, it’s clearly visible that [Winston][winston] does async logging, and that’s a good thing. 

[nohup]: http://en.wikipedia.org/wiki/Nohup
[forever]: https://github.com/nodejitsu/forever
[blocking]: https://github.com/joyent/node/issues/8022

### Let’s Append to a File

Winston is a little slow, because it’s aim is to be **robust**, **readable**, and **reusable**. The question is: “*Can we do better?*”; meaning: “If we create a minimal logger that does nothing but streams to a file, will it be faster?

Intuition says “yes”. So let’s try to verify this assumption:

While doing or logging, instead of directly pushing things to the console, let’s append them to a file.

Here’s a code that tries to do that:

> Note that this is **not** the correct way of doing this, as we’ll see soon below.

~~~
// file: examples/debug/node/filelog001.js

'use strict';

var fs = require('fs');

function log(stuff) {
    fs.appendFile(
        'out.log',
        stuff + '\n',
        {flags: 'a+', encoding: 'utf8'},
        function(err) {
            if (!err) {return;}

            setTimeout(function() {
                console.log(err);
            });
        }
    );
}

var i, len;

log('Hello world.');

for (i = 0, len = 250; i < len; i++) {
    log('Hello ' + i);
}

process.on('exit', function() {
    console.log('All done!');
});

process.on('error', function() {
    console.log('errored');
});
~~~

> For the interested, the **setTimeout** in the error handler is there [to work around OSX-specific issues][osx-bug], which might already have been patched in the most recent version of **[Node.JS][node.js]**.

When we run the above code, we get:

~~~
{ [Error: EMFILE, open 'out.log'] errno: 20, code: 'EMFILE', path: 'out.log' }
{ [Error: EMFILE, open 'out.log'] errno: 20, code: 'EMFILE', path: 'out.log' }
{ [Error: EMFILE, open 'out.log'] errno: 20, code: 'EMFILE', path: 'out.log' }
{ [Error: EMFILE, open 'out.log'] errno: 20, code: 'EMFILE', path: 'out.log' }
{ [Error: EMFILE, open 'out.log'] errno: 20, code: 'EMFILE', path: 'out.log' }
{ [Error: EMFILE, open 'out.log'] errno: 20, code: 'EMFILE', path: 'out.log' }
All done!
~~~

Obviously, we are doing something wrong. Before getting into that, let’s look at the contents of **out.log**:

~~~
Hello world.
Hello 4
Hello 3
Hello 2
Hello 5
Hello 6
Hello 7
Hello 1
Hello 8
Hello 0
Hello 9
Hello 10
...
~~~

Wow! Things are massively **out-of-order**! 

That’s because we are logging you **out.log** asynchronously. And the **[Error: EMFILE, open 'out.log']** error we get is due to keeping too many open file handles.

> It is unsafe to use `fs.write` or `fs.appendFile` multiple times on the same file without waiting for the callback. 
> For this scenario, we should create a **stream** and write to that stream instead.

[node.js]: http://nodejs.org

### Using a **FileStream**

Let’s slightly modify the above example to use a file stream, so that we can log things in order, and won’t have **EMFILE** errors as we had before:

~~~
'use strict';

var fs = require('fs'),

    stream;

function initialize(file) {
    if (typeof file === 'string') {
        stream = fs.createWriteStream(
            file, {flags: 'a+', encoding: 'utf8'}
        );

        return;
    }

    stream = file;
}

initialize('out.log');

function log(stuff) {
    stream.write(stuff + '\n');
}

var i, len;

log('Hello world.');

for (i = 0, len = 250; i < len; i++) {
    log('Hello ' + i);
}

process.on('exit', function() {
    console.log('All done!');
});

process.on('error', function() {
    console.log('errored');
});
~~~

[osx-bug]: https://github.com/joyent/node/issues/8032

### Hello **o2.debug** World

While we’re in there, let’s integrate what we’ve created in here to **[o2.js][o2.js]** to create a simple, yet fast, async debugging module:

~~~
// file: o2/debug/core.js

'use strict';

var isNode = (typeof module !== 'undefined' && !!module.exports),
    isConsoleAvailable = (typeof console !== 'undefined'),

    kFs = 'fs',

    methodNames = ['log', 'warn', 'info'],

    isEnabled = true,

    stream;

function noop() {}

function print(label, args) {
    var buffer = [],
        i, len;

    for (i = 0, len = args.length; i < len; i++) {
        buffer.push(args[i]);
    }

    stream.write(label + ': ' + buffer.join(',') + '\n');
}

function doPrint(name, args) {print('[' + name + ']', args);}

function doLog(name, args) {console[name].apply(console, args);}

function exec(method, name, args) {
    if (!isEnabled) {return;}

    method(name, args);
}

exports.enable = function() {isEnabled = true;};

exports.disable = function() {isEnabled = false;};

exports.initialize = function(file) {

    // To trick grunt-contrib-jasmine.
    var fs = require(kFs);

    if (typeof file === 'string') {
        stream = fs.createWriteStream(
            file, {flags: 'a+', encoding: 'utf8'}
        );

        return;
    }

    stream = file;
};

methodNames.forEach(function(name) {
    exports[name] = isNode ?
    function() {exec(doPrint, name, arguments);} : (
        isConsoleAvailable ?
        function() {exec(doLog, name, arguments);} :
        noop
    );
});
~~~

Apart from a few method name mappings, what the code does is exactly same as the former **stream** example.

> For the time of this writing, **o2.debug** logs synchronously using `window.console` in a **browser** environment; and it asynchronously logs to a stream in a **Node.JS** context.

Here’s a simple example that uses **o2.debug** module.

First install it through **npm**:

~~~
$ npm install o2.debug
~~~

Then use it in the **Node.JS** code as follows (*I’ll use the same big data set, for the sake of comparison*):

~~~
// file: examples/debug/node/debugtest.js

var debug = require('o2.debug');

debug.initialize('./test.log');

var data = '...................................................';

for (var i = 0, l = 22; i < l; i++) {
    data += data;
}

var start = Date.now();

debug.log(data);

console.log('wrote %d bytes in %dms', data.length, Date.now() - start);

process.on('exit', function() {
    console.log('exited');
    console.log('Total processing time: ' + Date.now() - start + 'ms.');
});
~~~

And here’s the output:

~~~
wrote 213909504 bytes in 345ms
exited
Total processing time: 923ms.
~~~

Yay! That’s the fastest of everything we’ve tried so far. And it’s **async**.

[o2.js]: https://github.com/v0lkan/o2.js

### Read the Source, Luke

All the code that we’ve discussed so far (*and some more*) can be found [in this **GitHub** history snapshot][debug-snapshot].

[debug-snapshot]: https://github.com/v0lkan/o2.js/tree/becf5c3557c19cedd0121c6a16313a3bc3e97637/examples/debug/node

### Conclusion

Let’s create a comparison matrix, of all the approaches we’ve used so far:

|                       | console (TTY) | console (nohup) | forever | Winston |  **o2.debug** |
|-----------------------|---------------|-----------------|---------|---------|---------------|
| **initial blocking time** | 16,532ms      | 1,107ms         | 2,703ms  | 1,742ms   | 345ms         |
| **total processing time** | 16,538ms      | 1,109ms         | 2,715ms   | 3,617ms   | 923ms         |
| **is it async?**                | FALSE         | FALSE           | FALSE   | TRUE    | TRUE          |

> It appears that **o2.debug** is **an order of magnitude** better in terms of **blocking time**. 

This is, of course, **not** a conclusive evidence that it works better than the rest. We need to consider other metrics like… CPU utilization, memory utilization, concurrent access, etc. 

And [o2.debug is open source][o2-debug-src], so if you feel like benchmarking it against other approaches, I’d love to see your results, and have your feedback.

> I’m actually using **o2.debug** in a production application, and it works pretty well. 
>
> I will blog about that application, and how it scales<br> 
(along the lines of “how to scale a **Node.JS** application like a boss”). 
>
> Until then… 
>
> **May the source be with you!**

[o2-debug-src]: https://github.com/v0lkan/o2.js/tree/master/src/o2/debug