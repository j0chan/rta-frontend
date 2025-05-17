export interface NaverPlace {
  title: string // HTML 태그 포함되어 있을 수 있음 (예: <b>빙수집</b>)
  link: string
  category: string
  description: string
  telephone: string
  address: string
  roadAddress: string
  mapx: string // 위도 (string, 나중에 parseFloat 필요)
  mapy: string // 경도
}
