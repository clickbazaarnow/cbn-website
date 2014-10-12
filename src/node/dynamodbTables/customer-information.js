
function CustomerInformation(dynamodb, logger) {
    this.customerInfo = dynamodb.define("CustomerInformation", function(schema){
        schema.String('emailId', {hashKey:true});
        schema.String('name');
        schema.String('mobile');
        schema.String('addressLine1');
        schema.String('addressLine2');
        schema.String('city');
        schema.String('state');
        schema.String('zipcode');
  		schema.Boolean('isActive', {default: false});
        schema.Date('updatedTime', {default: Date.now});
        schema.String('updatedBy');
    });
    this.customerInfo.config({tableName: 'CustomerInformation'});
    this.custInfo = {};
    this.log = logger;
}

CustomerInformation.prototype.setName = function(custName) {
	this.custInfo.name = custName;
}

CustomerInformation.prototype.setEmailId = function(custEmailId) {
	this.custInfo.emailId = custEmailId;
}

CustomerInformation.prototype.setMobile = function(custMobile) {
	this.custInfo.mobile = custMobile;
}

CustomerInformation.prototype.setAddressLine1 = function(custAddressLine1) {
	this.custInfo.addressLine1 = custAddressLine1;
}

CustomerInformation.prototype.setAddressLine2 = function(custAddressLine2) {
	this.custInfo.addressLine2 = custAddressLine2;
}

CustomerInformation.prototype.setCity = function(custCity) {
	this.custInfo.city = custCity;
}

CustomerInformation.prototype.setState = function(custState) {
	this.custInfo.state = custState;
}

CustomerInformation.prototype.setZipCode = function(custZipCode) {
	this.custInfo.zipcode = custZipCode;
}

CustomerInformation.prototype.setIsActive = function(custIsActive) {
	this.custInfo.isActive = custIsActive;
}

CustomerInformation.prototype.setUpdatedBy = function(custUpdatedBy) {
	this.custInfo.updatedBy = custUpdatedBy;
}

CustomerInformation.prototype.createAccount = function(cb) {
    self = this;
    var errList = self.validate();
    if(errList.length > 0) {
        cb(errList.join(), null);
        return;
    }
    self.customerInfo.create(self.custInfo, function(err, data) {
        if (err) {
            self.log.error("failed to create CustomerInformation, error", err);
        } else {
            self.log.info("created CustomerInformation table with ", data);
        }
        cb(err, data);
    });
}

CustomerInformation.prototype.activate = function(cb) {
    self = this;
    self.customerInfo.update({emailId:this.custInfo.emailId, isActive:true}, {expected:{isActive:false}}, function(err, data) {
        if(err) {
            self.log.error("failed to activate CustomerInformation, error", err);
        } else {
            self.log.info("activated CustomerInformation table with ", data);   
        }
        cb(err, data);
    });
}

CustomerInformation.prototype.validate = function() {
    var errList = []
    if(!this.custInfo.name || this.custInfo.name == "") {
        errList.push("name cannot be empty")
    }
    if(!this.custInfo.emailId || this.custInfo.emailId == "") {
        errList.push("email id cannot be empty")
    }
    if(!this.custInfo.mobile || this.custInfo.mobile == "") {
        errList.push("mobile cannot be empty")
    }
    if(!this.custInfo.addressLine1 || this.custInfo.addressLine1 == "") {
        errList.push("addressLine1 cannot be empty")
    }
    if(!this.custInfo.city || this.custInfo.city == "") {
        errList.push("city cannot be empty")
    }
    if(!this.custInfo.state || this.custInfo.state == "") {
        errList.push("state cannot be empty")
    }
    if(!this.custInfo.zipcode || this.custInfo.zipcode == "") {
        errList.push("zipcode cannot be empty")
    }
    if(!this.custInfo.updatedBy || this.custInfo.updatedBy == "") {
        errList.push("updatedBy cannot be empty")
    }
    return errList;
}
module.exports = CustomerInformation;