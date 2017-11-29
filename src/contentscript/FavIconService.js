import $ from "jquery";

const regex = /^\/profile\/.*\/characters\/.*/;
const avatarQuery = ".character-builder-page-header-avatar, .character-tidbits-avatar";

const shouldChangeFavIcon = function (): boolean {
    return regex.test(window.location.pathname);
}

class FavIconService {
    static changeFavIcon(): void {
        if (!shouldChangeFavIcon()) return;

        const checkAvatar = setInterval(function () {
            const avatarEl = $(avatarQuery);
            if (!avatarEl || !avatarEl.length) return;

            clearInterval(checkAvatar);

            const backImageCss = avatarEl.css("background-image");
            if (!backImageCss) return;

            const link = document.querySelector("link[rel*='icon']") || document.createElement("link");
            link.type = "image/x-icon";
            link.rel = "shortcut icon";
            link.href = backImageCss.substring(5, backImageCss.length - 2);
            $("head").append(link);
        }, 1000);
    }
}

export default FavIconService;