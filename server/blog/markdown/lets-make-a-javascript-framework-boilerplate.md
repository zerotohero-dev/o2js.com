Let's Make a JavaScript Framework Boilerplate



<img src="http://o2js.com/assets/eva.png" style="float:left;margin:1em;">

Creating, documenting, testing, and maintaining a **JavaScript Framework** (*and any **JavaScript** code base, per se*) is not an easy task; it requires careful planning in advance. And it's really hard to find quality resources on how to do this.

<div style="clear:both"></div>

In this tutorial, 

* We will be creating a simple "*hello world*" module, and publishing it to **[npm][npm]**; 
* Automating builds and unit tests; 
* Creating documentation for our code; 
* And integrating tools and services to continuously assess our code's overall quality and complexity. 

We will also make sure that this "*hello world*" module is usable both on the server (*i.e. in a **[Node.JS][nodejs]** environment*) and on the client (*i.e., when imported as an **[AMD][amd]** module*).

> By the end of this tutorial, you will have an idea about the steps you need to take to create and maintain a *reusable* **JavaScript** framework.

Let's focus on "creating the framework" first; we will cover **documenting**, **testing**, and **maintenance** shortly after. 

[npm]:    https://npmjs.org/
[amd]:    http://requirejs.org/docs/whyamd.html
[nodejs]: http://nodejs.org/

### Creating a Framework is Hard

To create a **JavaScript** framework, you will have to:

* Establish **requirements**;
* Determine the **scope** of your framework;
* Think about your class/module **hierarchy**, conceptualize a **dependency** diagram;
* Think about how you can make the framework **flexible** and **extensible**;
* And provide coding **guidelines**, and **conventions**, in your **documentation**.

And as you are developing your framework, you have to ensure that it is:

* Easy to learn;
* Easy to use, **even without documentation**;
* **Hard to misuse**;
* Easy to read and maintain;
* And easy to extend.

You will be doing all of these (*and more*) before even writing a single line of code. 

All of these are necessary, and **not** sufficient. Your framework will also need:

* Build and task **automation**;
* Documentation **generation**;
* Code quality **analyses**;
* Continuous **integration**;
* And **unit tests**…

Moreover, you will also need to manage external dependencies, and versioning.

#### Consistency is Gold

Last, but not the least, you will need to be **brutally consistent**:

* You should be consistent in **naming** your methods within the **API**;
* You should be consistent in your **verbiage**, i.e.: using verbs, nouns, and keywords **exactly** the same way, at all times – this is especially something that is often overlooked when writing documentations;
* You should be consistent in your **method signatures**, your parameters have a logical and similar order;
* You should be consistent with the **terminology** (*i.e.: if you are using a **Factory** class somewhere, do not use a **Builder** class somewhere else – name classes and modules that do identical things, **identically***).
* And the list goes on…

> If you don't pay attention to all these from day one, it's highly probable that your project will turn into a maintenance hell a year from now.

### [Realigning][realign] **o2.js**

If you have been reading this blog for a while, you also know that [I have started rewriting all of my blogs and articles][rewrite].

What I've not mentioned there, is the fact that **[o2.js][o2js] JavaScript Framework** is under a major rewrite too. 

When you [look at the **dev** branch][o2dev], you will see that there is a major change:

> I have moved all the existing source code to a **draft** folder to have a fresh start.

