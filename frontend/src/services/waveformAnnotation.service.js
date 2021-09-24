import { Subject } from 'rxjs';


const baseUrl = "api/v1";
const regionsSubject = new Subject();
const pinsSubject = new Subject();

export const waveformAnnotationService = {
  saveRegions: regions => regionsSubject.next({ regionArray: regions}),
  clearRegions: () => regionsSubject.next(),
  getRegions: () => regionsSubject.asObservable(),
  savePins: pins => pinsSubject.next({ pinArray: pins}),
  clearPins: () => pinsSubject.next(),
  getPins: () => pinsSubject.asObservable()
};
