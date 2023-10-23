import request from '@/utils/request'

export function createSeason() {
  return request({
    url: '/season',
    method: 'post'
  })
}

export function getSeasons(params) {
  return request({
    url: '/season',
    method: 'get',
    params
  })
}