See How Easily You Can Create a Promise



> This is the **first** part of a **three** part series. 
> 
> * In this current part we will be **creating** a **Promise**; 
> * In the second part we will discuss practical uses of **[Promises][spec]**; 
> * And in the final part we will discuss **[anti-patterns][anti-pattern]** related to **Promises**.

### Introduction

<img src="http://o2js.com/assets/schrodinger.png?2" alt="the destiny of a Promise can be anything." style="float:left;border:1px #ccc solid;margin:1em;">

If you are a front end developer, and you have not been living in a cave for the recent few years, you should have heard about [**various JavaScript Promise implementations**][spec], and (*more recently*) [**native EcmaScript Promises**][ecma].

The idea of **Promises** is nothing new; it stems from [the category theory][monad-theory]: At the very basis, a **Promise** represents the *possible* outcome of a *future* computation.
 
Or to put it simpler, a **Promise** encapsulates the result of a **future** task.

<div style="clear:both;"></div>

Similar to the infamous [“Schrodinger’s cat” thought experiment][cat], you will not know a **Promise**’s final fate before it’s actually <strong>fulfilled</strong>. 

The **fulfillment** of a promise collapses its state to a **single immutable truth**:

> Similar to the [cat experiment][cat], when the cat is dead, it’s dead. That is to say, when the destiny (*i.e., the **state***) of a **Promise** is set, the **Promise** is **read-only**. It’s **frozen** in time, and there’s no way to alter its representation.

[monad-theory]: http://en.wikipedia.org/wiki/Monad_(category_theory)
[ecma]: https://people.mozilla.org/~jorendorff/es6-draft.html#sec-promise-objects
[cat]: http://en.wikipedia.org/wiki/Schr%C3%B6dinger's_cat

### Agenda

In this article…

* We will be briefly defining what **Monads** are, and why **Promises** are (*like*) **Monads**;
* Implementing a **Promise**;
* While [mentioning the relevant sections of the Promises/A+ spec][spec] on our way.

> I highly recommend you to **[read the spec before reading this article any further][spec]**, because things are about to get “a little” confusing.

[anti-pattern]: http://en.wikipedia.org/wiki/Anti-pattern

### **Promises** Have **Monadic** Behavior

Here is the [wikipedia definition of a **Monad**][monad]:

> A **monad** is a structure that represents computations defined as sequences of steps. A **type** with a monad structure defines what it means to **chain** operations, or **nest** functions of that type together. This allows the programmer to build **pipelines** that process data in steps, in which each action is **decorated** with additional **processing rules** provided by the monad.

So what’s a **Promise**?

> A **Promise** is an object that represents the result of a **future computation**. The `then` method of the **Promise** defines a way to **chain** those computations, or **nest** two **Promises**, so that the ultimate and final fate of the inner **Promise**, once determined, cascades and affects the fate of the outer **Promise**. This allows the programmer to build **pipelines** that process asynchronous operations as if they were a synchronous series of events. The **Promise** is **decorated** with additional **processing rules** provided by the [Promises A+ Spec][spec].

See the similarity?

Moreover, the fact that [there are Monad constructs that act like a **Promise**][par] also supports [Douglas Crockford’s discussion][gonad] that a **Promise** is, in deed, a **[Monad][monad]**.

> I’ll stop the **Promise**/**Monad** debate here, because the topic of “*Monadic Behavior in JavaScript*” requires a separate blog post on its own. 
>
> Rest assured, we will be having enough of a brain meld in this article, even without diving into the **zen** of **Monads**.

[monad]: http://en.wikipedia.org/wiki/Monad_(functional_programming)
[gonad]: https://www.youtube.com/watch?v=dkZFtimgAcM
[spec]: http://promises-aplus.github.io/promises-spec/
[par]: http://hackage.haskell.org/package/monad-par-0.3/docs/Control-Monad-Par.html

### Sir! Can You Use “Plain English” Please

Simply put, a **Monad** is a **wrapper** function around a **value**. So by calling that function, you get the **value**.

There are also [three monadic laws][monad-laws] that a **Monad** has to conform to.

A **Promise** is an object that walks like a **Monad**, talks like a **Monad**; therefore, for those who do not live in an ivory tower of statelessness, a **Promise** is a **Monad**.

> Similar to the fact that [monadic laws][monad-laws] define the behavior of a **Monad**, the behavior of a **Promise** is governed by promise **specifications**. The most popular, and well-laid-out specification is [the Promises/A+ Spec][spec]. 
> 
> So in this article we will be adhering to that spec.

Still not clear?

Let’s start building a **Promise**; `then` I **promise** everything will be clearer.

[monad-laws]: http://www.haskell.org/haskellwiki/Monad_laws

### The **Promise** Interface

As per the specification, [a **Promise** is nothing but an **Object** with a **then** method][spec]. 

At any time a promise can be either **PENDING**, or **FULFILLED**, or **REJECTED**. 

When the promise is constructed, its initial state is **PENDING**.

The `then` method of the promise takes two arguments: **onFulfilled**, and **onRejected**. Both of these arguments are **optional**. These arguments are the delegates that will be executed when the promise transitions to a non-**PENDING** state.

Here is an initial implementation, to begin with:

~~~
// src/o2/then/promise/core.js

'use strict';

/**
 * @module o2.then
 */

