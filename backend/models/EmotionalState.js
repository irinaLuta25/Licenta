const EmotionalStateModel = (sequelize, DataTypes) => {
    const emotionalState = sequelize.define("emotional_state", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey:true,
            autoIncrement: true
        },
        mood: {
            type: DataTypes.STRING,
            allowNull: false
        },
        intensity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        details: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        underscored: true,
        freezeTableName: true,
    });

    return emotionalState;
};

module.exports = EmotionalStateModel;
