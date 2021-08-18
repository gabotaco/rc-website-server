module.exports = (sequelize, DataTypes) => {
    const Website = sequelize.define('website', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            discord_id: {
                type: DataTypes.STRING(18),
                allowNull: false
            },
            in_game_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
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