![the "draft" folder](http://o2js.com/assets/o2draft.png "the 'draft' folder")

This will also help me to create a project folder structure from scratch. And that's what we'll be doing next.

### Cloning the Repository

I'll start by cloning [the current **dev** branch][o2dev].

~~~
$ cd ~/PROJECTS
$ git clone git@github.com:v0lkan/o2.js.git
$ cd o2.js
$ git checkout dev
~~~

> If you are new to **[git][git]** and **[GitHub][github]**, you might want to [read some documentation, before going further][gitdoc].

[realign]: http://alistapart.com/article/REDESIGNREALIGN
[rewrite]: http://o2js.com/o2js-com-v2---a-new-hope
[o2js]:    https://github.com/v0lkan/o2.js/tree/master
[o2dev]:   https://github.com/v0lkan/o2.js/tree/dev
[git]:     http://git-scm.com/
[github]:  https://github.com/
[gitdoc]:  https://help.github.com/

### Our First "*Hello, World*" Method

Let's begin by creating a really dumb function:

```    
function sayHi() {
    return "Hello world; hello stars; hello universe!";
}
``` 

> By the end of this article, you will be amazed how much effort it requires to convert this single one-liner into a reusable, and maintainable module. 

For a simple dummy function like this, what we will be doing in the following sections might look like an overkill; however as your project evolves, and gets more and more complicated, you will see that this initial effort pays off.

So let us continue our journey, by putting this lonely function to a proper folder:

### Creating a Directory Structure

Since our function returns a **String**, it makes sense to put it into a "*string utilities*" package. 

It is also a common practice to put the source files into a "**src**" folder.

Assuming that we will extend our framework, and add more modules; it also makes sense to create **a separate folder for each module**. So our initial directory structure will be in the form `src/<PROJECT>/<module>/`. 

Here's how it looks like:

~~~
src
└── o2
    └── string
~~~

Since the name of our framework is **o2**, the project folder is named "*o2*"; and since our package is a string utilities package, we named the folder as "*string*".

Now let's create a **core.js** in the "*string*" folder, which will make our file tree as follows:

~~~
src
└── o2
    └── string
        └── core.js
~~~

### Creating a **Node.JS** Module

We will need to slightly modify our `sayHi` function to be able to run it in **[Node.JS][nodejs]**. 

Our new **src/o2/string/core.js** will look like:

~~~
'use strict';

exports.sayHi = function() {
    return "Hello world; hello stars; hello universe!";
};
~~~

> If you are new to **Node.JS**, before going any further, you might want to [read about what **Node.JS** is][nodejs]; and [how **Node.JS** modules are structured][nodemodules].

[nodemodules]: http://nodejs.org/docs/latest/api/modules.html

### Publishing to **npm**

**[npm][npm]** is the official package manager for **[Node.JS][nodejs]**. 

As of **Node.JS** version 0.6.3, **npm** is bundled and installed automatically with the environment. **npm** runs through the command line and manages dependencies for an application.

> If you want others to use your module in their **Node.JS** applications, then you will want to publish your modules to **[npm][npm]**.
>
> You will need to have **[Node.JS][nodejs]** installed to use **npm**.

Let's start initializing our **npm** package:

~~~
$ cd src/o2/string
$ npm init
~~~

`npm init` will ask you a bunch of questions, and create a **package.json** in the **project's root directory** based on your answers. 

Here is the **package.json** I've created for the **string** module using `npm init`:

~~~
{
  "name": "o2.string",
  "version": "0.0.1",
  "description": "o2.js String utility methods",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [
    "string",
    "format",
    "o2.js"
  ],
  "author": "Volkan Özçelik",
  "license": "MIT",
  "main": "core.js"
}
~~~

### Helper Documents

Additionally, it would be nice to have **LICENSE.md**, a **CHANGELOG.md**, a **CONVENTIONS.md**, **CONTRIBUTE.md**, and a **README.md** files for your module.

* **LICENSE.md** will be the boring copyright stuff;
* **CHANGELOG.md** will be the file you will be updating regularly at each new version, to tell the framework users what has changed with respect to the former version;
* **CONVENTIONS.md** will be your library's guidelines, naming and coding conventions;
* **CONTRIBUTE.md** will be the file you would be telling how people can contribute to your project;
* And **README.md** will be first thing the library user reads. This file is, in deed, the most important file of the entire module, and it deserves its own blog post.

Adding these altogether, our final file tree would be something like this:

~~~
src
└── o2
    └── string
        ├── CHANGELOG.md
        ├── CONTRIBUTE.md
        ├── CONVENTIONS.md
        ├── LICENSE.md
        ├── README.md
        ├── core.js
        └── package.json
~~~

After creating all these execute the following command inside **src/o2/string/** directory:

~~~
npm publish
~~~

Calling `npm publish` will publish our code to the global **npm** registry.

### Managing Intra-Modular Dependencies

Now let's create another module to make this dummy example a little more fun:

~~~
$ mkdir src/o2/ajax
$ cd src/o2/ajax
$ npm init
~~~

The file structure will be similar:

~~~
src
└── o2
    └── ajax
        ├── CHANGELOG.md
        ├── CONTRIBUTE.md
        ├── CONVENTIONS.md
        ├── LICENSE.md
        ├── README.md
        ├── core.js
        └── package.json
~~~

Now, let's assume our **ajax** module depends on the **string** module to do some of its operations. We can maintain this dependency via **npm** too:

~~~
$ cd src/o2/ajax
$ npm install "o2.string" --save
~~~

The `--save` directive tells **npm** command line tool to download the latest version of the **o2.string** module from the **npm registry**, and modify the **package.json** to reflect this change. 

Note that we have just published the **o2.string** module using `npm publish` in the former section. By calling `npm instal` we are downloading that code to a local **node_modules** folder.

> Oh, by the way, [npm needs your help][helpnpm], [you can make a donation, and receive a lot of cool gigs, too][helpnpm].

After this operation, the directory structure will be as follows:

~~~
src
└── o2
    ├── ajax
    │   ├── CHANGELOG.md
    │   ├── CONTRIBUTE.md
    │   ├── CONVENTIONS.md
    │   ├── LICENSE.md
    │   ├── README.md
    │   ├── core.js
    │   ├── node_modules
    │   │   └── o2.string
    │   │       ├── CHANGELOG.md
    │   │       ├── CONTRIBUTE.md
    │   │       ├── CONVENTIONS.md
    │   │       ├── LICENSE.md
    │   │       ├── README.md
    │   │       ├── core.js
    │   │       └── package.json
    │   └── package.json
    └── string
        ├── CHANGELOG.md
        ├── CONTRIBUTE.md
        ├── CONVENTIONS.md
        ├── LICENSE.md
        ├── README.md
        ├── core.js
        └── package.json
~~~

There's a new **node_modules** folder where the dependencies of **o2.ajax** module are installed; and the **package.json** in **src/o2/ajax** will be something like:

~~~
{
  "name": "o2.ajax",
  
  ...
  
  "dependencies": {
    "o2.string": "0.0.3"
  }
}
~~~

Let's try the following for fun:

~~~
$ cd src/o2/ajax
$ rm -rf node_modules
$ npm install
~~~

After running `npm install` the **node_modules** folder that we've removed will be populated with the dependencies again.

> Managing dependencies this way gives you additional flexibility, because you can install different versions of your dependent modules if you want. 

One downside of this approach is that the changes you make to the dependent module (*i.e.: **o2/string/core** in this example*) will not immediately reflect to the consumer module (*i.e.: **o2/ajax/core** in this example*). 

In order for the changes to propagate:

* First, publish your dependencies with `npm publish`;
* Then, change the version number in the **package.json** of the module that uses the dependency;
* And finally, re-install the dependency with `npm install`.

Next, we will use the dependency that we have just installed.

### Using Internal Dependencies

Our **o2.ajax** module will be as simple, dummy, and useless as our **o2.string** module.

Here is the content of **src/o2/ajax/core.js**:

~~~
'use strict';

var stringCore = require('./node_modules/o2.string/core');

exports.sayHi = function() {
    return stringCore.sayHi();
};
~~~

So our **o2.ajax** module uses our **o2.string** module to say hi **;)**.

> If our framework was only for **Node.JS** runtime, we could have used `require('o2.string/core')` instead of `require('./node_modules/o2.string/core')`. 
> 
> We cannot do this right now; because later in this article, we will be converting our **Node.JS** modules to **AMD modules** so that they can be used in the browser too.

I will assume that we have successfully cloned our remote github repository to our local drive.

> You can follow the instructions to [set up git][gitsetup], [create a repository][gitcreate], and [cloning a repository][gitclone] for **GitHub** integration.

Having said that, let us look at how we can manage external third-party dependencies.

### Configuring External Repositories

Our framework may also depend on other third-party **GitHub** repositories. In that case you will have to add them as **submodule**s. 

Suppose, for example, that we will be using the **[AMD][amd]** library [require.js][requirejs] in our framework. For this, we will create an **externals** directory, and add a **git submodule** as follows:

~~~
$ mkdir externals
$ git submodule add git@github.com:jrburke/requirejs.git externals/requirejs
~~~

This will add **require.js** source code to **externals/requirejs** folder. 

> For a more in-depth information and other `git submodule` tips and tricks, [Chris Jean has an excellent tutorial][chris-submodules].

[requirejs]:        http://requirejs.org/
[chris-submodules]: http://chrisjean.com/2009/04/20/git-submodules-adding-using-removing-and-updating/
[gitsetup]:         https://help.github.com/articles/set-up-git
[gitcreate]:        https://help.github.com/articles/create-a-repo
[gitclone]:         https://help.github.com/articles/fork-a-repo
[helpnpm]:          https://scalenpm.org/

### Converting **[CommonJS][commonjs]** Modules to **[AMD][amd]**

If we want to use our **o2.string** and **o2.ajax** modules in a browser environment, we will need to convert them to something that can run on the browser. Luckily, **[r.js][rjs]** can do this for us. Just `cd` to the project root, and execute the following:

~~~
$ npm install -g require.js
$ mkdir amd
$ mkdir amd/o2
$ r.js -convert src/o2/ amd/o2
~~~

Then the **amd** folder hierarchy will be identical to that of **src/o2**:

~~~
amd
├── ajax
│   ├── CHANGELOG.md
│   ├── CONTRIBUTE.md
│   ├── CONVENTIONS.md
│   ├── LICENSE.md
│   ├── README.md
│   ├── core.js
│   ├── node_modules
│   │   └── o2.string
│   │       ├── CHANGELOG.md
│   │       ├── CONTRIBUTE.md
│   │       ├── CONVENTIONS.md
│   │       ├── LICENSE.md
│   │       ├── README.md
│   │       ├── core.js
│   │       └── package.json
│   └── package.json
└── string
    ├── CHANGELOG.md
    ├── CONTRIBUTE.md
    ├── CONVENTIONS.md
    ├── LICENSE.md
    ├── README.md
    ├── core.js
    └── package.json
~~~ 

And our **JavaScript** files will be converted. 

Let's see **amd/ajax/core.js** as an example:

~~~
define(function (require, exports, module) {'use strict';

var stringCore = require('./node_modules/o2.string/core');

exports.sayHi = function() {
    return stringCore.sayHi();
};

});
~~~

You will see that the code is wrapped in `define(function (require, exports, module) {` … `});` – In deed, that's the only thing that is added to the files. It's not rocket surgery, and it's really convenient to have a tool that can do this automatically for us, so that we won't have to manually edit all the files.

> You can do this conversion manually too. And it's okay, if you have just a few files. 
> 
> However, for projects with a lot of files, automating things as much as we can, should be the way to go.
>
> We will be doing more and more automation in the following sections.

[rjs]:      http://requirejs.org/docs/optimization.html
[commonjs]: http://wiki.commonjs.org/wiki/CommonJS

### Using a Task Runner

Sooner or later you will need to use a task runner to **validate**, **benchmark**, and **build** your library.

> **[Grunt][grunt]** will be our task runner of choice, because… well… **Grunt is awesome**!

To install **grunt**, first you'll need to [install **Node.JS**][nodejs], and then execute the following command:

~~~
npm install -g grunt-cli
~~~

Then you should create a **Gruntfile.js** in your **project's root directory**. 

Here is a basic one to begin with:

~~~
module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({
    });
};
~~~

We will be adding more to to this **GruntFile.js** momentarily.

[grunt]: http://gruntjs.com/

### Linting Our Files

**JavaScript** is an extremely flexible language; and this comes with a curse of its own: 

You can easily write crappy code if you don't pay attention to what you're doing. Tools like **[JSHint][jshint]** can [statically analyze][static-analysis] your code to keep it in good shape.

> We will use **[JSHint][jshint]** as our static code analysis tool, because it is maintained by excellent developers. The community behind **JSHint** is by no means arrogant and thickheaded, to an extent to utter ["Your sadly pathetic bleatings are harshing my mellow."][doug] in a naïvely narcissistic pride.
> 
> 
> You know what? **[JSLint can suck it][suckit]!** – **JSHint** is less opinionated, more flexible, and it is far more open future enhancements, suggestions, comments, and recommendations.

[doug]:   http://www.developer.com/daily_news/jshint-forks-opinionated-jslint.html
[suckit]: https://brendaneich.com/2010/11/paren-free/

'nuff said **;)** – Let's create a **.jshintrc** file in our **project root directory** first, with the following content:

~~~
{
    "bitwise": false,
    "curly": true,
    "eqeqeq": true,
    "forin": true,
    "immed": true,
    "indent": 4,
    "latedef": true,
    "newcap": true,
    "noarg": true,
    "noempty": true,
    "nomen": true,
    "nonew": true,
    "onevar": true,
    "plusplus": false,
    "quotmark": "single",
    "regexp": true,
    "strict": true,
    "undef": true,
    "unused": true,
    "white": false,
    "trailing": true,
    "node": true,
    "maxlen": 80,
    "globals": {
        "exports": false,
        "require": false,
        "define": false,
        "window": false,
        "document": false,
        "ok": false,
        "expect": false
    }
}
~~~

You can read what all these options mean [at the **JSHint** documentation page][jshintdoc].

We will also configure our **Gruntfile.js** to validate our source files:

~~~
module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            src: ['Gruntfile.js', 'src/**/*.js']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('default', ['jshint']);
    grunt.registerTask('default', ['jshint']);
};
~~~

