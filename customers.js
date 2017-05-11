//customers.js
var faker = require('faker')
// sets locale to zh_CN
faker.locale = "zh_CN";

function generateCustomers() {
    var customers = []

    for (var id = 0; id < 50; id++) {
        var name = faker.name.findName();
        var email = faker.internet.email();
        var address = faker.address.streetAddress() + faker.address.city() + faker.address.country();
        var phoneNumber = faker.phone.phoneNumber();
        var image = faker.image.avatar();
        var companyName = faker.company.companyName();

        customers.push({
            "id": id,
            "name": name,
            "email": email,
            "address": address,
            "phone": phoneNumber,
            "image": image,
            "companyName": companyName,
        })
    }

    return {"customers": customers}
}

// 如果你要用json-server的话，就需要export这个生成fake data的function
module.exports = generateCustomers