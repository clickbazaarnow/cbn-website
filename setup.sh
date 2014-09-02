if [ ! -d "build" ]; then
	mkdir -p build/node-root
	mkdir -p build/output/logs
fi

if [ ! -f "build/output/logs/cbn.log" ]; then
	echo "log file doen't exist, creating one"
	touch build/output/logs/cbn.log
fi

if [ ! -d "build/public/stylesheets" ]; then
	mkdir -p "build/public/stylesheets"
fi

if [ ! -d "build/views" ]; then
	mkdir -p "build/views"
fi

if [ ! -d "build/public/js" ]; then
	mkdir -p "build/public/js"
fi

cp ./src/node/* build/node-root
cp ./src/views/* build/views
cp ./src/stylesheets/* build/public/stylesheets
cp ./src/js/* build/public/js
cp -r bower_components ./build/public
node ./build/node-root/cbn-server.js