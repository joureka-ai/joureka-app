import {BehaviorSubject, Subject} from 'rxjs';


const baseUrl = "api/v1";
const regionsSubject = new BehaviorSubject([{
  "id": "96e2d02f-bb17-4070-9369-52c84cf6e6c7",
  "start": 750,
  "end": 1020,
  "drag": false,
  "data": {
    "label": "Muster Themengebiet",
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dapibus pharetra libero porta tempor. Phasellus ut nunc ante. Vivamus pretium pharetra semper. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus fringilla tristique eros, eu hendrerit ipsum malesuada sit amet. Aliquam luctus ut nulla non finibus. Fusce ultrices pulvinar libero, non dictum lacus iaculis a. Maecenas at tincidunt nunc. Curabitur orci nunc, vulputate ornare fringilla ut, placerat tincidunt metus. Nunc vehicula ante vitae lectus feugiat, at malesuada tellus interdum. Nulla scelerisque dolor et enim commodo, eget porta orci finibus. Aliquam eget magna in libero imperdiet malesuada in eget neque. Morbi ullamcorper pulvinar ante ac aliquam. Donec vel interdum ex, ut ultricies orci."
  },
  "color": "rgb(30, 143, 158, 0.2)"
}]);
const pinsSubject = new BehaviorSubject([{
  "id": "c83bd7fd-76fe-409c-8efa-3baf3dfab8a8",
  "time": 1500,
  "position": "top",
  "color": "#ff990a",
  "label": "Muster Pin"
}]);

export const waveformAnnotationService = {
  getRegions: () => regionsSubject.asObservable(),
  addRegion: (region) => {
    let regions = regionsSubject.getValue();
    regions.push(region);
    regionsSubject.next(regions);
  },
  deleteRegion: (region) => {
    let regions = regionsSubject.getValue();
    regions = regions.filter(r => r.id != region.id);
    regionsSubject.next(regions);
  },
  getPins: () => pinsSubject.asObservable(),
  addPin: (pin) => {
    let pins = pinsSubject.getValue();
    pins.push(pin);
    pinsSubject.next(pins);
  },
  deletePin: (pin) => {
    let pins = pinsSubject.getValue();
    pins = pins.filter(p => p.id != pin.id);
    pinsSubject.next(pins);
  },
};
