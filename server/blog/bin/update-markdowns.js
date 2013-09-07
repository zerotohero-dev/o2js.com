var MongoClient = require('mongodb').MongoClient;
var Server = require('mongodb').Server;

var client = new MongoClient(new Server("localhost", 27017, {native_parser: true}));

var fs = require('fs');
var path = require('path');

client.open(function(err, client) {
    if (err) {
        console.log('Houston; we\'ve had a problem.');

        return;
    }

    console.log('Connection established');

    var blog = client.db('blog');

    var posts = blog.collection('posts').find(function(err, data) {
        if (err) {
            console.log('Error finding posts.');

            return;
        }

        data.toArray(function(err, posts) {
            if (err) {
                console.log('Error converting posts to array.');

                return;
            }

            console.log('I have my posts!');

            posts.forEach(function(post) {
                console.log(post.slug);
                console.log(post.title);

                var file = path.join(__dirname, '../markdown/', post.slug + '.md');

                fs.writeFileSync(file, post.title + '\n\n\n\n' + post.markdown, {flag:'w+'});
            });
        });

        console.log('found posts');
    })

    console.log('All done.');
});

