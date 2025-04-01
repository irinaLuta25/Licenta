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
                allowNull: false
            },
            linkedin: {
                type: DataTypes.STRING,
                allowNull: false
            },
            facebook: {
                type: DataTypes.STRING,
                allowNull: false
            }, 
            website: {
                type: DataTypes.STRING,
                allowNull: false
            },
            isTherapist: {
                type: DataTypes.BOOLEAN,
                allowNull: false
            },
            formation: {
                type: DataTypes.STRING,
                allowNull: false
            },
            therapyStyle:{
                type: DataTypes.STRING,
                allowNull: false
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