/**
 * @class o2.then.Promise
 */

function isPending(promise) {throw 'Not Implemented';}
function enqueue(promise, onFulfilled, onRejected) {throw 'Not Implemented';}
function handleNext(promise, onFulfilled, onRejected) {throw 'Not Implemented';}

function Promise() {}

/**
 * @method then
 * @final
 *
 * @param {Function} [onFulfilled]
 * @param {Function} [onRejected]
 *
 * @returns {Promise}
 */
Promise.prototype.then = function(onFulfilled, onRejected) {
    if (isPending(this)) {
        return enqueue(this, onFulfilled, onRejected);
    }

    return handleNext(this, onFulfilled, onRejected);
};

module.exports = Promise;
~~~
If the promise is in a **PENDING** state, we queue the handlers (via the **enqueue** method). 

> In other words, we **defer** the resolution of the promise as long as it remains **PENDING**. 

Let’s leave the **isPending**, **enqueue**, and **handleNext** methods unimplemented for a while. We’ll revisit them soon.

### Moving Privates To Their Own Module

One thing that might be useful at this stage though, would be to move those unimplemented methods into a separate module: 

~~~
// src/o2/then/promise/core.js

...

var privates = require('./privates/core'),
    isPending = privates.isPending,
    enqueue = privates.enqueue,
    handleNext = privates.handleNext;
...
~~~

Why? 

Because sometimes we feel that a privately-scoped function might belong to a helper/utility module, so that other modules can also benefit from its functionality. 

If we move the private methods to their own modules **from day one**, then they will have minimal-to-zero dependency to their owner module; and it will be much easier to extract them out to a more general-purpose file.

Additionally, this approach gives us the ability to **test** our private methods. 

### Wait… Isn’t Testing Private Methods a **Bad** Thing?

Although testing private methods may be considered as an **anti-pattern**, the hard reality of building real-life applications begets the fact that sometimes we **do** need to test private methods. 

> Saying “private methods do not need testing”, is like saying “a car is fine as long as it drives okay”.
> 
> First of all, it’s not that easy to **define** “okay”.
> 
> Secondly, even if the driver is not noticing anything, things may start to degrade in time. A bolt gets loose, a sensor starts malfunctioning, the engine might start leaking oil… $#!% happens not only in real life, but also software projects.
> 
> That’s why mechanics don’t just sit in the cockpit and drive the car to fix it. Quite the opposite, they test the **internals** of the car. They open the hood and play with the car’s private parts.

At least it’s good to know that this “moving privates to their own module” approach gives us the **freedom** to test the private parts, **if/when** we need to.

### The **Deferred**

For proper [separation of concerns][soc], a **Promise** should not be able to fulfill itself (*i.e., the user of a promise should not have any control over the promise’s state transition*).

One way to do this is to create a **Deferred** object that exports a **Promise** interface.

> The **Deferred** will export a **promise** interface which is a **Promise**. The **Deferred** will have methods to **resolve** and **reject** the **Promise** that it manages, whereas the **promise** interface it exports won’t publicly have those methods.

Let’s start with creating the skeleton of a **Deferred** first:

~~~
// src/o2/then/deferred/core.js

'use strict'

/**
 * @method Deferred
 * @constructor
 */
function Deferred() {
}

/**
 * @method resolve
 * @final
 *
 * @param value
 */
