module.exports = (sequelize, DataTypes) => {
    const Website = sequelize.define('website', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            discord_id: {
                type: DataTypes.STRING(20),
                allowNull: false
            },
            in_game_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            public_key: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: null
            },
            permission: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            }
        },
        {
            freezeTableName: true,
        }
    );

    return Website;
}
