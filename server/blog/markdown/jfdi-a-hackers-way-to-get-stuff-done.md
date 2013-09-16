#JFDI: Get $#!% Done, Hacker Style



```
            ___         ___           ___
           /\  \       /\  \         /\  \          ___
           \:\  \     /::\  \       /::\  \        /\  \
       ___ /::\__\   /:/\:\  \     /:/\:\  \       \:\  \
      /\  /:/\/__/  /::\~\:\  \   /:/  \:\__\      /::\__\
      \:\/:/  /    /:/\:\ \:\__\ /:/__/ \:|__|  __/:/\/__/
       \::/  /     \/__\:\ \/__/ \:\  \ /:/  / /\/:/  /
        \/__/           \:\__\    \:\  /:/  /  \::/__/
                         \/__/     \:\/:/  /    \:\__\
                                    \::/__/      \/__/
```

### Don't Forget to Check Out the New **JFDI**

> After I initially wrote this article, **JFDI** improved a lot.
> <br><br>
> [See it's recent **README** for a complete summary](https://github.com/v0lkan/JFDI/blob/master/README.md).
> <br><br>
> I will be regularly updating [that **REAME** file](https://github.com/v0lkan/JFDI/blob/master/README.md) when I add new features to **JFDI**.

### Introduction

As a hacker, and a [geek][geek] I spend most of my time fiddling with the terminal.

And as any geek, I'm picky when it comes to the way I track my stuff to do.

I've tried a lot of online to do lists, and project management tools before. 

Some of the good ones are:

* **[Remember the Milk][rtm]**;
* **[Producteev][producteev]**;
* **[Todoist][todoist]**;
* And the 900 pound gorilla: **[Evernote][evernote]**.

[geek]: http://geekli.st/volkan
[rtm]: http://www.rememberthemilk.com/
[producteev]: https://www.producteev.com/
[todoist]: http://todoist.com/	
[evernote]: http://evernote.com/

> These are only a **minor subset** of literally\* hundreds of web, desktop, and mobile GTD applications that I've tried before.
> <br><br>
> \* and I use *literally* in the **literal** sense here.

Although these solutions are excellent at what they do, there was still some amount of friction to start using them.

### Speed, Simplicity, and Portability

Then I realized two things:

* When I'm doing stuff, 99% of the time I have a terminal window open (*actually in a regular day, I keep several of those command shells sitting around*);
* (this one is important) **the speed
and portability of a GTD solution is directly proportional with the frequency that I use it**.

So the faster the application felt, the less friction I would have in using it. That's not something new: 

[If the perceived speed of an application is slow, you will resist using it][speed].

What I would want from a [GTD][gtd] solution are… 

* **Speed**
* **Simplicity**
* And **Portability**.

And guess what:

* There's nothing **faster** than editing a plain text file;
* Editing a plain text file is **simpler**;
* Text files are extremely **portable**. 

You don't need any special editor to modify a text file. You can edit them in your mobile phone, on your tablet, on your desktop!

> I've found that what I was looking for was **simplicity**, not priorities, labels, date-pickers, or checkboxes.

[speed]: http://www.stevesouders.com/blog/2012/12/03/the-perception-of-speed/
[gtd]: http://en.wikipedia.org/wiki/Getting_Things_Done


### Meet **JFDI**

> A while ago I scribbled [this gist summarizing what **JFDI** philosophy was][jfdi-gist]; and then I wrote [the JFDI Manifesto][jfdi-manifesto].<br><br>
> You don't have to be a wizard to get a gist of what "JFDI" is, but those links might give you a different insight anyway.

The "JFDI" that I'll be mentioning here is a **[Node.JS][nodejs]** command line interface, that [I created as a **weekend hack**][jfdi-npm].

[jfdi-gist]: https://gist.github.com/v0lkan/2694911
[jfdi-manifesto]: https://gist.github.com/v0lkan/2731233
[nodejs]: http://nodejs.org
[jfdi-npm]: https://npmjs.org/package/jfdi

### **JFDI** in Action

It will be easier to show how **JFDI** works by examples.

#### Installation


First, you'll have to install **JFDI** (*you might need to have root privileges for that*).

```
$ npm instal -g jfdi
```

This will enable a global `jfdi` command that you can use from the terminal.


You can optionally alias `jfdi`, like

```
$ alias j=jfdi
```

to save some keystrokes.

That's all you need to install it.

#### First Time Use

Let's run it for the first time:

```
$ jfdi
```

Will display a message similar to this:

```
   ### JFDI List For Today ###

       *Zero Inbox* for today! Hooray!

       Sample Usage:
           Add a Goal       :  jfdi [-a] "Save the world; one goal at a time."
           List Goals       :  jfdi -l
           List All Commands:  jfdi -h
```

You can use `jfdi -a "something to do"` or just `jfdi "something to do"`

#### Help

Let's try to get some help.

```
$ jfdi -h
```

Will display the following synopsis:

```
  Usage: jfdi [options] [command]

  Commands:

    today                  ... truncated ...
    tomorrow               ... truncated ...
    all                    Lists today's and tomorrow's goals.

  Options:

    -h, --help             output usage information
    -V, --version          output the version number
    -a, --add <goal>       Add a goal to the top of the queue.
    -f, --find <keyword>   Search for goals.
    -d, --defer <id>       Move the goal with id <id> ...
    -e, --expedite <id>    Move the goal with id <id> ...
    -p, --prioritize <id>  Move the goal with id <id> to the top...
    -l, --list             List the goals in the queue.
    -t, --tomorrow         List tomorrow's goals.
    -x, --do <id>          Completes the goal with the given id <id>.
```

#### Adding **JFDI** Goals

Let's try a few simple examples to see this in action. You might need **root privileges** for this action, too.

```
$ jfdi "write a blog post about JFDI";
$ jfdi "spread the love about JFDI";
$ jfdi "buy milk";
$ jfdi "save the world";
```

This will update `/usr/local/lib/node_modules/jfdi/data/todo.txt` (*the path may be different depending on your operating system*) and then display you a nicely formatted **goal list**:

```
   ### JFDI List For Today ###

   0 save the world
   1 buy milk
   2 spread the love about JFDI
   3 write a blog post about JFDI

```

#### Deferring a **JFDI** Goal

Let's assume that I don't want to save the world today, and I'm not in my milk mood too.

```
$ jfdi --defer 0

   ### JFDI List For Today ###

   0 buy milk
   1 spread the love about JFDI
   2 write a blog post about JFDI
   
$ jfdi --defer 0

   ### JFDI List For Today ###

   0 spread the love about JFDI
   1 write a blog post about JFDI
```

Now I only have two things in my agenda. And where have the other stuff gone? 

To `/usr/local/lib/node_modules/jfdi/data/tomorrow.txt`

#### Listing Deferred **JFDI** Goals

So let's see what we have there:

```
$ jfdi tomorrow
```

will produce this output:

```
   ### Upcoming JFDI Stuff ###

   0 buy milk
   1 save the world
```

#### ZenLike – It's Just Plain Text

The beauty of this application is that the text files have no special formatting in them.

so you can do

```
vim /usr/local/lib/node_modules/jfdi/data/tomorrow.txt
```

which will simply show

```
buy milk                                                                                                                                                  
save the world
```

Each line corresponds to a **JFDI** goal; the item on the top has the highest priority. 

> No labels, no checkboxes, no buttons to click… just a beautifully simple and plain text file!

#### **JFDI** is Portable

And portability is a snap:

* You can create a [symbolic link][symlink] of my data folder to your [Dropbox][dropbox];
* You can use an editor like [TextTastic][textastic] to update and synchronize my data folder using my tablet or mobile phone;
* You can work offline. I don't need to be connected to the internet to work on my **JFDI** list. 

[symlink]: http://kb.iu.edu/data/abbe.html
[dropbox]: http://dropbox.com/
[textastic]: http://www.textasticapp.com/

#### Expediting a **JFDI** Goal

Back to our **JFDI** list. Let's assume I've decided to go out and buy some milk

```
$ jfdi tomorrow

   ### Upcoming JFDI Stuff ###

   0 buy milk
   1 save the world

$ jdfi --expedite 0

   ### JFDI List For Today ###

   0 buy milk
   1 spread the love about JFDI
   2 write a blog post about JFDI

```

#### Marking a **JFDI** Goals as **Done**

Voila! Milk is on the top of my current agenda.

Marking a **JFDI** goal as *done* is equally simple:

```
$ jfdi -x 2

   ### JFDI List For Today ###

   0 buy milk
   1 spread the love about JFDI
```

### Summary

**JFDI** was a hack that I came up within half of a weekend day. 

It is incomplete, and I'm sure it has a lot of room for improvement. Feel free to share your ideas by [opening an issue in the github repository][jfdi-issues].

It has a lot of work to do. 

So if you feel like helping [fork **JFDI** at github »»][jfdi-github].

[jfdi-issues]: https://github.com/v0lkan/JFDI/issues
[jfdi-github]: https://github.com/v0lkan/JFDI