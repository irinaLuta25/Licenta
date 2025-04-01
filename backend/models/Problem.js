const ProblemModel = (sequelize, DataTypes) => {
    const problem = sequelize.define("problem", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey:true,
            autoIncrement:true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        isAnonymous: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
    }, {
        underscored: true,
        freezeTableName: true
    });
    return problem;
};

module.exports = ProblemModel;
