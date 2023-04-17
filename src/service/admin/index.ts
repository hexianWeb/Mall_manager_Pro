import request from '@/service';

enum CategoryAPI {
  CategoryList = 'https://eolink.o.apispace.com/456456/weather/v001/day?days=3&areacode=101010100'
}

export function getCategoryList() {
  return request.get({
    url: CategoryAPI.CategoryList,
    headers: {
      'X-APISpace-Token': 'ss1ay3fqetmhu0gtg4xus6pbsutuof1o',
      'Authorization-Type': 'apikey'
    }
  });
}
