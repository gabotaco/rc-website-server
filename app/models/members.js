module.exports = (sequelize, DataTypes) => {
	const Member = sequelize.define(
		'members',
		{
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
			in_game_name: {
				type: DataTypes.STRING,
				allowNull: false
			},
			in_game_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				unique: true
			},
			company: {
				type: DataTypes.STRING(5),
				allowNull: false
			},
			deadline: {
				type: DataTypes.DATE,
				allowNull: false
			},
			fire_reason: {
				type: DataTypes.TEXT
			},
			last_turnin: {
				type: DataTypes.DATE,
				allowNull: false
			},
			warnings: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 0
			},
			welcome: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: true
			}
		},
		{
			freezeTableName: true
		}
	);

	Member.associate = models => {
		Member.hasOne(models.pigs, {
			foreignKey: 'member_id',
			as: 'pigs',
			allowNull: false
		});

		Member.hasOne(models.rts, {
			foreignKey: 'member_id',
			as: 'rts',
			allowNull: false
		});
	};

	return Member;
};
