if [ ! -d "build" ]; then
	mkdir -p build/node-root
fi
cp ./src/node/* build/node-root
node ./build/node-root/cbn-server.js