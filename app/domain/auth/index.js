const accessHistory = {}

export const addUser = (token, expires_in, user) => {
    accessHistory[token] = {...user, expires_at: Date.now() + expires_in};
}

export const getUser = (token) => {
    const user = accessHistory[token]
    if (user && Date.now() <= user.expires_at) {
        return user;
    } else {
        return null;
    }
}

export default accessHistory;