Deferred.prototype.resolve = function(value) {
    throw 'Not Implemented';
};

/**
 * @method reject
 * @final
 *
 * @param reason
 */
Deferred.prototype.reject = function(reason) {
    throw 'Not Implemented';
};

module.exports = Deferred;
~~~

### **Deferred** States

A **Deferred** can be in one of the following states:

~~~
// src/o2/then/defererd/state/core.js

'use strict';

exports.PENDING = 0;
exports.FULFILLED = 1;
exports.REJECTED = -1;
~~~

### The **Deferred** Constructor

Now let’s add a few attributes to the **Deferred** constructor, and make it export a **promise** interface.

~~~
/**
 * @method Deferred
 * @constructor
 */
function Deferred() {
    this.state = state.PENDING;
    this.outcome = null;
    this.futures = [];
    this.promise = new Promise(this, Deferred);
}
~~~

Where…

* **state** is the current state of the **Deferred**; 
* **outcome** is its value when the **Promise** it manages gets fulfilled; 
* **futures** is basically a [queue][queue] that’s populated when [`then` is called multiple times on the **promise**][spec-36]. 
* **promise** is the **Promise** interface that the **Deferred** exposes to the world.

> **Aside**:
> 
> Here, we are injecting the **Deferred** object as a [dependency][di] into the **Promise** constructor.
> 
> Should you want looser coupling between the **Promise** and its owner **Deferred**, you could choose a [PubSub implementation][pubsub] instead.
> 
> In this article, we will use dependency injection, because it’s easier to follow. 
> 
> There’s no need to introduce an additional level of abstraction to an already-convoluted concept.

[queue]: http://en.wikipedia.org/wiki/Queue_(abstract_data_type)
[soc]: http://en.wikipedia.org/wiki/Separation_of_concerns
[spec-36]: http://promises-aplus.github.io/promises-spec/#point-36
[di]: http://en.wikipedia.org/wiki/Dependency_injection
[pubsub]: http://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern

### “Resolving” and “Rejecting” a **Deferred**

The resolution of the **Deferred** is done by two methods. Namely, **resolve**, and **reject**:

Let’s start with the simpler one:

~~~
// src/o2/then/deferred/core.js

/**
 * @method reject
 * @static
 * @final
 *
 * @param reason
 */
Deferred.prototype.reject = function(reason) {
    this.state = state.REJECTED;
    this.outcome = reason;

    reject(this, reason);

    this.reject = noop;
};
~~~

When rejecting a **Deferred** we update its state from **PENDING** to **REJECTED**; we update its outcome with the **reason** of rejection; and then we run a rejection procedure (*i.e., `reject(this, value)`*). We will come to the rejection procedure soon.

And when a **Deferred** is **resolved** we do the following:

~~~
// src/o2/then/deferred/core.js

/**
 * @method resolve
 * @final
 *
 * @param value
 */
Deferred.prototype.resolve = function(value) {
    if (isPromise(value)) {
        chain(this, value);

        this.resolve = noop;

        return;
    }

    resolve(this, value);

    this.resolve = noop; \\ (*)
};
~~~

One obvious difference here is, if the **value** that we are trying to resolve is a **Promise**, then we **chain** it. Otherwise, we run the resolution procedure (*i.e., `resolve(this, value)`*).

The **chain** method makes our **Deferred** wait for the **value** (*which is a **Promise***) to be **fulfilled**(\*\*) before resolving itself.

As per the specification, [you cannot resolve or reject a deferred more than once][spec-29]. Thus when we **reject** a deferred, we set the **reject** method to **noop**, where **noop** is simply an anonymous function.

We’ll come to the **chain** and **resolve** methods shortly.

> **Aside**:
> 
> \* – Setting `this.reject` and `this.resolve` to `noop` at the end of the method ensures that once **state** and **outcome** of the **Deferred** are set, they are **final**, **immutable**,  and will never change.
> 
> \*\* – A **Promise** is said to be **fulfilled** when its owning **Deferred** is **resolved** or **rejected**.

[spec-29]: http://promises-aplus.github.io/promises-spec/#point-29

### The **Promise** Constructor

While we are at there, let us modify the **Promise** constructor too:

~~~
// src/o2/then/promise/core.js

/**
 * @method Promise
 * @constructor
 *
 * @param ownerDeferred
 * @param DeferredConstructor
 */
