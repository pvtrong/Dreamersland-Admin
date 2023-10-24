import request from '@/utils/request'

export function createSeason(data) {
  return request({
    url: '/season',
    method: 'post',
    data
  })
}

export function getSeasons(params) {
  return request({
    url: '/season',
    method: 'get',
    params
  })
}