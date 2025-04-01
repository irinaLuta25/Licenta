const QuestionModel = (sequelize, DataTypes) => {
    const question = sequelize.define("question", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey:true,
            autoIncrement:true
        },
        text: {
            type: DataTypes.TEXT,
            allowNull: false
        },
    }, {
        underscored: true,
        freezeTableName: true
    });
    return question;
};

module.exports = QuestionModel;