If you've configured everything correctly so far, running `grunt lint` will produce the following output:

~~~
$ grunt lint

Running "jshint:src" (jshint) task
>> 4 files lint free.

Done, without errors.
~~~

### Adding Documentation

A good documentation is a **must have** for any framework. 

Creating a good documentation is a nontrivial task. A good documentation should cover:

* **Method information**: This should explain what the function does, why it does it (*if not obvious*), caveats if any. This should also include usage examples;
* **Parameter listing**: Explain every possible parameter, and their default values (*if any*), explain if the parameters have any additional limitations beyond their type;
* **Return information**: What does the method return? where can it be used?
* **Related method**: Would it help the reader, if she reads some other method's documentation too?
* **Exceptional cases**: Any exceptions, and errors raised **should** be documented;
* **More Usage Examples**: An introductory document (*README.md, maybe*) that explains the intentions and the correct usage examples and ideas **beyond** the actual **API** documentation.

In the light of these, Let us create some **[JS Doc][jsdoc]** for our dummy methods. 

Here's the documented **src/o2/ajax/core.js**, for example:

~~~
'use strict';

/**
 * @module o2.ajax
 */

var stringCore = require('./node_modules/o2.string/core');

/**
 * @class o2.ajax.core
 * @uses o2.string.core
 */