function Promise(ownerDeferred, DeferredConstructor) {
    this.deferred = ownerDeferred;
    this.Deferred = DeferredConstructor;
}
~~~

Again, it’s nothing fancy: We’ve already injected the dependencies to the **Promise** constructor when we created the **Deferred** constructor above. Here, we are just assigning those dependencies as member variables to the promise.

Let’s introduce another concept called “**Future**”.

### **Futures**

A **Future** is an entity that abstracts a future computation.

There **Future** constructor takes a **Deferred**, an **onFulfilled** delegate, and an **onRejected** delegate.

* The **onFulfilled** delegate is called when **resolving** the **Future**;
* And the **onRejected** delegate is called when **rejecting** the **Future**.

Here is the **Future** constructor:

~~~
// src/o2/then/future/core.js

/**
 * @method Future
 * @constructor
 *
 * @param deferred
 * @param onFulfilled
 * @param onRejected
 */
function Future(deferred, onFulfilled, onRejected) {
    this.deferred = deferred;
    this.onFulfilled = onFulfilled;
    this.onRejected = onRejected;
}
~~~

The **resolve** and **reject** methods of the **Future** object simply delegate the operation to a private `handle(deferred, delegate)` method, as follows:

~~~
// src/o2/then/future/core.js

/**
 * @method resolve
 * @final
 *
 * @param value
 */
Future.prototype.resolve = function(value) {
    handle(this.deferred, 
        isFunction(this.onFulfilled) ? 
        this.onFulfilled : identity, value
    );
};

/**
 * @method reject
 * @final
 *
 * @param reason
 */
Future.prototype.reject = function(reason) {
    handle(this.deferred, 
        isFunction(this.onRejected) ? 
        this.onRejected : identity, reason
    );
};
~~~

As per the specification, [both **onFulfilled** and **onRejected** are optional][spec-23]. Therefore, the **onFulfilled** and **onRejected** arguments that the **Future** uses might be **undefined**. In that case, we simply use a pass-through [identity function][identity].

How the **handle** method operates [has also been defined in greater depth in the specification][spec-resolution]. 

Here is a way of implementing **handle**:

~~~
// src/o2/future/privates/core.js

'use strict';

var next = require('../../node_modules/o2.functional/core').next,

    kCircularResolution = 'Cannot resolve a promise with itself';

/**
 * @param deferred
 * @param handler
 * @param value
 */
exports.handle = function(deferred, handler, value) {
    next(function() {
        var returnValue;

        try {
            returnValue = handler(value);
        } catch (e) {
            deferred.reject(e);

            return;
        }

        if (returnValue === deferred.promise) {
            deferred.reject(
                new TypeError(kCircularResolution)
            );
        } else {
            deferred.resolve(returnValue);
        }
    });
};
~~~

The **next** function works similar to [window.setTimeout][set-timeout] or [process.nextTick][next-tick]. We have to use it, because as per the specification, [the resolution of a **Future** should be done with a **fresh execution stack**][spec-67].

Executing **handle** with a fresh call stack actually makes a lot of sense too: 

Delegating the execution of **handle** to the next tick allows us to be able to call the **then** method of a **Promise** multiple times and **queue** the resulting **Future**s.

Here are a few other remarks:

* The **Deferred** that the **Future** is bound to is **fulfilled** with the **returnValue** of our handler function;
* When an **error** occurs when executing the **handler**, the bound **Deferred** is immediately **rejected**;
* If the **returnValue** of the **handler** cannot be the **Deferred**’s associated **Promise**; otherwise it will be a circular call.

> In summary, if everything goes well, the bound **Deferred** is **resolved** with the **returnValue** of the **handler** function; otherwise the **Deferred** will be **rejected** with a **reason**.

An immediate question is: “…and how exactly does the **Deferred** get fulfilled or rejected?”, which we will analyze next.

[identity]: http://en.wikipedia.org/wiki/Identity_function
[next-tick]: http://howtonode.org/understanding-process-next-tick
[set-timeout]: https://developer.mozilla.org/en-US/docs/Web/API/Window.setTimeout
[spec-resolution]: http://promises-aplus.github.io/promises-spec/#the_promise_resolution_procedure
[spec-67]: http://promises-aplus.github.io/promises-spec/#point-67
[spec-23]: http://promises-aplus.github.io/promises-spec/#point-23

### Fulfilling a **Deferred**

