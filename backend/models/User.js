const UserModel = (sequelize,DataTypes) => {
    const user = sequelize.define(
        "user", 
        {
            id: {
                primaryKey: true,
                autoIncrement: true,
                type: DataTypes.BIGINT
            },
            firstName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            lastName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            phoneNumber: {
                type: DataTypes.STRING,
                allowNull: false
            },
            birthdate: {
                type: DataTypes.DATE,
                allowNull: false
            },
            gender: {
                type: DataTypes.STRING,
                allowNull: false
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            },
            role: {
                type: DataTypes.STRING,
                allowNull: true
            }
        }, {
            underscored: true,
            freezeTableName: true
        }
    )
    return user;
}

module.exports=UserModel;