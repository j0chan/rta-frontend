declare namespace naver.maps {
    class Map {
      constructor(el: HTMLElement, options: any)
      setCenter(latlng: LatLng): void
      setZoom(level: number): void
    }
  
    class LatLng {
      constructor(lat: number, lng: number)
    }
  
    class Marker {
      constructor(options: any)
      setMap(map: Map | null): void
    }
  
    class InfoWindow {
      constructor(options: any)
      open(map: Map, marker: Marker): void
      close(): void
    }
  
    class Point {
      constructor(x: number, y: number)
    }
  
    const Event: {
      addListener(instance: any, eventName: string, listener: Function): void
    }

  }