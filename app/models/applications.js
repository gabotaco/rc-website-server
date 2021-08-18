module.exports = (sequelize, DataTypes) => {
    const Application = sequelize.define('applications', {
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
            in_game_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            in_game_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            referred_id: {
                type: DataTypes.INTEGER,
            },
            cooldown: {
                type: DataTypes.DATEONLY,
            },
            play_per_week: {
                type: DataTypes.STRING(40),
                allowNull: false
            },
            company: {
                type: DataTypes.STRING(5),
                allowNull: false
            },
            country: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            why: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            anything: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            status: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: "Received"
            },
            status_info: {
                type: DataTypes.TEXT,                
            },
            paid: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            }
        },
        {
            freezeTableName: true,
        }
    );

    return Application;
}
