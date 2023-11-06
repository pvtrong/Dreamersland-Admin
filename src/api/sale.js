import request from '@/utils/request'

export function getSales(params) {
  return request({
    url: '/sales/search',
    method: 'get',
    params
  })
}

export function deleteSale(id) {
  return request({
    url: '/sales/' + id,
    method: 'delete',
  })
}

export function createSale(data) {
  return request({
    url: '/sales',
    method: 'post',
    data
  })
}

export function updateSale(data) {
  return request({
    url: '/sales',
    method: 'put',
    data
  })
}