Let’s do a recap: Here’s how **resolve** and **reject** methods of our **Deferred** look like:

~~~
/**
 * @method resolve
 * @final
 *
 * @param value
 */
Deferred.prototype.resolve = function(value) {
    if (isPromise(value)) {
        chain(this, value);

        this.resolve = noop;

        return;
    }

    resolve(this, value);

    this.resolve = noop;
};

/**
 * @method reject
 * @static
 * @final
 *
 * @param reason
 */
Deferred.prototype.reject = function(reason) {
    this.state = state.REJECTED;
    this.outcome = reason;

    reject(this, reason);

    this.reject = noop;
};
~~~

What we have not covered so far, though, is the internals of those private **resolve** and **reject** methods.

**Resolving** and **rejecting** a deferred is relatively straightforward:

* We first update the **state** and the final **outcome** of the **Deferred** instance;
* And then we **resolve** or **reject** all of its associated **Future**s.

~~~
// src/o2/then/deferred/core.js

/**
 * @param deferred
 * @param value
 */
exports.reject = function(deferred, value) {
    deferred.state = state.FULFILLED;
    deferred.outcome = value;

    rejectFutures(deferred, value);
};

/**
 * @param deferred
 * @param value
 */
exports.resolve = function(deferred, value) {
    deferred.state = state.FULFILLED;
    deferred.outcome = value;

    resolveFutures(deferred, value);
};
~~~

… where **resolveFutures** and **rejectFutures** are just simple iterations:

~~~
// src/o2/deferred/privates/privates/core.js

/**
 * @param deferred
 * @param value
 */
exports.resolveFutures = function(deferred, value) {
    var futures = deferred.futures,
        i, len;

    for (i = 0, len = futures.length; i < len; i++) {
        futures[i].resolve(value);
    }

    deferred.futures = null;
};

/**
 * @param deferred
 * @param reason
 */
exports.rejectFutures = function(deferred, reason) {
    var futures = deferred.futures,
        i, len;

    for(i = 0, len = futures.length; i < len; i++) {
        futures[i].reject(reason);
    }

    deferred.futures = null;
};
~~~

### Chaining a **Promise**

If the **value** we are trying to resolve in `deferred.resolve(value)` is a **Promise**, or something that *acts like* a **Promise** (*i.e., a [thenaable][spec-7]*), then our **Deferred** [needs to **wait** for the **resolution** of that promise][spec-50]. 

> The concept of a **Deferred** waiting for the **resolution** of another **Promise** before resolving its own promise is commonly known as **promise chaining**. This is one of the most powerful features of **promises**.

Here is the implementation of the **chain** method:

~~~
// src/o2/deferred/privates/privates/core.js

/**
 * @param deferred
 * @param promise
 */
exports.chain = function(deferred, promise) {
    var processed = false,
        resolve = exports.resolve,
        reject = exports.reject,
        chain = exports.chain;

    try {
        promise.then(
            function(value) {
                if (processed) {return;}

                processed = true;

                if (isPromise(value)) {
                    chain(deferred, value);

                    return;
                }

                resolve(deferred, value);
            },
            function(reason) {
                if (processed) {return;}

                processed = true;

                reject(deferred, reason);
            }
        );
    } catch (exception) {
        (function() {
            processed = true;

            reject(deferred, exception);
        }());
    }
};
~~~

Basically…

* When our chained **Promise** is resolved, we resolve our **Deferred**; 
* And if our chained **Promise** is resolved with another **Promise**, then we again wait for the resolution of that **Promise** by calling **chain** again.

> **Aside**: 
> 
> Although calling `chain()` inside **exports.chain** feels like [recursion][recursion], it is **not**, because the **then** method (*and therefore the **chain** method*) will be called **asynchronously** in a totally separate **execution stack**.

> **Caveat**: 
> 
> Note that we use a separate **resolve** method (*as in `resolve(deferred, value)`*) instead of calling `deferred.resolve(value)`. 
> 
> Remember that we’ve set **deferred.resolve** to **noop** via “`this.resolve = noop;`” in **Deferred.prototype.resolve** above. 
> 
> So calling `deferred.resolve(value)` would have been a **noop** that does not do anything at all, which is not the expected behavior we want.

[spec-7]: http://promises-aplus.github.io/promises-spec/#point-7
[spec-50]: http://promises-aplus.github.io/promises-spec/#point-50
[recursion]: http://en.wikipedia.org/wiki/Recursion

