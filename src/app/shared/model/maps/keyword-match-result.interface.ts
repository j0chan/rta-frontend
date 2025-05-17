import { ReadStore } from '../stores/read-store.interface'
import { NaverPlace } from './naver-place.interface'

export interface KeywordMatchResult {
  matchedStores: ReadStore[]
  externalPlaces: NaverPlace[]
}