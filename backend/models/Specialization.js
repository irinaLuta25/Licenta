const SpecializationModel = (sequelize,DataTypes) => {
    const specialization = sequelize.define(
        "specialization",
        {
            id: {
                primaryKey: true,
                autoIncrement: true,
                type: DataTypes.BIGINT
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: false
            },
        }, 
        {
            underscored: true,
            freezeTableName: true
        }
    )
    return specialization;
}

module.exports=SpecializationModel;