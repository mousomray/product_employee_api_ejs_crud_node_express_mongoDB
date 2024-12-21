const Employee = require('../../model/employee'); // Adjust the path based on your project structure
const path = require('path');
const fs = require('fs');

class employeeuicontroller {

    // Add employee form 
    async addemployeeGet(req, res) {
        res.render('employeeview/addemployee');
    }

    // Add data in employee form
    async addemployeePost(req, res) {
        try {
            const { name, email, phone, city, pin, position } = req.body;
            if (!name || !email || !phone || !city || !pin || !position) {
                return res.status(400).send('All fields are required.');
            }
            const employeeData = {
                name: name.trim(),
                email: email.trim(),
                phone: Number(phone), // Use Number() for a cleaner conversion
                city: city.trim(),
                pin: Number(pin),
                position: position.trim(),
                image: req.file.path // Image url path
            };
            const employee = new Employee(employeeData);
            await employee.save();
            req.flash('sucess', "Employee created successfully")
            return res.redirect('/employee');
        } catch (error) {
            console.error('Error saving employee:', error);
            return res.status(500).send('Error saving employee');
        }
    }

    // Handle GET
    async employeelist(req, res) {
        try {
            const employees = await Employee.find(); // Fetch all employee from the database
            res.render('employeeview/employee', { employees }); // Render the employee page with employee data
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error retrieving employee" });
        }
    }

    // Handle GET Single employee 
    async singleemployee(req, res) {
        const id = req.params.id;
        try {
            const employee = await Employee.findById(id);
            if (!employee) {
                return res.status(404).send('Employee not found');
            }
            res.render('employeeview/editemployee', { employee });
        } catch (error) {
            console.error('Error fetching employee:', error);
            return res.status(500).send('Error fetching employee');
        }
    }

    // Handle PUT or PATCH for update employee
    async updateemployee(req, res) {
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
            const { name, email, phone, city, pin, position } = req.body;
            if (!name || !email || !phone || !city || !pin || !position) {
                return res.status(400).send('All fields are required.');
            }
            const existingEmployee = await Employee.findById(id);
            if (!existingEmployee) {
                return res.status(404).send('Employee not found.');
            }
            const employeeData = {
                name: name.trim(),
                email: email.trim(),
                phone: Number(phone), // Use Number() for a cleaner conversion
                city: city.trim(),
                pin: Number(pin),
                position: position.trim(),
                image: req.file ? req.file.path : existingEmployee.image
            };
            await Employee.findByIdAndUpdate(id, employeeData);
            console.log(`Employee with ID ${id} updated`);
            req.flash('sucess', "Employee updated successfully")
            return res.redirect('/employee'); // Redirect after updating
        } catch (error) {
            req.flash('err', "Error updating employee")
            console.error('Error updating employee:', error);
            return res.status(500).send('Error updating employee');
        }
    }


    // Handle DELETE for delete employee
    async deleteemployee(req, res) {
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
            await Employee.findByIdAndDelete(id);
            console.log(`Employee with ID ${id} deleted`);
            req.flash('sucess', "Employee deleted successfully")
            return res.redirect('/employee'); // Redirect product after deleting data
        } catch (error) {
            console.error('Error deleting employee:', error);
            return res.status(500).send('Error deleting employee');
        }
    }
}

module.exports = new employeeuicontroller();