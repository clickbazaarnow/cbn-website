
/*
 * This cust_info producer table
 */

function CustomerInformationFactory(dynamodb, logger) {
    this.customerInfo = dynamodb.define("CustomerInformationFactory", function(schema){
        schema.String('emailId', {hashKey:true});
        schema.TimeUUID('factoryId', {rangeKey:true});
        schema.String('name').required();
        schema.String('mobile').required();
        schema.String('addressLine1').required();
        schema.String('addressLine2');
        schema.String('city').required();
        schema.String('state').required();
        schema.String('zipcode').required();
    });
    this.customerInfo.config({tableName: 'cbn_cust_info_factory'});
    this.custInfo = {};
    this.log = logger;
}

CustomerInformationFactory.prototype.setName = function(custName) {
	this.custInfo.name = custName;
}

CustomerInformationFactory.prototype.setEmailId = function(custEmailId) {
	this.custInfo.emailId = custEmailId;
}

CustomerInformationFactory.prototype.setMobile = function(custMobile) {
	this.custInfo.mobile = custMobile;
}

CustomerInformationFactory.prototype.setAddressLine1 = function(custAddressLine1) {
	this.custInfo.addressLine1 = custAddressLine1;
}

CustomerInformationFactory.prototype.setAddressLine2 = function(custAddressLine2) {
	this.custInfo.addressLine2 = custAddressLine2;
}

CustomerInformationFactory.prototype.setCity = function(custCity) {
	this.custInfo.city = custCity;
}

CustomerInformationFactory.prototype.setState = function(custState) {
	this.custInfo.state = custState;
}

CustomerInformationFactory.prototype.setZipCode = function(custZipCode) {
	this.custInfo.zipcode = custZipCode;
}

CustomerInformationFactory.prototype.createRecord = function(cb) {
    self = this;
    self.customerInfo.create(self.custInfo, function(err, data) {
        if (err) {
            self.log.error("failed to create factory record, error", err);
        } else {
            self.log.info("created record in cbn_cust_info_factory table with ", data);
        }
        cb(err, data);
    });
}

CustomerInformationFactory.prototype.getRecord = function(emailId, factoryId, cb) {
    self = this;
    self.custInfo.get(emailId, factoryId, function(err, data) {
        if(err) {
            self.log.error("failed to get record for emailId : " + emailId + " and factoryId :" + factoryId, err);
            cb(err, null);
        } else {
            cb(null, data);
        }
    });
}
module.exports = CustomerInformationFactory;