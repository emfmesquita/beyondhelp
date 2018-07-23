import cos from './data/adventures/cos.json';
import ddiaMord from './data/adventures/ddia-mord.json';
import hotdq from './data/adventures/hotdq.json';
import lmop from './data/adventures/lmop.json';
import oota from './data/adventures/oota.json';
import pota from './data/adventures/pota.json';
import rot from './data/adventures/rot.json';
import skt from './data/adventures/skt.json';
import tftyp from './data/adventures/tftyp.json';
import toa from './data/adventures/toa.json';
import basicRules from './data/rules/basic-rules.json';
import dmg from './data/rules/dmg.json';
import mm from './data/rules/mm.json';
import mtof from './data/rules/mtof.json';
import phb from './data/rules/phb.json';
import scag from './data/rules/scag.json';
import ttp from './data/rules/ttp.json';
import vgtm from './data/rules/vgtm.json';
import wgte from './data/rules/wgte.json';
import xgte from './data/rules/xgte.json';

const data = {
    adventures: {
        'cos': cos,
        'ddia-mord': ddiaMord,
        'hotdq': hotdq,
        'lmop': lmop,
        'oota': oota,
        'pota': pota,
        'rot': rot,
        'skt': skt,
        'tftyp': tftyp,
        'toa': toa
    },
    rules: {
        'basic-rules': basicRules,
        'dmg': dmg,
        'mm': mm,
        'mtof': mtof,
        'phb': phb,
        'scag': scag,
        'ttp': ttp,
        'vgtm': vgtm,
        'wgte': wgte,
        'xgte': xgte
    }
};

class TOCData {
    static getBook(type: String, title: String) {
        return data[type][title];
    }
}

export default TOCData;