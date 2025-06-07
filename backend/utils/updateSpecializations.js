const { Employee, Specialist, sequelize } = require("../models");

const SPECIALIZATIONS = [
  "Adictii",
  "Tulburări de anxietate și depresie",
  "Traumă și abuz",
  "Burnout"
];

function getRandomSpecialization() {
  return SPECIALIZATIONS[Math.floor(Math.random() * SPECIALIZATIONS.length)];
}

(async () => {
  try {

    const employees = await Employee.findAll();
    const specialists = await Specialist.findAll();

    for (const emp of employees) {
      emp.preferredSpecialization = getRandomSpecialization();
      await emp.save();
    }

    for (const spec of specialists) {
      spec.specialization = getRandomSpecialization();
      await spec.save();
    }

    console.log("Specializările au fost actualizate cu succes.");
    process.exit(0);
  } catch (err) {
    console.error("Eroare la actualizare:", err);
    process.exit(1);
  }
})();
