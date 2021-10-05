import {BehaviorSubject, Subject} from 'rxjs';


const baseUrl = "api/v1";
const regionsSubject = new BehaviorSubject([]);
const pinsSubject = new BehaviorSubject([]);

export const waveformAnnotationService = {
  //saveRegions: regions => regionsSubject.next({ regionArray: regions}),
  //clearRegions: () => regionsSubject.next(),
  getRegions: () => regionsSubject.asObservable(),
  addRegion: (region) => {
    let regions = regionsSubject.getValue();
    regions.push(region);
    regionsSubject.next(regions);
  },
  //savePins: pins => pinsSubject.next({ pinArray: pins}),
  //clearPins: () => pinsSubject.next(),
  getPins: () => pinsSubject.asObservable(),
  addPin: (pin) => {
    let pins = pinsSubject.getValue();
    pins.push(pin);
    pinsSubject.next(pins);
  }
};
