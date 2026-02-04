/**
 * 國家座標映射表
 * 包含常見國家的經緯度和在地圖上的相對位置
 */

export interface CountryCoordinate {
    name: string
    lng: number
    lat: number
    x: string  // 在地圖上的 X 位置百分比
    y: string  // 在地圖上的 Y 位置百分比
  }
  
  export const COUNTRY_COORDINATES: Record<string, CountryCoordinate> = {
    // 亞洲
    "China": { name: "中國", lng: 104.1954, lat: 35.8617, x: "75%", y: "35%" },
    "中國": { name: "中國", lng: 104.1954, lat: 35.8617, x: "75%", y: "35%" },
    "Japan": { name: "日本", lng: 138.2529, lat: 36.2048, x: "80%", y: "35%" },
    "日本": { name: "日本", lng: 138.2529, lat: 36.2048, x: "80%", y: "35%" },
    "South Korea": { name: "韓國", lng: 127.7669, lat: 35.9078, x: "78%", y: "37%" },
    "韓國": { name: "韓國", lng: 127.7669, lat: 35.9078, x: "78%", y: "37%" },
    "India": { name: "印度", lng: 78.9629, lat: 20.5937, x: "70%", y: "45%" },
    "印度": { name: "印度", lng: 78.9629, lat: 20.5937, x: "70%", y: "45%" },
    "Vietnam": { name: "越南", lng: 108.2772, lat: 14.0583, x: "72%", y: "48%" },
    "越南": { name: "越南", lng: 108.2772, lat: 14.0583, x: "72%", y: "48%" },
    "Thailand": { name: "泰國", lng: 100.9925, lat: 15.8700, x: "71%", y: "48%" },
    "泰國": { name: "泰國", lng: 100.9925, lat: 15.8700, x: "71%", y: "48%" },
    "Singapore": { name: "新加坡", lng: 103.8198, lat: 1.3521, x: "72%", y: "52%" },
    "新加坡": { name: "新加坡", lng: 103.8198, lat: 1.3521, x: "72%", y: "52%" },
    "Indonesia": { name: "印尼", lng: 113.9213, lat: -0.7893, x: "75%", y: "53%" },
    "印尼": { name: "印尼", lng: 113.9213, lat: -0.7893, x: "75%", y: "53%" },
    "Taiwan": { name: "台灣", lng: 120.9605, lat: 23.6978, x: "77%", y: "43%" },
    "台灣": { name: "台灣", lng: 120.9605, lat: 23.6978, x: "77%", y: "43%" },
    "Taiwan, Province of China": { name: "台灣", lng: 120.9605, lat: 23.6978, x: "77%", y: "43%" },
    "Hong Kong": { name: "香港", lng: 114.1694, lat: 22.3193, x: "76%", y: "44%" },
    "香港": { name: "香港", lng: 114.1694, lat: 22.3193, x: "76%", y: "44%" },
    "Macao": { name: "澳門", lng: 113.5439, lat: 22.1987, x: "76%", y: "44%" },
    "澳門": { name: "澳門", lng: 113.5439, lat: 22.1987, x: "76%", y: "44%" },
    "Malaysia": { name: "馬來西亞", lng: 101.9758, lat: 4.2105, x: "73%", y: "50%" },
    "馬來西亞": { name: "馬來西亞", lng: 101.9758, lat: 4.2105, x: "73%", y: "50%" },
    "Philippines": { name: "菲律賓", lng: 121.7740, lat: 12.8797, x: "76%", y: "49%" },
    "菲律賓": { name: "菲律賓", lng: 121.7740, lat: 12.8797, x: "76%", y: "49%" },
    
    // 欧洲
    "Russia": { name: "俄羅斯", lng: 105.3188, lat: 61.524, x: "65%", y: "28%" },
    "俄羅斯": { name: "俄羅斯", lng: 105.3188, lat: 61.524, x: "65%", y: "28%" },
    "Germany": { name: "德國", lng: 10.4515, lat: 51.1657, x: "52%", y: "30%" },
    "德國": { name: "德國", lng: 10.4515, lat: 51.1657, x: "52%", y: "30%" },
    "France": { name: "法國", lng: 2.2137, lat: 46.2276, x: "50%", y: "32%" },
    "法國": { name: "法國", lng: 2.2137, lat: 46.2276, x: "50%", y: "32%" },
    "United Kingdom": { name: "英國", lng: -3.4360, lat: 55.3781, x: "48%", y: "30%" },
    "英國": { name: "英國", lng: -3.4360, lat: 55.3781, x: "48%", y: "30%" },
    "Italy": { name: "義大利", lng: 12.5674, lat: 41.8719, x: "52%", y: "34%" },
    "義大利": { name: "義大利", lng: 12.5674, lat: 41.8719, x: "52%", y: "34%" },
    "Spain": { name: "西班牙", lng: -3.7492, lat: 40.4637, x: "48%", y: "34%" },
    "西班牙": { name: "西班牙", lng: -3.7492, lat: 40.4637, x: "48%", y: "34%" },
    
    // 北美
    "United States": { name: "美國", lng: -95.7129, lat: 37.0902, x: "20%", y: "35%" },
    "美國": { name: "美國", lng: -95.7129, lat: 37.0902, x: "20%", y: "35%" },
    "Canada": { name: "加拿大", lng: -106.3468, lat: 56.1304, x: "18%", y: "28%" },
    "加拿大": { name: "加拿大", lng: -106.3468, lat: 56.1304, x: "18%", y: "28%" },
    "Mexico": { name: "墨西哥", lng: -102.5528, lat: 23.6345, x: "18%", y: "42%" },
    "墨西哥": { name: "墨西哥", lng: -102.5528, lat: 23.6345, x: "18%", y: "42%" },
    
    // 南美
    "Brazil": { name: "巴西", lng: -47.9292, lat: -15.7801, x: "28%", y: "62%" },
    "巴西": { name: "巴西", lng: -47.9292, lat: -15.7801, x: "28%", y: "62%" },
    "Argentina": { name: "阿根廷", lng: -63.6167, lat: -38.4161, x: "30%", y: "68%" },
    "阿根廷": { name: "阿根廷", lng: -63.6167, lat: -38.4161, x: "30%", y: "68%" },
    
    // 非洲
    "South Africa": { name: "南非", lng: 22.9375, lat: -30.5595, x: "55%", y: "68%" },
    "南非": { name: "南非", lng: 22.9375, lat: -30.5595, x: "55%", y: "68%" },
    "Egypt": { name: "埃及", lng: 30.8025, lat: 26.8206, x: "55%", y: "40%" },
    "埃及": { name: "埃及", lng: 30.8025, lat: 26.8206, x: "55%", y: "40%" },
    "Nigeria": { name: "尼日利亞", lng: 8.6753, lat: 9.0820, x: "50%", y: "48%" },
    "尼日利亞": { name: "尼日利亞", lng: 8.6753, lat: 9.0820, x: "50%", y: "48%" },
    
    // 大洋洲
    "Australia": { name: "澳大利亞", lng: 133.7751, lat: -25.2744, x: "82%", y: "66%" },
    "澳大利亞": { name: "澳大利亞", lng: 133.7751, lat: -25.2744, x: "82%", y: "66%" },
    "New Zealand": { name: "紐西蘭", lng: 174.8860, lat: -40.9006, x: "88%", y: "70%" },
    "紐西蘭": { name: "紐西蘭", lng: 174.8860, lat: -40.9006, x: "88%", y: "70%" },
    
    // 中东
    "Turkey": { name: "土耳其", lng: 35.2433, lat: 38.9637, x: "56%", y: "35%" },
    "土耳其": { name: "土耳其", lng: 35.2433, lat: 38.9637, x: "56%", y: "35%" },
    "Saudi Arabia": { name: "沙烏地阿拉伯", lng: 45.0792, lat: 23.8859, x: "60%", y: "42%" },
    "沙烏地阿拉伯": { name: "沙烏地阿拉伯", lng: 45.0792, lat: 23.8859, x: "60%", y: "42%" },
    "Iran": { name: "伊朗", lng: 53.6880, lat: 32.4279, x: "62%", y: "38%" },
    "伊朗": { name: "伊朗", lng: 53.6880, lat: 32.4279, x: "62%", y: "38%" },
  }
  
  /**
   * 根據國家名稱獲取座標
   * 支持中英文國家名
   */
  export function getCountryCoordinate(countryName: string): CountryCoordinate | null {
    const coord = COUNTRY_COORDINATES[countryName]
    if (coord) return coord
    
    // 嘗試模糊匹配
    const lowerName = countryName.toLowerCase()
    const found = Object.entries(COUNTRY_COORDINATES).find(([key]) => 
      key.toLowerCase().includes(lowerName) || lowerName.includes(key.toLowerCase())
    )
    
    return found ? found[1] : null
  }
  
  /**
   * 如果找不到座標，返回預設座標（地圖中心）
   */
  export function getCountryCoordinateOrDefault(countryName: string): CountryCoordinate {
    return getCountryCoordinate(countryName) || {
      name: countryName,
      lng: 0,
      lat: 0,
      x: "50%",
      y: "50%"  // 預設在地圖中心
    }
  }
  
  