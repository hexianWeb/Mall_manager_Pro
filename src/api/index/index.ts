import request from '@/service';
import { PanelsData, btnItem } from './type';

enum IndexAPI {
  statistics1Url = '/statistics1',
  statistics2Url = '/statistics2',
  statistics3Url = '/statistics3'
}

export function getStatistics1() {
  return request.get<PanelsData>({
    url: IndexAPI.statistics1Url
  });
}

export function getStatistics2() {
  return request.get<any>({
    url: IndexAPI.statistics2Url
  });
}

export function getStatistics3(type: string) {
  return request.get<any>({
    url: IndexAPI.statistics3Url + `?type=${type}`
  });
}
