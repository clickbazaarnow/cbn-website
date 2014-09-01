if [ ! -d "build" ]; then
	mkdir -p build/node-root
	mkdir -p build/output/logs
fi

if [ ! -f "build/output/logs/cbn.log" ]; then
	echo "log file doen't exist, creating one"
	touch build/output/logs/cbn.log
fi
cp ./src/node/* build/node-root
node ./build/node-root/cbn-server.js