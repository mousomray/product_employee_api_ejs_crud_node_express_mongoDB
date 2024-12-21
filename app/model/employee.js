const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmployeeSchema = new Schema({
    name: {
        type: String,
        required: "Employee name is Required",
        minlength: [3, 'Name must be at least 3 characters long']
    },
    email: {
        type: String,
        required: "Employee email is Required",
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Email address should follow the format: abc@gmail.com']
    },
    phone: {
        type: Number,
        required: "Phone number is Required",
        min: [1000000000, 'Phone number must be exactly 10 digits'],
        max: [9999999999, 'Phone number must be exactly 10 digits']
    },
    city: {
        type: String,
        required: "City is Required",
        minlength: [3, 'City must be at least 3 characters long']
    },
    pin: {
        type: Number,
        required: "Put a valid pincode"
    },
    position: {
        type: String,
        required: "Enter your work position",
        minlength: [3, 'Position must be at least 3 characters long']
    },
    image: {
        type: String,
        required: "Enter image it is Required"
    }

}, { timestamps: true }); // timestamps show create date and update date

const EmployeeModel = mongoose.model('employee', EmployeeSchema);

module.exports = EmployeeModel;