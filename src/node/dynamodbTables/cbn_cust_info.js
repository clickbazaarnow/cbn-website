
var CustomerInformationFactory = require("./cbn_cust_info_factory");

/*
 * This cust_info consumer table
 */
function CustomerInformation(dynamodb, logger) {
    this.customerInfoFactory = CustomerInformationFactory(dynamodb, logger);
    this.customerInfo = dynamodb.define("CustomerInformation", function(schema){
        schema.String('emailId', {hashKey:true});
        schema.TimeUUID('factoryId').required();
        schema.String('copy').required();
        schema.String('lockedBy');
        schema.Boolean('isTransient', {default: false}).required();
        schema.Date('updatedTime', {default: Date.now}).required();
        schema.String('updatedBy').required();
        schema.Number('version').required();
    });
    this.customerInfo.config({tableName: 'cbn_cust_info'});
    this.custInfo = {};
    this.log = logger;
}

CustomerInformation.prototype.setData = function(data) {
    this.custInfo = data;
}

CustomerInformation.prototype.getFactory = function() {
    return this.customerInfoFactory;
}

CustomerInformation.prototype.setEmailId = function(emailId) {
    this.custInfo.emailId = emailId;
}

CustomerInformation.prototype.setFactoryId = function(factoryId) {
    this.custInfo.factoryId = factoryId;
}

CustomerInformation.prototype.setLockedBy = function(lockedBy) {
    this.custInfo.lockedBy = lockedBy;
}

CustomerInformation.prototype.setIsTransient = function(isTransient) {
    this.custInfo.isTransient = isTransient;
}

CustomerInformation.prototype.setUpdatedBy = function(updatedBy) {
    this.custInfo.updatedBy = updatedBy;
}

CustomerInformation.prototype.createRecord = function(cb) {
    self = this;
    //create record in factory
    self.customerInfoFactory.createRecord(function(err, factoryData) {
        if(err) {
            self.log.error("Failed to create record in factory in createRecord", err);
            //TODO : handle error condition
            cb(err, null);
        } else {
            self.custInfo.copy = factoryData;
            self.custInfo.factoryId = factoryData.factoryId;
            self.custInfo.version = 0;
            self.customerInfo.create(self.custInfo, function(err, data){
                if(err) {
                    self.log.error("Failed to create record", err);
                    //TODO : handle error condition
                    cb(err, null);
                } else {
                    cb(null, data)
                }
            });
        }
    });
}

CustomerInformation.prototype.updateRecord = function(cb) {
    self = this;
    self.customerInfoFactory.createRecord(function(err, factoryData) {
        if(err) {
            self.log.error("Failed to create record in factory in updateRecord", err);
            //TODO : handle error condition
            cb(err, null);
        } else {

            self.custInfo.update();
        }
    });
    //read latest record
    self.customerInfo.get(self.custInfo.emailId, {ConsistentRead: true}, function(err, data) {
        if(err) {
            self.log.error("Couldn't get latest record", err);
            //TODO : handle error condition
            cb(err, null);
        } else {
            if(self.custInfo.version === data.version) {
                //create new record in factory
                self.customerInfoFactory.createRecord(function(err, factoryData) {
                    if(err) {
                        self.log.error("Failed to create record in factory in updateRecord", err);
                        //TODO : handle error condition
                        cb(err, null);
                    } else {
                        
                    }
                });
            } else {
                err = "Updating a stale copy, latest version is: " + data.version + " and updating version is : " + self.custInfo.version;
                self.log.error("Version mismatch", err);
                cb(err, null);
            }
        }
    });
}

module.exports = CustomerInformation;