const EventModel = (sequelize, DataTypes) => {
    const event = sequelize.define("event", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey:true,
            autoIncrement:true
        },
        appointmentType: {
            type: DataTypes.STRING,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        dateTime: {
            type: DataTypes.DATE,
            allowNull: false
        },
        enrollmentDeadline: {
            type: DataTypes.DATE,
            allowNull: false
        },
        targetDepartment: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        underscored: true,
        freezeTableName: true
    });
    return event;
};

module.exports = EventModel;