/**
 * Returns a welcome `String`.
 *
 * Usage example:
 *
 * @example
 *     var ajaxUtil = require('ajax/core');
 *
 *     // `greeting` will be a welcome text of type `String`.
 *     var greeting = ajaxUtil.sayHi();
 *
 * @method sayHi
 * @static
 *
 * @returns {String} The welcome `String`.
 */
exports.sayHi = function() {
    return stringCore.sayHi();
};
~~~

The next thing we will do will be to create a **HTML documentation** out of these **JSDoc** comments. 

For this, let us add the following to our **Gruntfile.js**:

~~~
module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({

        ...

        pkg: grunt.file.readJSON('package.json'),
        yuidoc: {
            compile: {
                name: '<%= pkg.name %>',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
                url: '<%= pkg.homepage %>',
                logo: '../assets/logo.png',

                options: {
                    paths: 'src/o2',
                    outdir: 'documentation'
                }
            }
        }
    });

    ...

    grunt.loadNpmTasks('grunt-contrib-yuidoc');

    grunt.registerTask('doc', ['yuidoc']);
};
~~~

And then install the plugin:

~~~
$ mkdir documentation
$ npm install grunt-contrib-yuidoc --save-dev
~~~

After this setup, when we run

~~~
$ grunt doc
~~~

