const HabitTrackingModel = (sequelize, DataTypes) => {
    const habitTracking = sequelize.define("habit_tracking", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey:true,
            autoIncrement:true
        },
        value: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        recordedAt: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        underscored: true,
        freezeTableName: true,
    });
    return habitTracking;
};  

module.exports = HabitTrackingModel;
