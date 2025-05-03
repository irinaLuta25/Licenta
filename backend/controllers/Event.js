const EventDb = require("../models").Event;
const EmployeeEventDb = require("../models").EmployeeEvent;
const { Op } = require("sequelize");
const bucket = require("../config/firebaseConfig");


const controller = {
    // createEvent: async (req, res) => {
    //     try {
    //         const event = await EventDb.create({
    //             name: req.body.name,
    //             description: req.body.description,
    //             specialistId:req.body.specialistId,
    //             dateTime: req.body.dateTime,
    //             enrollmentDeadline: req.body.enrollmentDeadline,
    //             targetDepartment: req.body.targetDepartment,
    //             intervalId:req.body.intervalId,
    //             type:req.body.type,
    //             managerIsParticipant:req.body.managerIsParticipant,
    //             image: req.body.image
    //         });
    //         res.status(200).send(event);
    //     } catch (err) {
    //         res.status(500).send(err.message);
    //     }
    // },

    createEvent: async (req, res) => {
        try {
          const {
            name,
            description,
            specialistId,
            enrollmentDeadline,
            targetDepartment,
            intervalId,
            type,
            managerIsParticipant,
            dateTime,
          } = req.body;
      
          let imageUrl = null;
      
          if (req.file) {
            const file = req.file;
            const firebaseFileName = `${Date.now()}_${file.originalname}`;
            const blob = bucket.file(`event-images/${firebaseFileName}`);
      
            const blobStream = blob.createWriteStream({
              resumable: false,
              metadata: {
                contentType: file.mimetype,
              },
            });
      
            // Așteaptă finalizarea streamului cu promisiune
            await new Promise((resolve, reject) => {
              blobStream.on("finish", resolve);
              blobStream.on("error", reject);
              blobStream.end(file.buffer);
            });
      
            // Fă imaginea publică și obține URL-ul
            await blob.makePublic();
            imageUrl = `https://storage.googleapis.com/${bucket.name}/event-images/${firebaseFileName}`;
          }
      
          const event = await EventDb.create({
            name,
            description,
            specialistId,
            enrollmentDeadline,
            targetDepartment,
            intervalId,
            type,
            managerIsParticipant,
            dateTime,
            image: imageUrl,
          });
      
          return res.status(200).json(event);
        } catch (err) {
          console.error("Eroare la creare eveniment:", err.message);
          return res.status(500).json({ message: err.message });
        }
    },
      

    updateEvent: async (req, res) => {
        try {
            const event = await EventDb.findByPk(req.params.id);
            if (!event) return res.status(400).send("Event not found");

            const updated = await event.update({
                name: req.body.name,
                description: req.body.description,
                specialistId:req.body.specialistId,
                dateTime: req.body.dateTime,
                enrollmentDeadline: req.body.enrollmentDeadline,
                targetDepartment: req.body.targetDepartment,
                intervalId:req.body.intervalId,
                type:req.body.type,
                managerIsParticipant:req.body.managerIsParticipant,
                image: req.body.image
            });
            res.status(200).send(updated);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    deleteEvent: async (req, res) => {
        try {
            const eventId = req.params.id;
    
            const event = await EventDb.findByPk(eventId);
            if (!event) {
                return res.status(404).send("Event not found");
            }
    
            await EmployeeEventDb.destroy({
                where: { eventId }
            });
    
            await event.destroy();
    
            res.status(200).send("Event and related inscriptions deleted");
        } catch (err) {
            console.error("Eroare la ștergerea evenimentului:", err);
            res.status(500).send(err.message);
        }
    },
    

    getAllEvents: async (req, res) => {
        try {
            const events = await EventDb.findAll();
            res.status(200).send(events);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    getEventById: async (req, res) => {
        try {
            const event = await EventDb.findByPk(req.params.id);
            res.status(200).send(event);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    getAllEventsBySpecialistId: async (req, res) => {
        const {specialistId}=req.params;
        if(!specialistId) {
            throw new Error("No ID provided");
        }
        try {
            const events = await EventDb.findAll({
                where: {specialistId}
            });
            res.status(200).send(events);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    getAllEventsByTargetDepartment: async (req, res) => {
        const department=req.params.department;
        if(!department) {
            return res.status(400).send("No target department provided");
        }
        try {
            const events = await EventDb.findAll({
                where: {
                    [Op.or]: [
                        { targetDepartment: department },             
                        { targetDepartment: 'general' }
                    ]
                }
            });
            res.status(200).send(events);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    getAllTrainings: async (req, res) => {
        try {
            const events = await EventDb.findAll({
                where: {
                    type:"training"
                }
            });
            res.status(200).send(events);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },
    
    getAllWorkshops: async (req, res) => {
        try {
            const events = await EventDb.findAll({
                where: {
                    type:"workshop"
                }
            });
            res.status(200).send(events);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    getAllEventsForManagers: async (req, res) => {
        try {
            const events = await EventDb.findAll({
                where: {
                    managerIsParticipant:true
                }
            });
            res.status(200).send(events);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },
};

module.exports = controller;