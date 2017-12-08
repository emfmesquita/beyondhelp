/* global chrome */

class UserService {
    /**
     * Gets the current logged user username.
     */
    static getCurrentUsername(): Promise<string> {
        return new Promise((resolve, reject) => {
            chrome.cookies.getAll({
                domain: ".dndbeyond.com",
                name: "User.Username"
            }, (cookies) => {
                const cookie = cookies && cookies[0] ? cookies[0] : null;
                const username = cookie ? cookie.value : null;
                chrome.runtime.lastError ? reject(chrome.runtime.lastError) : resolve(username);
            });
        });
    }
}

export default UserService;