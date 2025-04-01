const SpecialistSpecializationModel = (sequelize,DataTypes) => {
    const specialistSpecialization = sequelize.define(
        "specialist_specialization",
        {
            id: {
                primaryKey: true,
                autoIncrement: true,
                type: DataTypes.BIGINT
            },
            dateAcquired: {
                type: DataTypes.DATE,
                allowNull: false
            }
        }, 
        {
            underscored: true,
            freezeTableName: true,
        }
    )
    return specialistSpecialization;
}

module.exports=SpecialistSpecializationModel;