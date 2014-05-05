The Secrets of High-Performance Mobile JavaScript Applications



<img src="http://o2js.com/assets/speed.png" alt="" title="Need 4 Speed" style="float:left;margin:1em 1em 3em 1em;padding:1em;">

> Mobile **JavaScript** development requires focus on different strategies and methodologies, than developing traditional web applications:
> 
> * The **processing power** (*both **CPU** and **GPU***) is limited; 
> * **Memory** is limited; 
> * And latency is a killer. 
> 
> Dealing with cache manifests and offline browsing are also important things to consider.

On top of all these, **memory leakage** is also a problem, because the application will most probably be a single page fat-client app, that will not be switched off for hours, or even days. 

Therefore, to create a fast (*near **60fps***) mobile **JavaScript** application that uses as little memory as possible, you might need to **unlearn** what you've learned before. 

> On **May, 22, 2014** [in HTML5 Developer Conference](html5devconf), [I will be talking about this very topic](html5devconf). 

My discussion will be revolving around the following subject matters:

* A deeply object-oriented architecture may be shooting yourself in the foot;
* Not using a library/framework should be the way to go, **if you can**;
* You should be as lean as possible (*i.e., the less objects you create, the better; the less the size of DOM, the better… and you might need special techniques like **DOM sharding***)

The bottom line is, **being minimalistic is your friend**: 

> If you need a banana, don't pass a gorilla that holds the banana and the entire jungle with it.

**You can** create applications that perform quite like their native counterparts, if you pay some extra attention to details.

And I will try to show you a way, and talk about **real-life best practices** to make your single page, fat client, hybrid **JavaScript** web application as snappy as its native counterparts.

Some of the techniques that I offer might seem arguable, and open to discussion. And it’s a good thing, because I won’t be talking about “the only way” that works; per contra I will be discussing “**a way that works all the time**” **;)**.

> If you want to learn more, [**»» meet me at the conference »»**](html5devconf). 

May the source be with you **;)**.

[html5devconf]: http://html5devconf.com/speakers/volkan_ozcelik.html