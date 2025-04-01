const HabitModel = (sequelize, DataTypes) => {
    const habit = sequelize.define("habit", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey:true,
            autoIncrement:true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        unit: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        underscored: true,
        freezeTableName: true
    });
    return habit;
};

module.exports = HabitModel;
