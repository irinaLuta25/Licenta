const SpecialistModel = (sequelize,DataTypes) => {
    const specialist = sequelize.define(
        "specialist",
        {
            id: {
                primaryKey: true,
                autoIncrement: true,
                type: DataTypes.BIGINT
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            linkedin: {
                type: DataTypes.STRING,
                allowNull: true
            },
            facebook: {
                type: DataTypes.STRING,
                allowNull: true
            }, 
            website: {
                type: DataTypes.STRING,
                allowNull: true
            },
            isTherapist: {
                type: DataTypes.BOOLEAN,
                allowNull: true
            },
            formation: {
                type: DataTypes.STRING,
                allowNull: true
            },
            therapyStyle:{
                type: DataTypes.STRING,
                allowNull: true
            }
        }, 
        {
            underscored: true,
            freezeTableName: true
        }
    )
    return specialist;
}

module.exports=SpecialistModel;