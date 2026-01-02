import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';

// Register English locale to support name-to-code conversion
countries.registerLocale(enLocale);

// Use built-in Intl.DisplayNames for Traditional Chinese output
const regionNames = new Intl.DisplayNames(['zh-TW'], { type: 'region' });

/**
 * 將國家名稱或代碼轉換為繁體中文
 * @param input 國家名稱 (英文) 或 ISO 代碼 (2位或3位)
 * @returns 繁體中文國家名稱，若找不到則回傳原輸入
 */
export function translateCountryToZhTW(input: string): string {
  if (!input) return input;

  try {
    let code: string | undefined;

    // 1. 嘗試直接作為 ISO 代碼 (2-3 chars)
    if (/^[a-zA-Z]{2,3}$/.test(input)) {
      code = input.toUpperCase();
    }
    // 2. 嘗試用 library 將英文名稱轉為 ISO 代碼
    else {
      code = countries.getAlpha2Code(input, 'en');
    }

    // 3. 如果有代碼，使用 Intl.DisplayNames 轉為繁體中文
    if (code) {
      return regionNames.of(code) || input;
    }
  } catch (e) {
    console.warn('Country translation failed:', e);
  }

  // 4. 若都失敗，回傳原值
  return input;
}

/**
 * 取得國家對應的emoji旗幟
 * @param input 國家名稱或代碼
 */
export function getCountryFlag(input: string): string {
  const code =
    countries.getAlpha2Code(input, 'en') || (input.length === 2 ? input : null);

  if (code && /^[A-Za-z]{2}$/.test(code)) {
    return code
      .toUpperCase()
      .replace(/./g, (char) =>
        String.fromCodePoint(char.charCodeAt(0) + 127397),
      );
  }
  return '';
}
