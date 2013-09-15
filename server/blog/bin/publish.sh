echo "Starting publish proces..."
cd /root/PROJECTS/o2js.com/server/blog
echo "Restoring configuration files..."
cp app/views/layouts/application.html.ejs.local app/views/layouts/application.html.ejs
echo "Temporarily stopping servers..."
nginx -s stop;apachectl -k stop
echo "Starting generation process..."
scotch generate
echo "Generation done! Starting servers..."
nginx;apachectl -k start
echo "Servers started. Creating markdowns..."
cd bin
node ./update-markdowns.js
cd /root/
echo "All done. Do not forget to publish to github."
