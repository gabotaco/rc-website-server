import sdk from "../../../tycoon-sdk/TycoonSDK"

export const webUserResolver = (db, discord_id) => {
    return new Promise(async (resolve, reject) => {
        let webUser = await db.website.findOne({where: {discord_id: discord_id}})
        if (!webUser) {
            sdk.Utility.snowflake2user(discord_id).then(async (in_game_id) => { 
                if (in_game_id) {
                    webUser = await db.website.create({discord_id: discord_id, in_game_id: in_game_id})
                }
            }).catch(() => {
                return;
            })            
        }
        resolve(webUser)
    })
};
