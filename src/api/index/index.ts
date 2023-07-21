import request from '@/service';
import { PanelsData } from './type';

enum IndexAPI {
  statistics1Url = '/statistics1'
}

export function getStatistics1() {
  return request.get<PanelsData>({
    url: IndexAPI.statistics1Url
  });
}
