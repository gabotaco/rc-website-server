const accessHistory = {};

export const addUser = (token, expires_in, user) => {
	accessHistory[token] = {
		...user,
		expires_at: Date.now() + expires_in * 1000
	};
};

export const removeUser = token => {
	delete accessHistory[token];
};

export const getUser = token => {
	const user = accessHistory[token];
	if (user) {
		if (Date.now() <= user.expires_at) {
			return user;
		} else {
			delete accessHistory[token];
			return null;
		}
	} else {
		return null;
	}
};

export default accessHistory;
