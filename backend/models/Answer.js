const AnswerModel = (sequelize, DataTypes) => {
    const answer = sequelize.define("answer", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey:true,
            autoIncrement: true
        },
        answer: {
            type: DataTypes.TEXT,
            allowNull: false
        },
    }, {
        underscored: true,
        freezeTableName: true,
    });
    return answer;
};

module.exports = AnswerModel;
