const TherapySessionModel = (sequelize, DataTypes) => {
    const therapySession = sequelize.define("therapy_session", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        satisfactionScore: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                min: 1,
                max: 5
            }
        }
    }, {
        underscored: true,
        freezeTableName: true
    });
    return therapySession;
};

module.exports = TherapySessionModel;
