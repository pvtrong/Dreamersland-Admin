import request from '@/utils/request'

export function createSeason() {
  return request({
    url: '/season',
    method: 'post'
  })
}

export function getSeasons() {
  return request({
    url: '/season',
    method: 'get',
  })
}