We will get a nice **HTML** documentation in our **documentation** folder:

<a href="http://o2js.com/assets/doc-large.png"><img src="http://o2js.com/assets/doc-small.png" alt="" title="Click to see a larger version"></a>

[jsdoc]:           http://usejsdoc.org/
[jshint]:          http://www.jshint.com/
[jshintdoc]:       http://www.jshint.com/docs/
[static-analysis]: http://en.wikipedia.org/wiki/Static_program_analysis

### Adding Unit Tests

Unit test ensure our framework's quality and maintainability. 

Since our framework will be used both on the client and on the server we will need different test suites for client and server environments. 

Let's create the test folders first:

~~~
$ mkdir test
$ mkdir test/node
$ mkdir test/web
~~~

And then add just two blank files for **string.core** tests for **server** and **client** environments respectively:

~~~
$ touch test/node/o2.string.core_test.js # server test
$ touch test/web/o2.string.core_test.js  # client test
~~~

#### Server Test

We will use **[vows.js][vows]** for our server-side tests. 

Here is our **test/node/o2.string.core_test.js** file.

~~~
'use strict';

var core = require('../../src/o2/string/core');
var assert = require('assert');
var vows = require('vows');

vows.describe('o2.string.core').addBatch({
    'stringUtil.sayHi': {
        'when "stringUtil.sayHi()" is called': {
            topic: function() {
                return core.sayHi().toLowerCase().indexOf('hello') > -1;
            },
            'it should return a greeting': function(expectation) {
                assert.equal(expectation, true);
            }
        }
    }
}).export(module);
~~~

> Note that these tests are simple test samples to demonstrate the concept.
>
> We will cover how to write great unit tests, in depth, in a later article.

We will also need to install **vows** and configure our **package.json**:

~~~
$ npm install vows --save-dev
~~~

Let's configure our **package.json** in our **project root directory**, to enable this test:

~~~
{
  "name": "o2",
  "version": "0.26.12",
  "author": "Volkan Özçelik <volkan@o2js.com>",
  "description": "o2.js JavaScript Framework",
  "homepage": "http://o2js.com/",
  "keywords": [
    ...
  ],
  "scripts": {
    "test": "vows test/node/*.js --spec"
  },
  "repository": {
    ...
  },
  "license": "MIT",
  "devDependencies": {
    ...
  }
}
~~~

The `vows test/node/*.js --spec` will run our server-side test. To run the tests just call `npm test` from the command line:

~~~
$ npm test

> o2@0.26.12 test /Users/volkan.ozcelik/PROJECTS/o2.js
> vows test/node/*.js --spec

  ♢ o2.string.core 
  
  sayHi when "sayHi()" is called
    ✓ it should return a greeting
 
✓ OK » 1 honored (0.006s) 
~~~

#### Client Test

Next, we will add a client-side test. 

We will use **[Jasmine][jasmine]** for that. 

Go to the project root, and run the following commands:

~~~
$ npm install grunt-contrib-connect --save-dev
$ npm install grunt-contrib-jasmine --save-dev
~~~

The next thing, as usual, is to configure our **Gruntfile.js**:

~~~
module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({

        ...

        connect: {
            test: {
                options: {
                    port: 8080
                }
            }
        },
        jasmine: {
            taskName: {
                src: 'amd/**/*.js',
                options: {
                    specs: 'test/web/*_test.js',
                    host: 'http://127.0.0.1:8080/',
                    template: require('grunt-template-jasmine-requirejs'),
                    templateOptions: {
                        requireConfig: {
                        }
                    }
                }
            }
        },

        ...

    });

    ... 

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-jasmine');

    grunt.registerTask('test', ['connect:test', 'jasmine']);
};
~~~

**grunt-contrib-connect** creates temporary web server, and **grunt-contrib-jasmine** runs the **Jasmine** specs on a [headless][headless] browser using [phantom.js][phantom].

And here is our **test/web/o2.string.core_test.js** file:

~~~
'use strict';

require([
    'amd/o2/string/core',
    'amd/o2/ajax/core'
], function(
    core,
    ajax
) {
    describe("o2.string.core", function() {
        it("returns a greeting when `sayHi` is called.", function() {
            var div = document.createElement('div');

            div.innerHTML = core.sayHi() + ajax.sayHi();

            var greet = 'Hello world; hello stars; hello universe!';

            expect(div.innerHTML).toBe(greet + greet);
        });
    });
});
~~~

