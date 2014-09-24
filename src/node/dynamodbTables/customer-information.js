
function CustomerInformation(dynamodb) {
    this.customerInfo = dynamodb.define("CustomerInformation", function(schema){
        schema.String('emailId', {hashKey:true});
        schema.String('name');
        schema.String('password');
        schema.String('mobile');
        schema.String('addressLine1');
        schema.String('addressLine2');
        schema.String('city');
        schema.String('state');
        schema.String('zipcode');
  		schema.Boolean('isActive');
        schema.Date('updatedTime');
        schema.String('updatedBy');
    });
    this.cbnCounter.config({tableName: 'CustomerInformation'});
    this.custInfo = {};
}

CustomerInformation.prototype.setName() = function(custName) {
	this.custInfo.name = custName;
}

CustomerInformation.prototype.setEmailId() = function(custEmailId) {
	this.custInfo.emailId = custEmailId;
}

CustomerInformation.prototype.setPassword() = function(custPassword) {
	this.custInfo.password = custPassword;
}

CustomerInformation.prototype.setMobile() = function(custMobile) {
	this.custInfo.mobile = custMobile;
}

CustomerInformation.prototype.setAddressLine1() = function(custAddressLine1) {
	this.custInfo.addressLine1 = custAddressLine1;
}

CustomerInformation.prototype.setAddressLine2() = function(custAddressLine2) {
	this.custInfo.addressLine2 = custAddressLine2;
}

CustomerInformation.prototype.setCity() = function(custCity) {
	this.custInfo.city = custCity;
}

CustomerInformation.prototype.setState() = function(custState) {
	this.custInfo.state = custState;
}

CustomerInformation.prototype.setZipCode() = function(custZipCode) {
	this.custInfo.zipcode = custZipCode;
}

CustomerInformation.prototype.setIsActive() = function(custIsActive) {
	this.custInfo.isActive = custIsActive;
}

CustomerInformation.prototype.setUpdatedBy() = function(custUpdatedBy) {
	this.custInfo.updatedBy = custUpdatedBy;
}

modules.export = CustomerInformation;