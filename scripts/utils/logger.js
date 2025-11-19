// scripts/utils/logger.js
// 訓練資料 Logger 工具

const fs = require('fs').promises;
const path = require('path');

/**
 * 訓練資料 Logger 類別
 * 負責將收集到的訓練資料寫入檔案
 */
class TrainingDataLogger {
  constructor(config = {}) {
    this.baseDir = path.join(process.cwd(), config.baseDir || 'ai_logs');
    this.prettyPrint = config.prettyPrint !== false;
    this.sequenceDigits = config.sequenceDigits || 3;
    this.separator = config.separator || '-';
  }

  /**
   * 儲存訓練資料
   * @param {string} product - 產品名稱（cloudflare, f5, checkpoint）
   * @param {object} data - 訓練資料
   * @param {number} sequence - 序號
   * @returns {Promise<string>} 儲存的檔案路徑
   */
  async save(product, data, sequence) {
    try {
      // 1. 確保產品目錄存在
      const productDir = path.join(this.baseDir, product);
      await this.ensureDir(productDir);

      // 2. 生成檔案名稱
      const filename = this.generateFilename(sequence);
      const filepath = path.join(productDir, filename);

      // 3. 格式化資料
      const content = this.prettyPrint 
        ? JSON.stringify(data, null, 2) 
        : JSON.stringify(data);

      // 4. 寫入檔案
      await fs.writeFile(filepath, content, 'utf8');

      return filepath;
    } catch (error) {
      throw new Error(`儲存訓練資料失敗: ${error.message}`);
    }
  }

  /**
   * 生成檔案名稱
   * @param {number} sequence - 序號
   * @returns {string} 檔案名稱（例如：2025-11-18-001.json）
   */
  generateFilename(sequence) {
    const date = this.getCurrentDate();
    const seq = this.padSequence(sequence);
    return `${date}${this.separator}${seq}.json`;
  }

  /**
   * 獲取當前日期（YYYY-MM-DD 格式）
   * @returns {string} 日期字串
   */
  getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}${this.separator}${month}${this.separator}${day}`;
  }

  /**
   * 補齊序號位數
   * @param {number} sequence - 序號
   * @returns {string} 補齊後的序號（例如：001, 002, 010）
   */
  padSequence(sequence) {
    return String(sequence).padStart(this.sequenceDigits, '0');
  }

  /**
   * 確保目錄存在，不存在則建立
   * @param {string} dir - 目錄路徑
   */
  async ensureDir(dir) {
    try {
      await fs.access(dir);
    } catch {
      await fs.mkdir(dir, { recursive: true });
    }
  }

  /**
   * 獲取指定產品的已有檔案數量
   * @param {string} product - 產品名稱
   * @returns {Promise<number>} 檔案數量
   */
  async getFileCount(product) {
    try {
      const productDir = path.join(this.baseDir, product);
      const files = await fs.readdir(productDir);
      return files.filter(f => f.endsWith('.json')).length;
    } catch {
      return 0;
    }
  }

  /**
   * 列出指定產品的所有訓練資料檔案
   * @param {string} product - 產品名稱
   * @returns {Promise<string[]>} 檔案路徑陣列
   */
  async listFiles(product) {
    try {
      const productDir = path.join(this.baseDir, product);
      const files = await fs.readdir(productDir);
      return files
        .filter(f => f.endsWith('.json'))
        .map(f => path.join(productDir, f))
        .sort();
    } catch {
      return [];
    }
  }

  /**
   * 讀取指定的訓練資料檔案
   * @param {string} filepath - 檔案路徑
   * @returns {Promise<object>} 訓練資料物件
   */
  async read(filepath) {
    try {
      const content = await fs.readFile(filepath, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      throw new Error(`讀取訓練資料失敗: ${error.message}`);
    }
  }

  /**
   * 刪除指定的訓練資料檔案
   * @param {string} filepath - 檔案路徑
   */
  async delete(filepath) {
    try {
      await fs.unlink(filepath);
    } catch (error) {
      throw new Error(`刪除訓練資料失敗: ${error.message}`);
    }
  }

  /**
   * 清空指定產品的所有訓練資料
   * @param {string} product - 產品名稱
   * @returns {Promise<number>} 刪除的檔案數量
   */
  async clearProduct(product) {
    try {
      const files = await this.listFiles(product);
      await Promise.all(files.map(f => this.delete(f)));
      return files.length;
    } catch (error) {
      throw new Error(`清空訓練資料失敗: ${error.message}`);
    }
  }

  /**
   * 獲取統計資訊
   * @returns {Promise<object>} 統計資訊
   */
  async getStats() {
    const stats = {};
    const products = ['cloudflare', 'f5', 'checkpoint'];

    for (const product of products) {
      stats[product] = await this.getFileCount(product);
    }

    stats.total = Object.values(stats).reduce((sum, count) => sum + count, 0);
    return stats;
  }
}

// 匯出單例實例
const config = require('../config/collection-config');
const logger = new TrainingDataLogger(config.output);

module.exports = { 
  TrainingDataLogger,
  logger 
};


