import { FragmentData, FragmentService } from "../../services/FragmentService";

import C from "../../Constants";

class MapLinksUtils {
    static href(page: string, contentId: string) {
        return `${C.AdventuresPage}${page}${FragmentService.format("", contentId, "", true)}`;
    }

    static click(e: MouseEvent, href: string) {
        if (e.button !== 0) return;
        e.preventDefault();
        e.stopPropagation();
        if (window.location.href === href) {
            window.dispatchEvent(new Event("hashchange"));
        } else {
            window.location = href;
        }
    }
}

export default MapLinksUtils;