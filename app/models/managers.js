module.exports = (sequelize, DataTypes) => {
    const Manager = sequelize.define('managers', {
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
            rts_cashout: {
                type: DataTypes.BIGINT,
                allowNull: false,
                defaultValue: 0
            },
            rts_cashout_worth: {
                type: DataTypes.BIGINT,
                allowNull: false,
                defaultValue: 0
            },
            pigs_cashout: {
                type: DataTypes.BIGINT,
                allowNull: false,
                defaultValue: 0
            },
            pigs_cashout_worth: {
                type: DataTypes.BIGINT,
                allowNull: false,
                defaultValue: 0
            },
            total_money: {
                type: DataTypes.BIGINT,
                allowNull: false,
                defaultValue: 0
            },
            active: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            }
        },
        {
            freezeTableName: true,
        }
    );

    Manager.associate = (models) => {
        Manager.hasOne(models.members, {
            foreignKey: 'id',
            sourceKey: 'member_id',
            as: 'member'
        })
    }

    return Manager;
}