So, calling `grunt test` will give the following output:

~~~
$ grunt test
Running "connect:test" (connect) task
Started connect web server on 127.0.0.1:8080.

Running "jasmine:taskName" (jasmine) task
Testing jasmine specs via phantom
.
1 spec in 0.238s.
>> 0 failures
~~~

> **Hint**: 
>
> Along with unit testing tools like [vows][vows], and [Jasmine][jasmine], a mocking tool like [sinon.js][sinon] might also come in handy.

[vows]:     http://vowsjs.org/
[jasmine]:  http://pivotal.github.io/jasmine/
[headless]: http://www.sencha.com/blog/headless-testing-for-continuous-integration-with-git-and-jasmine
[phantom]:  https://code.google.com/p/phantomjs/
[sinon]:    http://sinonjs.org/

### Automating Command-Line Tasks

We can use **grunt-exec** to run non-Grunt shell scripts. 

Let's make our lives easier by adding a few of those.

First we will need to install **grunt-exec**, as a development dependency:

~~~
$ npm install grunt-exec --save-dev
~~~

Then we will configure our **Gruntfile.js**:

~~~
module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({

        ...

        exec: {
            clean: {
                command: 'find amd/o2/string/ -maxdepth 1 -type f -delete;' +
                  'find amd/o2/ajax/ -maxdepth 1 -type f -delete;' +
                  'find amd/o2/ajax/node_modules/o2.string -maxdepth 1 ' +
                  '-type f -delete;',
                stdout: true,
                stderr: true
            },
            amdify: {
                command: 'r.js -convert src/o2 amd/o2;',
                stdout: true,
                stderr: true
            },
            'test': {
                command: 'npm test',
                stdout: true,
                stderr: true
            }
        },

        ...
    });

    grunt.loadNpmTasks('grunt-exec');

    grunt.registerTask('publish', ['exec:clean', 'exec:amdify']);
    grunt.registerTask('testAll', ['exec:test', 'test']);

    ...
};
~~~

And modify **test** section of the **package.json** in the **project root directory** as follows:

~~~
  "scripts": {
    "test": "vows test/node/*.js --spec;grunt test"
  },
~~~

Now, whenever we run `grunt publish`, we will remove the current files in our **amd** folder, and create new **AMD** modules from the source files in our **src** directory.

And when we run `grunt testAll`, we will test our **Node.JS** modules, followed by our **AMD** modules.

The next thing we will do is to automate our build tests.

### Continuous Integration

> [Continuous Integration (*CI*)][ci] is an **incremental** and **iterative** software development methodology.  It is a software development practice where members of a team integrate their work frequently, usually each person integrates at least daily - leading to multiple integrations per day. Each integration is verified by an **automated build** (including test) to detect integration errors as quickly as possible. 

**CI** is also a "*must have*" for our framework: 

When we integrate our code base to a **CI Server**, every time we publish an update, a series of tasks and tests will automatically run and we will get an immediate report if any of our build tasks or tests fail. Not only will this significantly reduce possible integration problems and allow us to develop cohesive software more rapidly, but also it will help us identify problems in our framework as early as possible.

> Implementing **code quality checkers** and **automatic reporting** in the build system, coupled with a **continuous integration** and **continuous inspection** systems, will help you identify code quality *hotspots*, and **[refactor][refactor]** your code accordingly.

We will be using **[Travis][travis]** as our **CI** server. 

Setting up **Travis** is really easy:

