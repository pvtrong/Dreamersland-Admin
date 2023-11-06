import defaultSettings from '@/settings'

const title = defaultSettings.title || 'Dreamers land'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