### **Promise.then**

Let’s revisit to our **Promise** to see its internals:

~~~
// src/o2/then/promise/privates/core.js

Promise.prototype.then = function(onFulfilled, onRejected) {
    if (isPending(this)) {
        return enqueue(this, onFulfilled, onRejected);
    }

    return handleNext(this, onFulfilled, onRejected);
};
~~~

Here’s the helper **isPending** method:

~~~
// src/o2/then/promise/privates/privates/core.js

/**
 * @param promise
 */
exports.isPending = function(promise) {
    return getState(promise) === state.PENDING;
};
~~~

where…

~~~
// src/o2/then/promise/privates/privates/privates/core.js

/**
 * @param promise
 * @returns {state}
 */
exports.getState = function(promise) {
    return promise.deferred.state;
};
~~~

### **enqueue** and **handleNext**

**enqueue**, and **handleNext** methods should also return **Promises**, because [the spec states that the **then** method of a **Promise** must always return a *new* **Promise**][spec-39].

Here’s how these methods look like:

~~~
/**
 * @param promise
 * @param future
 */
exports.enqueue = function(promise, future) {
    promise.deferred.futures.push(future);
};

/**
 * @param promise
 * @param future
 */
exports.handleNext = function(promise, future) {
    var currentState = exports.getState(promise),
        currentOutcome = getOutcome(promise),
        resolve = resolution[currentState];

    if (!resolve) {return;}

    resolve(future, currentOutcome);
};
~~~

> A **Promise** is said to be in a **PENDING** state, when its owner **Deferred** is in a **PENDING** state.

Since [`promise.then(fnFulfill, fnReject)` may be called multiple times][spec-36], if/when the status of the **Promise** is **PENDING**, we push all these future computations to the **futures** member of the **Deferred** via the `enqueue(promise, future)` call.

And once the promise gets **FULFILLED** or **REJECTED**, we immediately handle it (*via the `handle(promise, future)` call*).

`getOutcome(promise)` is equivalent to `promise.deferred.outcome`.

`enqueue(currentPromise, future)` creates a new **Future** with a new **Deferred**, queues it, and returns that deferred’s **promise** interface. It populates the **futures** collection, to be processed with the current deferred’s (*i.e. the **owner** deferred of the **currentPromise***) resolution.

`handleNext(promise, future)` creates a new **Future** with a new **Deferred**, handles it, and returns that **deferred**’s **promise** *interface*.

Internally, **enqueue** is nothing but an array push operation; **handleNext** is slightly more involved, though:

* We first create a **resolution [strategy][strategy]**,
* Then we **resolve** our **future**, using this strategy, with the outcome of our **promise**.

And the resolution strategy is a mapping of various states to handlers, as we will see next.

[strategy]: http://en.wikipedia.org/wiki/Strategy_pattern
[spec-39]: http://promises-aplus.github.io/promises-spec/#point-39

### The Resolution **Strategy**

Here’s how the the above **resolution** [strategy][strategy] works:

~~~
// src/o2/then/promise/privates/privates/privates/strategy.js

'use strict';

...

/**
 * @param future
 * @param outcome
 */
resolutionStrategy[state.PENDING] = function(future, outcome) {
    void future;
    void outcome;
};

/**
 * @param future
 * @param outcome
 */
resolutionStrategy[state.FULFILLED] = function(future, outcome) {
    future.resolve(outcome);
};

/**
 * @param future
 * @param outcome
 */
resolutionStrategy[state.REJECTED] = function(future, outcome) {
    future.reject(outcome);
};

exports.resolution = resolutionStrategy;
~~~

That’s all we had to do to create a **[Promises/A+][spec]** compliant **Promise** implementation.

There’s one last thing to do though: Exposing a simpler public interface.

### The **o2.then** Public Interface

At minimum, we will need to export a **defer** method that returns a new **Deferred**:

~~~
// src/o2/then/core.js

...


/**
 * Returns a `Deferred` **d**, where…
 *
 * * `d.resolve(value)` resolves the deferred,
 * * `d.reject(reason)` rejects the deferred.
 * * `d.promise` is a "thenable"  Promises/A+ compliant promise interface.
 * 
 * @method defer
 * @static
 * @final
 *
 * @returns {Deferred}
 */
