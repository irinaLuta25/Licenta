const EmployeeModel=(sequelize,DataTypes) => {
    const employee=sequelize.define(
        "employee",
        {
            id: {
                primaryKey: true,
                autoIncrement: true,
                type: DataTypes.BIGINT
            },
            hireDate: {
                type: DataTypes.DATE,
                allowNull: true
            },
            department: {
                type: DataTypes.STRING,
                allowNull:true
            },
            isManager:  {
                type: DataTypes.BOOLEAN,
                allowNull: true
            },
            allowAnonymous: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            preferredGender: {
                type: DataTypes.STRING,
                allowNull:true
            },
            preferredMinAge: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            preferredMaxAge: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            preferredFormation: {
                type: DataTypes.STRING,
                allowNull:true
            },
            preferredSpecialization: {
                type: DataTypes.STRING,
                allowNull:true
            },
            preferredTherapyStyle: {
                type: DataTypes.STRING,
                allowNull: true
            },
        }, 
        {
            underscored: true,
            freezeTableName: true
        }
    )
    return employee;
}

module.exports=EmployeeModel;