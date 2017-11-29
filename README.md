# beyondhelp
Chrome extension with helpers to https://www.dndbeyond.com/. 

Realeased version on [Chrome Web Store](https://chrome.google.com/webstore/detail/beyond-help/aojmegjchfjmkgmihimpplblfalnpdop?hl=en).

## Setup for Developers

With Node.js installed, from the base directory of this repository:
```bash
npm install
```
Then:
```bash
npm run build
```
After the build task just open a chrome window and go to `chrome://extensions/` from address bar, check the `Developer mode` on the top right. Finally click on `Load unpacked extension...` and select the `build` folder generated from the build task.

## Current features

### Monster Hp Tracker
- To add all monsters from unlocked content and homebrew from dndbeyond.com. From monsters listing, monster details page, homebrew monster listing, homebrew collection and homebrew creations;
- The monsters can be added with average HP or calculated one;
- Creation of independent encounters. This allows to prepare the encounters before hand and quickly swap from one to another;
- Change the monsters current HP by clicking and typing the new value or by scrolling to damage or heal;
- Links to each monster added to their details page on dndbeyond.com (middle click to open on a new tab);
- Local offline usage of all encounters already created;
- All changes are auto saved and synchronized to google account and accessible from all chromes the account is logged in (unfortunately no support for chrome extensions on mobile).

### Better Printing Layout
- Enables a better layout when printing the detail page of monsters, feats, spells, magic items and backgrounds.

### Character Page Favicon
- Changes the favicon of character page and character builder page to the character avatar.

## Some screenshots

![Add From Monster Listing](http://i.imgur.com/pU5WvoG.png)
![Add From Monsters Detail Page](http://i.imgur.com/c9usntG.png)
![Add From Homebrew](http://i.imgur.com/rEZXS8P.png)
![Progress Bar Tooltip](http://i.imgur.com/KH3Xzbn.png)
![Scroll to Damage](http://i.imgur.com/BxiMxPU.png)
![Select of Encounters](http://i.imgur.com/PYYdsMW.png)
