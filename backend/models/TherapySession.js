const TherapySessionModel = (sequelize, DataTypes) => {
    const therapySession = sequelize.define("therapy_session", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey:true,
            autoIncrement:true
        },
        locationType: {
            type: DataTypes.STRING,
            allowNull: false
        },
        location: {
            type: DataTypes.STRING,
            allowNull: true
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: false
            // de schimbat in true
        },
    }, {
        underscored: true,
        freezeTableName: true
    });
    return therapySession;
};

module.exports = TherapySessionModel;
