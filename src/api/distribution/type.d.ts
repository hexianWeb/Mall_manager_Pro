interface UploadConfig {
  Bucket: string;
  http: string;
  ACCESS_KEY: string;
  SECRET_KEY: string;
}

interface Alipay {
  app_id: string;
  ali_public_key: string;
  private_key: string;
}

interface Wxpay {
  app_id: string;
  miniapp_id: string;
  secret: string;
  appid: string;
  mch_id: string;
  key: string;
  cert_client: string;
  cert_key: string;
}

export interface Data {
  id: number;
  open_reg: number;
  reg_method: string;
  password_min: number;
  password_encrypt: string;
  upload_method: string;
  upload_config: UploadConfig;
  api_safe: number;
  api_secret: string;
  close_order_minute: number;
  auto_received_day: number;
  after_sale_day: number;
  alipay: Alipay;
  wxpay: Wxpay;
  ship: string;
}

export interface DistributionConfig {
  distribution_open: 0 | 1;
  store_first_rebate: number;
  store_second_rebate: number;
  spread_banners: string[];
  is_self_brokerage: 0 | 1;
  settlement_days: number;
  brokerage_method: 'hand' | 'wx';
}

export interface Panel {
  color: string;
  label: string;
  value: number;
}

export interface StatisticsData {
  panels: Panel[];
}
