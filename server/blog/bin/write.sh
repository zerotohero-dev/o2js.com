echo "preparing blog server..."
cd /root/PROJECTS/o2js.com/server/blog
echo "copying configuration files..."
cp app/views/layouts/application.html.ejs.server app/views/layouts/application.html.ejs
echo "starting server on port 8888..."
scotch serve 8000
