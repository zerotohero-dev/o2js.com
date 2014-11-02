Hello Node.JS Blogging World



### What?

This is the initial step of my *very-long-term* plan of *converting*/*porting* all of my sites and projects to a **MongoDB/Markdown/NGINX/Node.JS** stack.

### Why?

* Because **[MongoDB](http://www.mongodb.org/)** is one of the best **NoSQL** document stores;
* Because **[NGINX](http://wiki.nginx.org/Main)** is the fastest and the most scalable server on earth;
* Because **[Node.JS](http://nodejs.org/)** is cool (*and it's damn fast, too*);
* Because **[Markdown](http://daringfireball.net/projects/markdown/syntax)** enables you to write stuff without thinking about formatting. **Markdown** is crisp, clean, and readable.

See it for yourself. Doesn't the following **Markdown** image of this blog post simply look beautiful?:

[![Markdown screenshot](http://o2js.com/assets/markdownsm.png)](http://o2js.com/assets/markdown.png)

Editing a **Markdown** document is way better than fighting your way through your "*what you see is what you don't always get*" rich text editor.

> It sucks to realize that your beloved editor has decided to "*cleverly*" format "*your*" text behind your back.

### The Setup

This site has been created with **[Node.JS](http://nodejs.org/)**, exported to a static site using **Node.JS** and is currently *reverse-proxied* to an **[NGINX](http://wiki.nginx.org/Main)** server through **[IIS 7](http://www.iis.net/)**.

I know, it's more complicated than it should be. And I have my reasons. I will write about the specifics of *how I did that*, in a follow-up post.

> Oh, btw., this blog is really minimaslistic: It does not have a *comment* feature **yet**. So **[feel free to tweet me](http://twitter.com/linkibol/)**, if you have comments, or questions.

#### For God's Sake; Why **IIS**?!

I need **[IIS 7](http://www.iis.net/)** for a transitional period. Otherwise I will have to rent another server, maintain two servers simultaneously, setup DNS for the new server. It's not worth the hassle.

I have a dedicated Windows Server anyways, and I have **8 CPU cores** and **plenty of idle memory**. So creating a virtual server and proxying/port-forwarding requests to this server is a plausible option.

> I could have done the other way around: i.e. I could have rented a dedicated linux server; run a virtual windows box in it; configured **IIS**; created an **SMTP** server; setup **PHP**; imported all the sites; imported databases; reconfigured **mySQL** (*my.ini*); configured other tools that I use occasionally (*like a jabber server*)… and the like – And it would have been **a lot of redundant work** for a server that I would be dumping in the long run, anyway.

Yes a virtual box has a **minor** performance overhead; and it has its benefits, too:

> Since I'm playing with a brand new environment, it's possible that I may mess things up. With a virtual server, I can take a snapshot of the entire system before I feel  "*experimental*", hack around, and restore back to my stable snapshot if things do not go well.

### My Action Plan

As I said, **this is a very long-term project**. And there is a long list of things to do. Some are easy, and some will consume a lot of time.

Here are a few:

* **Moving My Technical Blog [o2js.com](http://o2js.com/)** – I will transfer posts from *o2js.com* blog to this new blog. I will start with the most popular ones first. I will also be **editing** and **ehnancing** the copied posts along the way. – This will result in a better blog, with up-to-date content to reflect contemporary patterns and practices in **Front End Web Application Architecture**.
* **Moving Other Blogs that I Have** – There are quality content that I authored in other places, too (like **[blog.linkibol.com](http://blog.linkibol.com/)**). – I will move those content to this new blog as well.
* **Moving Other Peoples' Sites** – Sites that I don't directly have control over (*the sites that belong to friends, and family, which are hosted on my server, and are mostly in *php\* *) – Well, guess what? **linux** can run *PHP\* too **;)**. So I will transfer them directly to vm, and start serving them there.
* **Moving My Portfolio Site [volkan.io](http://volkan.io/)** – since it's a static single page. I will be rewriting it anyway, so moving it to the linux vm is not a big deal.
* **Importing Data** – This will be an issue I'd have to deal when the time comes.
* **Maintenance / Scheduling Backups** – Since the server will be a production server eventually, I have to make sure that I don't lose valuable info.
* … there are probably other things that I'm not taking into account right now; and I will be dealing with them, one by one, as they come.

### What About [linkibol.com](http://linkibol.com/)?

Back in 2003, I created a social bookmarking site [linkibol.com](http://linkibol.com/), which is still getting a lot of traffic. This will be the hardest project to transfer to this **Linux** box, since it has a lot of moving parts and dependencies.

[linkibol.com](http://linkibol.com/) is *the elephant in the room*. And honestly, it's the only reason I'm still using a dedicated windows box. It's a giant that devours most of my server's resources. And it's an **ASP.net/C\#** project. That's why I need **IIS** and a **windows server** to run it.

> While developing [linkibol.com](http://linkibol.com/) I've learned a hell lot of things about **social bookmarking**, **social networks**, **caching**, **degrees of separation**, **scalability**, **graph theory**, **popularity algorithms**, **bayesian statistics**, and more…

If the site had not received massive attention from the Turkish internet community, I would not have been forced to optimize every single bit of it.

> Thus, I believe it's time to pay back to community by sharing what I've learned.

[I've already started an open source project on github](https://github.com/v0lkan/linkibol). I will be  rewriting **linkibol.com** from scratch using **Node.JS** and **MongoDB**. And it will take a **loooooong** time to complete.

So if any of you guys are interested, [I'd love to have your help](https://github.com/v0lkan/linkibol/issues).

### Next Up?

So how did I set everything up? What is my current configuration?

This is the topic of the [next blog post](http://o2js.com/the-setup).
