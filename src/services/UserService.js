/* global chrome */

class UserService {
    /**
     * Gets the current logged user username.
     */
    static getCurrentUsername(): Promise<string> {
        return new Promise((resolve, reject) => {
            chrome.cookies.getAll({
                domain: ".dndbeyond.com",
                name: "User"
            }, (cookies) => {
                const cookie = cookies && cookies[0] ? cookies[0] : null;
                const value = cookie ? cookie.value : null;
                let username = null;
                if (value) {
                    value.split("&").forEach(token => {
                        if (token.startsWith("UserName=")) username = token.replace("UserName=", "");
                    });
                }
                chrome.runtime.lastError ? reject(chrome.runtime.lastError) : resolve(username);
            });
        });
    }
}

export default UserService;