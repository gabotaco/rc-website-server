module.exports = (sequelize, DataTypes) => {
    const Payout = sequelize.define('payout', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            manager_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            member_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            company: {
                type: DataTypes.STRING(5),
                allowNull: false
            },
            amount: {
                type: DataTypes.BIGINT,
                allowNull: false
            },
            worth: {
                type: DataTypes.BIGINT,
                allowNull: false
            }
        },
        {
            freezeTableName: true,
        }
    );

    Payout.associate = (models) => {
        Payout.hasOne(models.managers, {
            foreignKey: 'id',
            sourceKey: 'manager_id',
            as: 'manager'
        })

        Payout.hasOne(models.members, {
            foreignKey: 'id',
            sourceKey: 'member_id',
            as: 'member'
        })
    }

    return Payout;
}
