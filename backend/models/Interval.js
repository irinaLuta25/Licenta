const IntervalModel = (sequelize, DataTypes) => {
    const interval = sequelize.define("interval", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey:true,
            autoIncrement:true
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        beginTime: {
            type: DataTypes.TIME,
            allowNull: false
        },
        endTime: {
            type: DataTypes.TIME,
            allowNull: false
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    }, {
        underscored: true,
        freezeTableName: true
    });
    return interval;
};

module.exports = IntervalModel;
