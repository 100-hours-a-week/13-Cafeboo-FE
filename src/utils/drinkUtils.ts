interface Drink {
    drinkId: number;
    name: string;
    type: string;
    temperature: string;
}

interface Cafe {
    cafeName: string;
    drinks: Drink[];
}

export type CafeList = Cafe[];

export function findDrinkInfo(cafeList: CafeList, drinkId: number) {
    for (const cafe of cafeList) {
      for (const drink of cafe.drinks) {
        if (drink.drinkId === drinkId) {
          return {
            cafeName: cafe.cafeName,
            name: drink.name,
            type: drink.type,
            temperature: drink.temperature,
          };
        }
      }
    }
    return null; 
}