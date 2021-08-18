module.exports = (sequelize, DataTypes) => {
    const Rts = sequelize.define('rts', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            member_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: true
            },
            vouchers: {
                type: DataTypes.BIGINT,
                allowNull: false,
                defaultValue: 0
            },
            worth: {
                type: DataTypes.BIGINT,
                allowNull: false,
                defaultValue: 0
            }
        },
        {
            freezeTableName: true,
        }
    );

    return Rts;
}