exports.defer = function() {
    return new Deferred();
};
~~~

### Let’s Test Our Code

The entire code that we’ve discussed so far is also [available through **npm**][npm-then].

To play with it, let’s create a test folder and fetch the code first:

~~~
$ mkdir test
$ cd test
$ npm init
$ npm install o2.then

npm WARN package.json test@0.0.0 No description
npm WARN package.json test@0.0.0 No repository field.
npm WARN package.json test@0.0.0 No README data
npm http GET https://registry.npmjs.org/o2.then
npm http 304 https://registry.npmjs.org/o2.then
npm http GET https://registry.npmjs.org/o2.functional/0.1.1
npm http GET https://registry.npmjs.org/o2.validation/0.2.0
npm http 304 https://registry.npmjs.org/o2.functional/0.1.1
npm http 304 https://registry.npmjs.org/o2.validation/0.2.0
o2.then@0.2.2 node_modules/o2.then
├── o2.validation@0.2.0
└── o2.functional@0.1.1

$ vim index.js
~~~

And let the contents of **index.js** be as follows:

~~~
'use strict';

var then = require('o2.then/core'),
    deferred = then.defer(),
    promise = deferred.promise;

setTimeout(function() {
    deferred.resolve('o2js.com:');
}, 1000);

promise.then(function(value) {
    console.log(value);

    var deferred = then.defer();

    setTimeout(function() {
        deferred.resolve(value + ' A coherent');
    }, 1000);

    promise = deferred.promise;

    promise.then(function(value) {
        console.log(value);

        var deferred = then.defer();

        setTimeout(function() {
            deferred.resolve(value + ' solution');
        }, 2000);

        return deferred.promise.then(function(value) {
            return value + ' to your JavaScript';
        });
    }).then(function(value) {
        console.log(value);

        return value + ' dilemma!';
    }).then(function(value) {
        console.log(value);
    });

    return promise;
}).then(function(value) {
    console.log(value);
});

promise.then(function(value) {
    console.log(value);
});
~~~

The output will be:

~~~
o2js.com:
o2js.com:
o2js.com: A coherent
o2js.com: A coherent
o2js.com: A coherent solution to your JavaScript
o2js.com: A coherent solution to your JavaScript dilemma!
~~~

Of course, this is just a dummy sample application. We will be diving into more practical **Promise** use cases in the next article of this series.

[npm-then]: https://www.npmjs.org/package/o2.then

### Read the Source, Luke

You can visit the version of the code that’s discussed in this article [in this **GitHub** history snapshot][git-then].

You can also install the most up-to-date code of this project may be [via npm][npm-then].

[git-then]: https://github.com/v0lkan/o2.js/tree/11614f9280e7543446cdaf28857f8357e7047e44/src/o2/then

### Conclusion

You can easily see how **Promises** flatten the [callback hell][hell], and make the code more manageable, and, actually, that’s   the least important reason why **Promises** are useful. You might also want to [read Domenic’s excellent article to not to miss the point of **Promises**][promise-domenic].

> Once you get used to the overall **Promise** idiom, you will never go back.
> 
> You will see every **async** callback as a **Promise**.
> 
> When you see your peers using [continuation-passing style][cps] **callbacks**, you will impatiently ask them why they are not using **promises** instead.

This was just a very basic **[Promise][spec]** implementation. Feel free to use it in production, if you like.

And there are several other excellent **Promise** libraries though:

* **[Q][promise-q]** A full-featured **Promise** library with a large, powerful API surface, adapters for **Node.js**, progress support, and preliminary support for long stack traces.
* **[RSVP.js][promise-rsvp]**: A very small and lightweight, and still fully compliant, **Promise** library.
* **[when.js][promise-when]**: A **Promise** library with utilities for managing collections of eventual tasks, as well as support for both progress and cancellation.

[promise-when]: https://github.com/cujojs/when
[promise-q]: https://github.com/kriskowal/q
[promise-rsvp]: https://github.com/tildeio/rsvp.js
[promise-domenic]: http://domenic.me/2012/10/14/youre-missing-the-point-of-promises/
[hell]: http://callbackhell.com/
[cps]: http://en.wikipedia.org/wiki/Continuation-passing_style

### Next Up?

In the next part of the series, we will be looking at promise **patterns** and **best practices**.

Until then…

**May the source be with you**!