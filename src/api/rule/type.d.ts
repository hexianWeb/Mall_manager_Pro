export interface Rule extends NewRule {
  id: number;
}

export interface NewRule {
  rule_id: number;
  menu: number;
  name: string;
  condition: string;
  method: string;
  status: number;
  order: number;
  icon: string;
  frontpath: string;
  rules?: {
    id: number;
    pivot: {
      id: number;
      role_id: number;
      rule_id: number;
    };
  }[];
}

export interface RuleList {
  list: Rule[];
}
