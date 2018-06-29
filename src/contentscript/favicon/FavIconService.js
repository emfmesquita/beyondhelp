import $ from "jquery";

const characterRegex = /^\/profile\/.*\/characters\/.*/;

const shouldChangeFavIcon = function (regex: RegExp): boolean {
    return regex.test(window.location.pathname);
};

const setFavicon = function (url: string) {
    const link = document.querySelector("link[rel*='icon']") || document.createElement("link");
    link.type = "image/x-icon";
    link.rel = "shortcut icon";
    link.href = url;
    $("head").append(link);
};

class FavIconService {
    static changeCharacterFavIcon(): void {
        if (!shouldChangeFavIcon(characterRegex)) return;

        const checkAvatar = setInterval(function () {
            const avatarEl = $(".character-builder-page-header-avatar, .ct-character-tidbits__avatar");
            if (!avatarEl || !avatarEl.length) return;

            clearInterval(checkAvatar);

            let backImageCss = avatarEl.css("background-image");
            if (!backImageCss) return;

            backImageCss = backImageCss.substring(5, backImageCss.length - 2);
            backImageCss = backImageCss.replace("http://", "https://");

            setFavicon(backImageCss);
        }, 1000);
    }
}

export default FavIconService;