* First, open an account at [https://travis-ci.org/][travis];
* Then, sign in with your [github][github] credentials;
* Go to your [profile page][travis-profile] and **turn on** your repository.

Here is how it looks like:

<a href="http://o2js.com/assets/travis-large.png"><img src="http://o2js.com/assets/travis.png"  title="Click to see a larger version"></a>

**Travis** will use `npm test` command to execute our tests. Since we want to test the recent **AMD** modules, along with **Node.JS** files, we will slightly modify our **package.json** in our **project root directory**:

~~~
...
  "scripts": {
    "test": "grunt publish;vows test/node/*.js --spec;grunt test"
  },
...
~~~

And since we are using **grunt** in our test script, we need to let **Travis** know about it:

~~~
npm install grunt-cli --save-dev
~~~

The next thing we will do is to create a **.travis.yml** in the **project root directory** to tell **Travis** which versions of **Node.JS** we would like our framework to be tested in:

~~~
language: node_js
node_js:
  - "0.10"
  - "0.8"
~~~

That's it! 

From now on, every time we push things to **grunt**, we will get automated tests:

~~~
$ git add .
$ git commit -m 'travis configuration update'
$ git push origin dev
~~~

We can see our build results on the [**Travis** website][travis]

<a href="http://o2js.com/assets/travis-results-large.png"><img src="http://o2js.com/assets/travis-results.png"  title="Click to see a larger version"></a>

[ci]:             http://en.wikipedia.org/wiki/Continuous_integration
[travis]:         https://travis-ci.org
[travis-profile]: https://travis-ci.org/profile
[refactor]:       http://www.amazon.com/Refactoring-Improving-Design-Existing-Code/dp/0201485672

### Gain Control Over Your Code's Complexity

#### Code Complexity Analysis

Every code base has its inherent level of complexity; however we can reduce the complexity of our code by limiting the interdependency of components, by letting them do one thing, and letting them [do that thing well][unix]. This is commonly referred to as **[favoring cohesion over coupling][cohesion]**.

> If you do not watch your code's complexity over time, each additional line of code you add will make your framework harder to maintain, more fragile, and more prone to bugs and regressions.

There are certain tools, and metrics that we can use to have an idea of how complex our code is. One such tool that we can use is **[grunt-complexity][grunt-complexity]**.

> Code complexity metrics do not set hard and fast **rules**, they just provide **guidelines**. An increase in the codes' complexity index is not necessarily a bad thing. Some of the modules that you create might be complex, simply because of the intricacy of the problem that it's trying to solve. An increased complexity metric is just something that you, as a library developer, have to keep an eye on.

Let's start by installing it to our project as a development dependency:

~~~
$ npm install grunt-complexity --save-dev
~~~

And then we will configure our **Gruntfile.js**:

~~~
module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({

        ...

        complexity: {
            generic: {
                src: ['src/**/*.js'],
                options: {
                    jsLintXML: 'report.xml', // create XML JSLint-like report
                    checkstyleXML: 'checkstyle.xml', // create checkstyle report
                    errorsOnly: false, // show only maintainability errors
                    cyclomatic: 3,
                    halstead: 8,
                    maintainability: 100
                }
            }
        },

        ...
    });

    grunt.loadNpmTasks('grunt-complexity');

    ...

    grunt.registerTask('publish', [
        'exec:clean',
        'exec:amdify',
        'lint',
        'complexity'
    ]);
   
    ...
};
~~~

When we run

~~~
grunt complexity
~~~

we will get a nicely formatted code complexity report:

~~~
$ grunt complexity
Running "complexity:generic" (complexity) task
 
✓ src/o2/ajax/core.js                         ████████ 161.23
✓ src/o2/ajax/node_modules/o2.string/core.js  █████████ 171.00
✓ src/o2/string/core.js                       █████████ 171.00

Done, without errors.
~~~

