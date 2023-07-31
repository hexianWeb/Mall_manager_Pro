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
}

export interface RuleList {
  list: Rule[];
}
