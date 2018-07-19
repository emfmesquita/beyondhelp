import rules from './data/rules.json';
import adventures from './data/adventures.json';

class TOCData {
    static getBook(type: String, title: String) {
        switch (type) {
            case 'adventures':
                return adventures[title];
            case 'rules':
                return rules[title];
        }
    }
}

export default TOCData;