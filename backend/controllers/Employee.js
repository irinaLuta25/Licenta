const EmployeeDb = require("../models").Employee;

const controller = {
    createEmployee: async (req, res) => {
        const employee = {
            userId:req.body.userId,
            hireDate: req.body.hireDate,
            allowAnonymous: req.body.allowAnonymous,
            isManager: req.body.isManager,
            department: req.body.department,
            preferredGender: req.body.preferredGender,
            preferredMinAge: req.body.preferredMinAge,
            preferredMaxAge: req.body.preferredMaxAge,
            preferredFormation: req.body.preferredFormation,
            preferredSpecialization: req.body.preferredSpecialization,
            preferredTherapyStyle: req.body.preferredTherapyStyle,
        };

        try {
            const newEmployee = await EmployeeDb.create(employee);
            res.status(200).send(newEmployee);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    updateEmployee: async (req, res) => {
        const employeeId = req.params.id;
        const payload = {
            userId:req.body.userId,
            hireDate: req.body.hireDate,
            allowAnonymous: req.body.allowAnonymous,
            isManager: req.body.isManager,
            department: req.body.department,
            preferredGender: req.body.preferredGender,
            preferredMinAge: req.body.preferredMinAge,
            preferredMaxAge: req.body.preferredMaxAge,
            preferredFormation: req.body.preferredFormation,
            preferredSpecialization: req.body.preferredSpecialization,
            preferredTherapyStyle: req.body.preferredTherapyStyle,
        };

        try {
            const employee = EmployeeDb.findByPk(employeeId);
            if (!employee) {
                return res.status(400).send("Employee not found");
            }

            const newEmployee = await employee.update(payload);
            res.status(200).send(newEmployee);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    deleteEmployee: async (req, res) => {
        const id = req.params.id;
        try {
            const employee = await EmployeeDb.findByPk(id);
            if (employee) {
                await employee.destroy();
                res.status(200).send("S-a sters");
            }
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    getAllEmployees: async (req, res) => {
        try {
            const employees = await EmployeeDb.findAll();
            res.status(200).send(employees);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    getEmployeeById: async (req, res) => {
        const id = req.params.id;
        try {
            const employee = await EmployeeDb.findByPk(id);
            res.status(200).send(employee);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    getAllEmployeesByDepartment: async (req, res) => {
        const {department}=req.params;
        if(!department){
            throw new Error("No  provided");
        }
        try {
            const employees = await EmployeeDb.findAll({
                where: {department}
            });
            res.status(200).send(employees);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    getAllEmployeesForReports: async (req, res) => {
        try {
            const employees = await EmployeeDb.findAll({
                where: {
                    allowAnonymous: true
                }
            });
            res.status(200).send(employees);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

}

module.exports=controller;