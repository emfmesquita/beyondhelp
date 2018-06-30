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
- Enables to add all monsters from unlocked content and homebrew from dndbeyond.com. From monsters listing, monster details page, homebrew monster listing, homebrew collection and homebrew creations;
- The monsters can be added with average HP or calculated one;
- Creation of independent encounters. This allows to prepare the encounters before hand and quickly swap from one to another;
- Change the monsters current HP by clicking and typing the new value or by scrolling to damage or heal;
- Customize monsters name, max hp.
- Customize hp bar/text color on encounter, list and monsters levels;
- Add custom monsters, with hp expressions (ex.: 2d12 + 2);
- Reorder monsters and lists of monsters;
- Links to each monster added to their details page on dndbeyond.com;
- Local offline usage of all encounters already created;
- All changes are auto saved and synchronized to google account and accessible from all chromes the account is logged in (unfortunately no support for chrome extensions on mobile).

### Enhanced My Characters Page
- Characters are sorted by name;
- It is possible to create collapsible folders and add characters to them.

### Enhanced Campaign Page
- Characters are sorted by name;
- On campaigns that you are the DM it is possible to create collapsible folders and add characters to them.

### Editor Plugin
- Extra button on all editors of the site that enables:
    - To add all kinds of tooltips:
        - Actions, Conditions, Equipments, Magic Items, Monsters, Senses, Skills, Spells and Weapon Properties;
        - (Beta) Backgrounds and Feats;
        - (Beta) Homebrew: Backgrounds, Feats, Magic Items, Monsters and Spells. Both from lists and personal collection.
    - To add rollable tables;
- Extra button on all editors that enables fullscreen mode.

P.S.: Background, Feat and Homebrew tooltips may cease to work if the implementation of tooltips changes on dndbeyond.com. Also tooltips of private creation are only viewable by the creator, not even by people that are on the same campaign with sharing enabled.


### Adventure Map References
- These features applies to "Lost Mine of Phandelver", "Hoard of the Dragon Queen", "Rise of Tiamat", "Princes of the Apocalypse" and "Out of the Abyss" (other adventures will be added later):
    - Hoverable tooltips on maps that can be clicked to redirect to the area description or other maps;
    - Tooltip links on compendium menus to the maps on the current page;
    - Tooltip links on adventures table of contents to the adventure maps;
    - Tooltip links on the areas description header back to the corresponding map.


### Play-by-post Notes
- Huge thanks to [gludington](https://github.com/gludington) the author of this feature;
- Collapsible area on play-by-post threads of D&D Beyond forum that enables adding private notes related with the campaign;
- All data can be seen, deleted, downloaded on the extension configuration page;
- Attention: The notes are persisted on the local machine (not synchronized between devices) and are erased if the extension is removed from chrome.
    

### Compendium References
- Extra buttons on all compendium pages that enables the user to copy references that can be pasted on:
    - D&D Beyond editors, and after saving the editor content the reference becomes a link to the compendium that also is hoverable and shows a tooltip;
    - Rich-text editors like Microsoft Word, Google Doc, Gmail and it becomes a link to the compendium with the referenced header as text;
    - Non rich-text editor as a link to the compendium.

### Roll on Tables
- Enables click to roll on most of the tables of the compendium and description pages.

### Character Page Favicon
- Changes the favicon of character page and character builder page to the character avatar.

### Global Options
- Turn on/off features of Beyond Help (right click on extension icon, then click on options, or click on wrench icon on pop up page).

## Some screenshots

### Monster Hp Tracker
![Monster Hp Tracker](http://i.imgur.com/ny8dadX.png)

### Enhanced "My Characters Page"
![Enhanced My Characters Page](http://i.imgur.com/OfrTahJ.png)

### Editor Plugin
![Add Tooltips Plugin](http://i.imgur.com/3Ln9zfJ.png)

![Extra Tooltips](http://i.imgur.com/02ECiOJ.png)

![Tables Tab](http://i.imgur.com/vlQjZyY.png)

![Table Added](http://i.imgur.com/zwHUaMO.png)

![Table Result](http://i.imgur.com/dgL6ev2.png)

### Play-by-post Notes
![Making Notes](http://i.imgur.com/9qYFhzv.png)

![Checking Notes on Options Page](http://i.imgur.com/HBTbdoh.png)

### Compendium References
##### First copy the reference
![Reference Copy](http://i.imgur.com/iafiMdY.png)

##### Then paste on editor
![Paste on Editor](http://i.imgur.com/GWwZ74L.png)

##### Result
![Reference result](http://i.imgur.com/fm2Y59O.png)

### Adventure Map References
![Reference to area description](http://i.imgur.com/IscRyQk.png)

![Link back to Map](http://i.imgur.com/BKoUP53.png)

### Character Page Favicon
![Character Page Favicon](http://i.imgur.com/gXTRLpd.png)

### Global Options
![Global Options](http://i.imgur.com/o7XwcNG.png)

### Roll on Tables
![Roll on Tables](http://i.imgur.com/ewhJtQj.png)
