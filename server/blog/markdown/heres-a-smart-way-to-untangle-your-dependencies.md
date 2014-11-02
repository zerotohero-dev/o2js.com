Here’s a Smart Way to Untangle Your Dependencies



<img src="http://o2js.com/assets/tangled.png" style="float:left;margin:1em;" alt="Tangled" title="Untangle your dependencies">

**Node.JS** is awesome. – It enables us to create miracles gulping, merging, and piping async flows of streams without needing to think about concurrency and thread safety.

Heck… you can even spawn a functional web server in under ten lines of code.

All this is **beyond compare**; yet there are places where **Node.JS** causes a real pain in the rear:

> One of the pain points of **Node.JS** is the **bottomup** approach it takes when resolving dependencies.

Let’s see this with an example:

<div style="clear:both"></div>

### “Bottoms Up” Makes You Drunk

Assume you have the following project folder structure:

	PROJECT_ROOT
	|
	├── admin.foobar.com
	|   |
	│   ├── app.js
	|   |
	│   ├── route
	│   │   └── mixin
	│   │       └── api
	│   │           └── mixin
	│   │               └── content.js
	│   └── util
	│       └── log.js
	└───db
	   └── shard.js

It’s nothing uncommon.

**admin.foobar.com** is a web app that boots a server instance by executing `node app.js`, and we have a various modules spread around.

To simulate a real-life scenario, let’s assume our **…/api/mixin/content.js** module is this:

	// File: admin.foobar.com/route/mixin/api/mixin/content.js
	
	'use strict';
	
	var shard = require('../../../../../db/shard'),
	   log = require('../../../../util/log');
	
	exports.hello = function() {
	   shard.connect();
	
	   log.log('Bazinga!');
	
	   return 'World';
	};

See how ugly those `require`s look?

And it’s not just aesthetics, it’s also about maintainability. 

Why?

To begin with, the chain of paths are too obscure to follow:

> By looking at the above source, can you see that **db/shard** is five levels above the current file, whereas **util/log** is four levels above?
> 
> If you don’t have an “OCR-like eye”, you can miss the fact that one path has four “..”s, and the other has five. And that would cause runtime annoyances.

Moreover, if you were to refactor this module, and move it to a different folder, say two levels above,  can you be 100% sure that your `require`s will work properly? 

> Yeah there are **IDE**s, like [WebStorm](http://www.jetbrains.com/webstorm/) that can remap your `require`s upon a project-wide refactoring; and even **WebStorm** messes things up sometimes.

### The “Topdown” Way

To address these (*and more*) issues, we need to find a way to define our **include**s relative to the project root (*i.e., follow a **topdown** approach*).

Let’s define a helper for this:


	// o2.io/core.js
	
	'use strict';
	
	var path = require('path');
	
	exports.require = function(dirName, baseDir, appDir) \{
	   return function(name) {
	       return require(path.join(
	            dirName,
	            name[0] === '/' ?  baseDir || '.' :  appDir || '.',
	            name
	        ));
		   };
	};

> **Hint**:
> 
> [This package is currently live](https://www.npmjs.org/package/o2.io) on **[npm](https://www.npmjs.org/)**.
> 
> You can `npm install o2.io` to try it for yourself.

The `exports.require` just wraps the global `require` method, so that you can resolve your path dependencies relative to an arbitrary folder.

Let’s rewrite the above **…/api/mixin/content.js** and require items using this helper.

First we’ll have to do some pre-initialization at **app.js**:


	// file: admin.foobar.com/app.js
	
	'use strict';
	
	//
	// __dirname is a magic variable that maps to the current folder.
	// It is not global, it’s local to the current module.
	//
	// Here, the “project root” is set up to the 
	// parent directory of the current folder;
	// And the “app root” is the current folder.
	//
	// Defining the `global.include` should be done 
	// **before** you `require` anything else.
	//
	global.include = require('o2.io').require(\_\_dirname, '..');
	
	// After defining `global.include`, 
	// `require` your modules as usual.
	var content = require('./route/mixin/api/mixin/content');
	
	content.hello();

Unlike the default `require` function, which works **bottomup**, we can use the `include` function to resolve dependencies **topdown**.

Let’s create a modified version of **…/api/mixin/content.js** to demonstrate this.

For comparison, here are the original **require** statements:


	...
	
	var shard = require('../../../../../db/shard'),
	   log = require('../../../../util/log');
	
	...

And here goes the modified file:


	// File: admin.foobar.com/route/mixin/api/mixin/content.js
	
	'use strict';
	
	// Look Ma! I ain’t see no “..”s around.
	var shard = include('/db/shard'),
	   log = include('util/log');
	
	exports.hello = function() {
	   shard.connect();
	
	   log.log('Bazinga!');
	
	    return 'World';
	};

Much leaner, huh?

* When the path string starts with a “**/**” (as in “**<span style="background:#ffff00">/</span>db/shard**”), we resolve the path relative to the “**project root**”.
* When the path does not start with a “**/**” (as in “**util/log**”), we resolve the path relative to the “**app root**”.

It’s as simple as that!

### Read the Source, Luke

You can get the source code [by navigating to this **GitHub** history snapshot](https://github.com/o2js/o2.io/blob/3f573216d073636273afad71f1bd6b00976b7026/src/core.js).

Also the astute follower might have realized that this new **o2.js** module lays outside the [**o2.js** main repository](https://github.com/v0lkan/o2.js), as a standalone helper. 

That’s **intentional**, and here’s why:

> I’m planning to split **o2.js** into **reusable**, and **atomic** components that can live by themselves. – I plan to  manage these components in separate repositories of their own. Not only will it be much **easier to maintain**, it will also be much **easier to contribute** too, since there will be a much lesser initial learning curve to get involved.

### Conclusion

Now our `include`s look much prettier; and there is more than eye candy in that:

By quickly looking at the source code we can see where the modules are. Hence, no more counting “**..**”s and squinting your eyes to double check if you have added an extra “**/..**” by mistake.

**Refactoring** is a breeze, too! You can move this script anywhere in the folder hierarchy, and you won’t need to change its `include` paths.

…

Hope you liked this little hack that lets your hair stay where it belongs **;)**.