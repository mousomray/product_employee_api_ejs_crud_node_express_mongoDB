const Employee = require('../../model/employee');
const path = require('path');
const fs = require('fs');

class EmployeeController {

    // POST API 
    async create(req, res) {
        try {
            // This code is for uploading image with validation
            if (!req.file) {
                return res.status(400).json({
                    message: "Validation error",
                    errors: ["Please enter image it is required"]
                });
            }
            const employeedata = new Employee({ ...req.body, image: req.file.path }); // Assign the image path for validation
            const data = await employeedata.save();
            res.status(200).json({ succsss: true, message: "Employee added successfully", data });
        } catch (error) {
            const statusCode = error.name === 'ValidationError' ? 400 : 500;
            const message = error.name === 'ValidationError'
                ? { message: "Validation error", errors: Object.values(error.errors).map(err => err.message) }
                : { message: "An unexpected error occurred" };

            console.error(error);
            res.status(statusCode).json(message);
        }
    }

    // GET API 
    async getall(req, res) {
        try {
            const data = await Employee.find();
            res.status(200).json({
                message: "Employee list fetched successfully",
                total: data.length,
                employees: data
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Error retrieving employee data" });
        }
    }

    // GET Single 
    async getsingle(req, res) {
        const id = req.params.id;
        try {
            const data = await Employee.findById(id);
            if (data) {
                res.status(200).json({ message: "Single data fetched", data });
            } else {
                res.status(404).json({ message: "Employee not found" });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Error retrieving employee data" });
        }
    }

    // PUT OR PATCH Api for Update
    async employeeupdate(req, res) {
        const id = req.params.id;
        // Deleting image from uploads folder start
        if (req.file) {
            const employee = await Employee.findById(id);
            const imagePath = path.resolve(__dirname, '../../../', employee.image);
            if (fs.existsSync(imagePath)) {
                fs.unlink(imagePath, (err) => {
                    if (err) {
                        console.error('Error deleting image file:', err);
                    } else {
                        console.log('Image file deleted successfully:', employee.image);
                    }
                });
            } else {
                console.log('File does not exist:', imagePath);
            }
        }
        // Deleting image from uploads folder end
        try {
            const updatedemployee = await Employee.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }
            );
            // File Handling Area
            if (req.file) {
                updatedemployee.image = req.file.path
                await updatedemployee.save(); // Save the document with the updated image
            }
            if (!updatedemployee) {
                return res.status(404).json({ message: "Employee not found" });
            }
            res.status(200).json({ message: "Employee updated successfully", data: updatedemployee });
        } catch (error) {
            const statusCode = error.name === 'ValidationError' ? 400 : 500;
            const message = error.name === 'ValidationError'
                ? { message: "Validation error", errors: Object.values(error.errors).map(err => err.message) }
                : { message: "Error updating employee data" };

            console.error(error);
            res.status(statusCode).json(message);
        }
    }

    // DELETE Api
    async employeedelete(req, res) {
        const id = req.params.id;
        // Deleting image from uploads folder start
        const employee = await Employee.findById(id);
        const imagePath = path.resolve(__dirname, '../../../', employee.image);
        if (fs.existsSync(imagePath)) {
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error('Error deleting image file:', err);
                } else {
                    console.log('Image file deleted successfully:', employee.image);
                }
            });
        } else {
            console.log('File does not exist:', imagePath);
        }
        // Deleting image from uploads folder end
        try {
            const deletedemployee = await Employee.findByIdAndDelete(id);
            res.status(deletedemployee ? 200 : 404).json(
                deletedemployee ? { message: "Employee deleted successfully" } : { message: "Employee not found" }
            );
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error deleting employee" });
        }
    }
}

module.exports = new EmployeeController();
