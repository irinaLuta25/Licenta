const RewardModel = (sequelize, DataTypes) => {
    const reward = sequelize.define("reward", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey:true,
            autoIncrement:true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, {
        underscored: true,
        freezeTableName: true
    });
    return reward;
};

module.exports = RewardModel;
