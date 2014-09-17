
var PUID_NAMESPACE = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var PUID_SIZE = 11;
function PUIDCreator(dynamodb) {
    this.cbnCounter = dynamodb.define("CBNCounter", function(schema){
        schema.String('counterName', {hashKey:true});
        schema.Number('count');
    });
    this.cbnCounter.config({tableName: 'CBNCounter'});
}

PUIDCreator.prototype.generatePUID = function(callback) {
    var self = this;
    self.cbnCounter.get({counterName:'PUID'}, function(err, data) {
        if(err) {
            callback(err, null);
        }
        else {
            currCount = data.attrs['count'];
            self.cbnCounter.update({counterName:'PUID', count:currCount+1}, {expected:{count:currCount}}, function(error, updatedData) {
                if(error) {
                    callback(error, null);
                } else {
                    var PUID = self.transform(updatedData.get('count'));
                    callback(null, PUID);
                }
            });
        }   
    });
};

PUIDCreator.prototype.transform = function(puidCount) {
    var count = puidCount;
    var PUID = [];
    var namespaceSize = PUID_NAMESPACE.length;
    do {
        var elem = count % namespaceSize;
        PUID.push(PUID_NAMESPACE[elem]);
        var count = parseInt(count / namespaceSize);
    } while(count > 0);
    currLength = PUID.length;
    for(var i = 0; i < PUID_SIZE - currLength -1; i++) {
        PUID.push('0');
    }
    PUID.push('A');
    return PUID.reverse().join('');
};

module.exports = PUIDCreator;