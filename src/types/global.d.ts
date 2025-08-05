export {};

declare global {
  interface Window {
    kakao: {
      maps: {
        load: (callback: () => void) => void;
        LatLng: new (lat: number, lng: number) => any;
        Map: new (container: HTMLElement | null, options: any) => any;
        Marker: new (options: any) => any;
        services: {
          Places: new () => {
            keywordSearch: (
              keyword: string,
              callback: (result: any, status: any) => void,
              options?: any
            ) => void;
          };
        };
      };
    };
  }
}
