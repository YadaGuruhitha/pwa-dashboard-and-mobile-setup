import { SupportedLanguage } from '../../types';
import { en } from './en';
import { as } from './as';
import { bn } from './bn';
import { brx } from './brx';
import { doi } from './doi';
import { gu } from './gu';
import { hi } from './hi';
import { kn } from './kn';
import { ks } from './ks';
import { kok } from './kok';
import { mai } from './mai';
import { ml } from './ml';
import { mni } from './mni';
import { mr } from './mr';
import { ne } from './ne';
import { or } from './or';
import { pa } from './pa';
import { sa } from './sa';
import { sat } from './sat';
import { sd } from './sd';
import { ta } from './ta';
import { te } from './te';
import { ur } from './ur';
import { bho, tcy, raj, hne, kha, grt, lus, trp, gon } from './regional';

export {
  en, as, bn, brx, doi, gu, hi, kn, ks, kok, mai, ml, mni, mr, ne, or, pa, sa, sat, sd, ta, te, ur,
  bho, tcy, raj, hne, kha, grt, lus, trp, gon,
};

export const LOCALES: Record<SupportedLanguage, Record<string, string>> = {
  // English Reference
  en,

  // 22 Eighth Schedule Indian Languages
  as,
  bn,
  brx,
  doi,
  gu,
  hi,
  kn,
  ks,
  kok,
  mai,
  ml,
  mni,
  mr,
  ne,
  or,
  pa,
  sa,
  sat,
  sd,
  ta,
  te,
  ur,

  // Regional Varieties
  bho,
  tcy,
  raj,
  hne,
  kha,
  grt,
  lus,
  trp,
  gon,
};

/** Get translation dictionary for a specific language code with fallback to English */
export function getLocaleDictionary(code: string): Record<string, string> {
  const dict = LOCALES[code as SupportedLanguage];
  if (dict) return dict;
  return LOCALES.en;
}
