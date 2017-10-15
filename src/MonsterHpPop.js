import $ from "jquery"
import "bootstrap";
import "./MonsterHpPop.css";

const buildContent = function (hpChange: number) {
    let cssClass = "";
    if (hpChange > 0) {
        cssClass = "Monster-hp-pop-heal";
    } else if (hpChange < 0) {
        cssClass = "Monster-hp-pop-damage";
    }
    const hpContent = hpChange > 0 ? `+${hpChange}` : `${hpChange}`;
    return `<span class="Monster-hp-pop ${cssClass}">${hpContent}</span>`;
}

class MonsterHpPop {
    constructor(targetId: string, targetOriginalTitle: string) {
        this.selector = `#${targetId}`;
        this.targetOriginalTitle = targetOriginalTitle;
        this.isVisible = false;
        this.startHp = 0;
    }

    update(oldHp: number, newHp: number) {
        if (!this.isVisible) {
            this.startHp = oldHp;
        }
        const content = buildContent(newHp - this.startHp);
        const targetDiv = $(this.selector);
        if (!this.isVisible) {
            targetDiv.popover({ content, placement: "top", trigger: "hover", html: true });
            targetDiv.popover("show");
            this.isVisible = true;
        } else {
            targetDiv.attr('data-content', content);
            var popover = targetDiv.data('bs.popover');
            popover.setContent();
            popover.$tip.addClass(popover.options.placement);
        }
    }

    hide() {
        $(this.selector).popover("destroy");
        $(this.selector).attr("title", this.targetOriginalTitle);
        this.isVisible = false;
    }
}

export default MonsterHpPop;