You can read [jscomplexity.org's help file][jscomplexity] to get an idea of what those numbers refer to.

### Adding Complexity Analysis to **CI** Pipeline

Moreover, since we have added **lint** and **complexity** tasks to our publish task, when we run `npm test`
We will get lint and complexity results along with server-side and client-side test results:

~~~
$ npm test

> o2@0.26.12 test /Users/volkan.ozcelik/PROJECTS/o2.js
> grunt publish;vows test/node/*.js --spec;grunt test

Running "exec:clean" (exec) task

Running "exec:amdify" (exec) task

Running "jshint:src" (jshint) task
>> 4 files lint free.

Running "complexity:generic" (complexity) task
 
✓ src/o2/ajax/core.js                         ████████ 161.23
✓ src/o2/ajax/node_modules/o2.string/core.js  █████████ 171.00
✓ src/o2/string/core.js                       █████████ 171.00

Done, without errors.
 
  ♢ o2.string.core 
  
  sayHi when "sayHi()" is called
    ✓ it should return a greeting
 
✓ OK » 1 honored (0.004s) 
  
Running "connect:test" (connect) task
Started connect web server on 127.0.0.1:8080.

Running "jasmine:taskName" (jasmine) task
Testing jasmine specs via phantom
.
1 spec in 0.255s.
>> 0 failures

Done, without errors.
~~~

> **Hint**:
> 
> Integrating a [code coverage][coverage] tool like [blanket][blanket], or [Istanbul][istanbul] would also be useful in certain projects.

In our particular example since our modules will be relatively granular, and the functionality will be spread among many modules that do one thing well, a code coverage analysis might not provide too much insight. If, on the other hand, our application was a big monolithic component, that achieves a multitude of tasks, then a code coverage analysis might have come in handy.

[cohesion]:         http://en.wikipedia.org/wiki/Cohesion_(computer_science)
[unix]:             http://en.wikipedia.org/wiki/Unix_philosophy
[grunt-complexity]: https://github.com/vigetlabs/grunt-complexity
[coverage]:         http://en.wikipedia.org/wiki/Code_coverage
[istanbul]:         http://gotwarlost.github.io/istanbul/
[blanket]:          http://blanketjs.org/
[jscomplexity]:     http://jscomplexity.org/complexity

#### Generating Dependency Graphs

Visualizing our framework's modular dependency graph is a valuable tool; especially when you want to refactor your project.

For dependency tree generation, we will be using a tool called [dependo][dependo].

Let's install **dependo** first:

~~~
$ npm install -g dependo
~~~

And then create a dependency report for our **AMD** modules:

~~~
$ dependo amd > documentation/dependency-report.html
~~~

When we open **documentation/dependency.html** we will see a really simple dependency graph.

<a href="http://o2js.com/assets/dependo.png"><img src="http://o2js.com/assets/dependo.png" alt=""></a>

As our framework evolves, regularly checking this dependency graph will also prove itself to be extremely useful.

> As we are on the topic of dependencies, there is also a very useful tool called **[david][david]**, which you can use to track which of your project's dependencies are drifting out of date.

[dependo]: https://npmjs.org/package/dependo
[david]:   https://david-dm.org/

### **GruntFile.js** in its Final Form

Here is our **GruntFile.js**, after having made all those changes:

~~~
module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            src: ['Gruntfile.js', 'src/**/*.js']
        },
        connect: {
            test: {
                options: {
                    port: 8080
                }
            }
        },
        jasmine: {
            taskName: {
                src: 'amd/**/*.js',
                options: {
                    specs: 'test/web/*_test.js',
                    host: 'http://127.0.0.1:8080/',
                    template: require('grunt-template-jasmine-requirejs'),
                    templateOptions: {
                        requireConfig: {
                        }
                    }
                }
            }
        },
        complexity: {
            generic: {
                src: ['src/**/*.js'],
                options: {
                    jsLintXML: 'report.xml', // create XML JSLint-like report
                    checkstyleXML: 'checkstyle.xml', // create checkstyle report
                    errorsOnly: false, // show only maintainability errors
                    cyclomatic: 3,
                    halstead: 8,
                    maintainability: 100
                }
            }
        },
        exec: {
            clean: {
                command: 'find amd/o2/string/ -maxdepth 1 -type f -delete;' +
                  'find amd/o2/ajax/ -maxdepth 1 -type f -delete;' +
                  'find amd/o2/ajax/node_modules/o2.string -maxdepth 1 ' +
                  '-type f -delete;',
                stdout: true,
                stderr: true
            },
            amdify: {
                command: 'r.js -convert src/o2 amd/o2;',
                stdout: true,
                stderr: true
            },
            'test': {
                command: 'npm test',
                stdout: true,
                stderr: true
            }
        },
        pkg: grunt.file.readJSON('package.json'),
        yuidoc: {
            compile: {
                name: '<%= pkg.name %>',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
                url: '<%= pkg.homepage %>',
                logo: '../assets/logo.png',

                options: {
                    paths: 'src/o2',
                    outdir: 'documentation'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-complexity');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');

    grunt.registerTask('default', ['jshint']);
    grunt.registerTask('lint', ['jshint']);
    grunt.registerTask('test', ['connect:test', 'jasmine']);
    grunt.registerTask('publish', [
        'exec:clean',
        'exec:amdify',
        'lint',
        'complexity'
    ]);
    grunt.registerTask('testAll', ['exec:test', 'test']);
    grunt.registerTask('doc', ['yuidoc']);
};

~~~

#### Actually, This is **Not** A Dummy Project

The astute reader might have realized that the **o2.string** and **o2.ajax** modules that we have discussed here are not throwaway files.  

> I will be importing functionality [from the old **o2.js** code][o2-draft], writing more meaningful tests, creating **README** files and documentation etc. – this is just the beginning.

[o2-draft]: https://github.com/v0lkan/o2.js/tree/dev/draft

### Summary

In this tutorial, 

* We have learned why creating, and maintaining a **JavaScript** framework is not an easy process;
* We have created two simple **modules**, and established a **dependency relationship** between them;
* We have created a meaningful **directory structure** for our code base;
* We have learned how to publish our modules to **npm**;
* We have learned how to handle **inter-modular**, and **intra-modular** dependencies;
* We have also seen how to configure **external** dependencies that we will be using as third-party libraries;
* We have learned how to integrate our project to **GitHub**;
* We have learned how to convert **Common.JS** modules to **AMD** modules;
* We have seen why **Grunt is awesome**;
* We have learned how to **lint**, **document**, and **test** our files;
* We have integrated our tests with a **CI Server**;
* We have analyzed our project's **code complexity**, and **dependency tree**.

While this may be an overkill for a simple project, as your code base grows in depth and breadth, it will prove itself to be useful.

### Read the Source Luke

The source code of what we have examined so far can be downloaded [from this GitHub history snapshot][gitsnap] – Enjoy.

[gitsnap]: https://github.com/v0lkan/o2.js/tree/90f0fe19452903e85b5d6153467f7e8ba96223e0

### Next Up?

As we've covered the baseline, and highlighted important pieces, the next step would be creating a module that serves an actual purpose. 

I'll start by porting [the current o2.js **string** and **ajax** utility methods][helpers] into their own modules, and share the important parts of this shift in separate blog posts.

…

Do you have process-management, testing, integration, and deployment  tricks that work for you?
As always, I'd love to have your comments and suggestions.

[helpers]: https://github.com/v0lkan/o2.js/tree/90f0fe19452903e85b5d6153467f7e8ba96223e0/draft/o2/string
