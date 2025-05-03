const EventModel = (sequelize, DataTypes) => {
    const event = sequelize.define("event", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey:true,
            autoIncrement:true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        enrollmentDeadline: {
            type: DataTypes.DATE,
            allowNull: false
        },
        targetDepartment: {
            type: DataTypes.STRING,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        managerIsParticipant: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    }, {
        underscored: true,
        freezeTableName: true
    });
    return event;
};

module.exports = EventModel;
