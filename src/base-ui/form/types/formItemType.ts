export interface IFormOption {
  label: string;
  type: string;
  field: string;
  placeHolder?: string;
  colLayout?: Object;
  defaultFieldValue?: string;
  otherOptions?: {
    options: any;
  };
}
