const bcrypt = require("bcryptjs");
const { fakerRO: faker } = require('@faker-js/faker');

const {
  User,
  Specialist,
  Interval,
  Event,
  EmployeeEvent,
  Employee,
  db,
} = require("./models");


const departments = ["Resurse Umane", "Financiar", "Marketing", "IT", "General"];
const eventTypes = ["workshop", "training"];
const startDate = new Date("2023-01-01");
const endDate = new Date("2025-05-29");

const generateEventDescription = () => {
  return faker.lorem.paragraphs(5);
};

const generateIntervalsPerSpecialist = async (specialistId, year) => {
  const intervals = [];
  for (let i = 0; i < 4; i++) {
    const day = faker.date.between({
      from: new Date(`${year}-01-01`),
      to: new Date(`${year}-12-31`),
    });
    if (day > endDate) continue;
    const beginTime = "10:00:00";
    const endTime = "12:00:00";
    const interval = await Interval.create({
      specialistId,
      date: day,
      beginTime,
      endTime,
      status: true,
    });
    intervals.push(interval);
  }
  return intervals;
};

const createSpecialistWithUser = async (index) => {
  const gender = faker.helpers.arrayElement(["masculin", "feminin", "altul"]);
  const hashedPassword = await bcrypt.hash("123", 10);
  const user = await User.create({
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: `specialist_test${index}@gmail.com`,
    phoneNumber: faker.phone.number(),
    birthdate: faker.date.birthdate({ min: 25, max: 50, mode: "age" }),
    gender,
    password: hashedPassword,
    role: "specialist",
    profileImage: null,
  });
  const specialist = await Specialist.create({
    userId: user.id,
    description: faker.lorem.paragraphs(3),
    linkedin: null,
    facebook: null,
    website: null,
    isTherapist: false,
    formation: null,
    therapyStyle: null,
  });
  return specialist;
};

const createEventsWithParticipants = async () => {
  const employees = await Employee.findAll();
  if (employees.length === 0) {
    console.log("Nu exista angajati in baza de date.");
    return;
  }

  const generateEventTitle = () => {
  const titles = [
    "Gestionarea stresului la locul de muncă",
    "Comunicare eficientă în echipă",
    "Atelier de mindfulness și respirație conștientă",
    "Tehnici de relaxare pentru angajați",
    "Instruire: prevenirea burnout-ului",
    "Cum să oferi feedback constructiv",
    "Atelier: echilibrul viață personală – muncă",
    "Instruire: reziliență psihologică în mediul corporativ",
    "Atelier de meditație ghidată pentru începători",
    "Abilități esențiale pentru manageri empatici",
    "Tehnici de time management pentru angajați",
    "Mindfulness în activitatea zilnică",
    "Workshop: ascultarea activă și empatia",
    "Cum să identifici semnele epuizării emoționale",
    "Stiluri de atașament în relațiile de muncă",
  ];
  return faker.helpers.arrayElement(titles);
};


  for (let i = 0; i < 3; i++) {
    const specialist = await createSpecialistWithUser(i);
    const years = [2023, 2024, 2025];
    for (const year of years) {
      const intervals = await generateIntervalsPerSpecialist(specialist.id, year);
      for (const interval of intervals) {
        const event = await Event.create({
          name: generateEventTitle(),
          description: generateEventDescription(),
          enrollmentDeadline: new Date(interval.date.getTime() - 86400000),
          targetDepartment: faker.helpers.arrayElement(departments),
          type: faker.helpers.arrayElement(eventTypes),
          image: null,
          specialistId: specialist.id,
          intervalId: interval.id,
        });

        const shuffledEmployees = faker.helpers.shuffle(employees);
        const participants = shuffledEmployees.slice(0, faker.number.int({ min: 3, max: 6 }));

        for (const emp of participants) {
          await EmployeeEvent.create({
            employeeId: emp.id,
            eventId: event.id,
          });
        }
      }
    }
  }
};

(async () => {
  try {
    await db.sync();
    await createEventsWithParticipants();
    console.log("Populare finalizata cu succes.");
  } catch (err) {
    console.error("Eroare la populare:", err);
  } finally {
    await db.close();
  }
})();
