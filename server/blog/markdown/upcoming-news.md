Upcoming News



<a href="http://o2js.com/assets/mind_like_water_large.png"><img src="http://o2js.com/assets/mind_like_water.png" style="float:left;margin:2em;" alt="" title="Be like water; when you receive a pepple, give a 'pebble response'; when you receive a boulder, give a 'boulder response'; steadily evolve, while accepting and internalizing every experience you have on the road. — Because it’s the road that matters." /></a>

Although I have not written recently, there’s a lot going on behind the scenes.

Everything is gradually morphing into a better state. 

Since most of these are not (*yet*) publicly visible, I wanted to share the overall progress, along with my excitement, and passion.

<div style="clear:both;"></div>

Here are a few things on the way.

### I'm Turning **o2js.com** Into an Evergreen **Ebook**

This is one of my biggest works in progress. I’ve organized the content into sections and subsections as follows:

![](http://o2js.com/assets/sections.png "Sections")

I will be adding more to this. 

Basically, it will be a never-ending work, constantly updating itself.

> Since creating an **ebook** will be a serious effort, it “**might**” not be free — I am still thinking about the details.
>
> I will also add **special** sections to the ebook that will not be on the web version, to justify its price tag.
>
> By the way, the web version will **always** be free **forever**.

### Moving **o2.js** Into Small And Reusable Modules

> The current trend is being small, modular, independent, pluggable, and reusable. 
> 
> [Even **Yahoo!** ceased all new development on its monolithic **YUI** framework](https://news.ycombinator.com/item?id=8243523 "Discuss "Yahoo! Stopping All Developent on YUI" on hackernews.").

Via the same reasoning, I’ve logically split **o2.js** into **[24 smaller sub-modules](https://github.com/o2js "Visit o2.js on github.")**, each of them will be independent of each other, and will be maintained in a separate repository.

### Some Wheel Reinvention Is Due

We, human beings, learn by **imitation**.

Learning programming **patterns** and **paradigms** is no different:

* First you **copy** others’ code; 
* Then you think about how you can **extend **that code, and what you can do differently;
* And eventually you come up with your own **approach**, and **style**.

Of course, there are battle-tested solutions to almost any technical problem that you can imagine; however, creating things from scratch gives you a **deeper understanding** behind the magic about **why** things work the way they work. 

#### Curiosity Kills the Cat

> The insight you gain from the process is invaluable. I highly suggest you to regularly re-invent the wheel to expand your horizon.

Don’t get me wrong: If you are working on a real-life application, that will be used by a real audience, then **re-use** existing frameworks, libraries, and solutions as much as you can. 

> If you are learning new things, don’t fear to re-invent, fail, retry, break, and experiment.

Besides, sometime you do need something minimalistic, just to solve a domain-specific problem, where creating a tiny module from scratch might be a feasible solution.

#### New **o2.js** Modules

Having said that, I’ll be working on quite a few re-usable modules:

* A basic **string utilities** module;
* A browser-based **dependency-resolution** module (*like **[require.js](http://requirejs.org/ "require.js")**, yet much lightweight and simple*);
* A **converter** that converts the server-side **[CommonJS](http://nodejs.org/ "Node.JS")** modules, into a format that the above module uses (*similar to what **[browserify](http://browserify.org/ "Browserify")** does, with less voodoo magic*);
* A really simple **unit testing** library that integrates with **[Travis](https://travis-ci.org/ "Travis CI")**;
* Make that unit testing solution test the modules that are supposed to run on the browser too, by mocking certain **DOM** interactions;
* Create **code coverage reports** out of these unit tests.

All of these will also be the ingredients of quite a few articles, which I will be writing along the way.

### Stay Tuned **;)**

People who know me know that I’m **always** extremely busy with “things”. Which means that all of these aforementioned “reinvention”s will happen gradually, steadily, yet slowly.

Hope it will be a useful journey both for me, as well as for anyone who is passionate about creating, making, breaking, and **[hacking](http://o2js.com/are-you-ready-to-hack "Who Else Is Ready to Hack?")** things.