module.exports = (sequelize, DataTypes) => {
  const Warning = sequelize.define(
    "warning",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      member_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      reason: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
    }
  );

  return Warning;
};
