import request from '@/utils/request'

export function getSales(params) {
  return request({
    url: '/sales/search',
    method: 'get',
    params
  })
}