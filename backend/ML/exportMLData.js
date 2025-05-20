const fs = require('fs');
const { Parser } = require('json2csv');
const { Op } = require('sequelize');
const { db, User, Employee, Specialist, Interval, TherapySession } = require('../models');

(async () => {
  try {
    await db.authenticate();

    const sessions = await TherapySession.findAll({
      include: [
        {
          model: Interval,
          required: true,
          where: {
            date: { [Op.lt]: new Date() },
          },
          include: [{ model: Specialist, include: [User] }]
        },
        {
          model: Employee,
          include: [User]
        }
      ]
    });

    const rows = sessions.map(session => {
      const employee = session.employee;
      const specialist = session.interval.specialist;
      const specialistUser = specialist.user;

      const calculateAge = birthdate => {
        const ageDifMs = Date.now() - new Date(birthdate).getTime();
        const ageDate = new Date(ageDifMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
      };

      return {
        employeeId: employee.id,
        employeeDepartment: employee.department,
        preferredGender: employee.preferredGender,
        preferredTherapyStyle: employee.preferredTherapyStyle,
        preferredFormation: employee.preferredFormation,
        preferredMinAge: employee.preferredMinAge,
        preferredMaxAge: employee.preferredMaxAge,
        specialistId: specialist.id,
        specialistGender: specialistUser.gender,
        formation: specialist.formation,
        therapyStyle: specialist.therapyStyle,
        specialistAge: calculateAge(specialistUser.birthdate),
        satisfactionScore: session.satisfactionScore
      };
    });

    const parser = new Parser();
    const csv = parser.parse(rows);
    fs.writeFileSync('export-ml.csv', csv);

    console.log("✅ Export reusit în 'export-ml.csv'");
    process.exit(0);
  } catch (err) {
    console.error("❌ Eroare la export:", err);
    process.exit(1);
  }
})();
