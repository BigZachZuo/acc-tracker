
import { Track, Car } from './types';

export const TRACKS: Track[] = [
  { 
    id: 'monza', 
    name: 'Monza Circuit', 
    country: 'Italy', 
    length: '5.793 km',
    imageUrl: '/assets/tracks/monza.svg'
  },
  { 
    id: 'spa', 
    name: 'Spa-Francorchamps', 
    country: 'Belgium', 
    length: '7.004 km',
    imageUrl: '/assets/tracks/spa.svg'
  },
  { 
    id: 'nurburgring', 
    name: 'Nürburgring GP', 
    country: 'Germany', 
    length: '5.148 km',
    imageUrl: '/assets/tracks/nurburgring.svg'
  },
  { 
    id: 'silverstone', 
    name: 'Silverstone', 
    country: 'UK', 
    length: '5.891 km',
    imageUrl: '/assets/tracks/silverstone.svg'
  },
  { 
    id: 'brands_hatch', 
    name: 'Brands Hatch', 
    country: 'UK', 
    length: '3.916 km',
    imageUrl: '/assets/tracks/brands_hatch.svg'
  },
  { 
    id: 'zandvoort', 
    name: 'Zandvoort', 
    country: 'Netherlands', 
    length: '4.259 km',
    imageUrl: '/assets/tracks/zandvoort.svg'
  },
  { 
    id: 'misano', 
    name: 'Misano World Circuit', 
    country: 'Italy', 
    length: '4.226 km',
    imageUrl: '/assets/tracks/misano.svg'
  },
  { 
    id: 'paul_ricard', 
    name: 'Paul Ricard', 
    country: 'France', 
    length: '5.771 km',
    imageUrl: '/assets/tracks/paul_ricard.svg'
  },
  { 
    id: 'barcelona', 
    name: 'Circuit de Barcelona-Catalunya', 
    country: 'Spain', 
    length: '4.655 km',
    imageUrl: '/assets/tracks/barcelona.svg'
  },
  { 
    id: 'hungaroring', 
    name: 'Hungaroring', 
    country: 'Hungary', 
    length: '4.381 km',
    imageUrl: '/assets/tracks/hungaroring.svg'
  },
  { 
    id: 'imola', 
    name: 'Imola', 
    country: 'Italy', 
    length: '4.909 km',
    imageUrl: '/assets/tracks/imola.svg'
  },
  { 
    id: 'mount_panorama', 
    name: 'Mount Panorama (Bathurst)', 
    country: 'Australia', 
    length: '6.213 km',
    imageUrl: '/assets/tracks/mount_panorama.svg'
  },
  { 
    id: 'suzuka', 
    name: 'Suzuka Circuit', 
    country: 'Japan', 
    length: '5.807 km',
    imageUrl: '/assets/tracks/suzuka.svg'
  },
  { 
    id: 'kyalami', 
    name: 'Kyalami Grand Prix Circuit', 
    country: 'South Africa', 
    length: '4.529 km',
    imageUrl: '/assets/tracks/kyalami.svg'
  },
  { 
    id: 'laguna_seca', 
    name: 'Laguna Seca', 
    country: 'USA', 
    length: '3.602 km',
    imageUrl: '/assets/tracks/laguna_seca.svg'
  },
  { 
    id: 'cota', 
    name: 'Circuit of the Americas', 
    country: 'USA', 
    length: '5.513 km',
    imageUrl: '/assets/tracks/cota.svg'
  },
  { 
    id: 'watkins_glen', 
    name: 'Watkins Glen', 
    country: 'USA', 
    length: '5.552 km',
    imageUrl: '/assets/tracks/watkins_glen.svg'
  },
  { 
    id: 'indianapolis', 
    name: 'Indianapolis', 
    country: 'USA', 
    length: '3.925 km',
    imageUrl: '/assets/tracks/indianapolis.svg'
  },
  { 
    id: 'oulton_park', 
    name: 'Oulton Park', 
    country: 'UK', 
    length: '4.307 km',
    imageUrl: '/assets/tracks/oulton_park.svg'
  },
  { 
    id: 'snetterton', 
    name: 'Snetterton', 
    country: 'UK', 
    length: '4.779 km',
    imageUrl: '/assets/tracks/snetterton.svg'
  },
  { 
    id: 'donington', 
    name: 'Donington Park', 
    country: 'UK', 
    length: '4.020 km',
    imageUrl: '/assets/tracks/donington.svg'
  },
  { 
    id: 'valencia', 
    name: 'Valencia', 
    country: 'Spain', 
    length: '4.005 km',
    imageUrl: '/assets/tracks/valencia.svg'
  },
  { 
    id: 'red_bull_ring', 
    name: 'Red Bull Ring', 
    country: 'Austria', 
    length: '4.318 km',
    imageUrl: '/assets/tracks/red_bull_ring.svg'
  },
];

export const CARS: Car[] = [
  // GT3
  { id: 'ferrari_296_gt3', name: 'Ferrari 296 GT3', class: 'GT3', brand: 'Ferrari' },
  { id: 'porsche_992_gt3r', name: 'Porsche 911 (992) GT3 R', class: 'GT3', brand: 'Porsche' },
  { id: 'lamborghini_huracan_evo2', name: 'Lamborghini Huracán GT3 EVO2', class: 'GT3', brand: 'Lamborghini' },
  { id: 'amg_gt3_evo', name: 'Mercedes-AMG GT3 Evo', class: 'GT3', brand: 'Mercedes' },
  { id: 'bmw_m4_gt3', name: 'BMW M4 GT3', class: 'GT3', brand: 'BMW' },
  { id: 'audi_r8_lms_evo2', name: 'Audi R8 LMS Evo II', class: 'GT3', brand: 'Audi' },
  { id: 'mclaren_720s_evo', name: 'McLaren 720S GT3 Evo', class: 'GT3', brand: 'McLaren' },
  { id: 'aston_martin_vantage_amr_gt3', name: 'Aston Martin V8 Vantage GT3', class: 'GT3', brand: 'Aston Martin' },
  { id: 'honda_nsx_gt3_evo', name: 'Honda NSX GT3 Evo', class: 'GT3', brand: 'Honda' },
  { id: 'bentley_continental_gt3_2018', name: 'Bentley Continental GT3 2018', class: 'GT3', brand: 'Bentley' },
  { id: 'lexus_rc_f_gt3', name: 'Lexus RC F GT3', class: 'GT3', brand: 'Lexus' },
  { id: 'nissan_gt_r_nismo_gt3_2018', name: 'Nissan GT-R Nismo GT3 2018', class: 'GT3', brand: 'Nissan' },
  { id: 'ford_mustang_gt3', name: 'Ford Mustang GT3', class: 'GT3', brand: 'Ford' },
  
  // GT4
  { id: 'alpine_a110_gt4', name: 'Alpine A110 GT4', class: 'GT4', brand: 'Alpine' },
  { id: 'aston_martin_vantage_gt4', name: 'Aston Martin Vantage GT4', class: 'GT4', brand: 'Aston Martin' },
  { id: 'audi_r8_lms_gt4', name: 'Audi R8 LMS GT4', class: 'GT4', brand: 'Audi' },
  { id: 'bmw_m4_gt4', name: 'BMW M4 GT4', class: 'GT4', brand: 'BMW' },
  { id: 'chevrolet_camaro_gt4r', name: 'Chevrolet Camaro GT4.R', class: 'GT4', brand: 'Chevrolet' },
  { id: 'ginetta_g55_gt4', name: 'Ginetta G55 GT4', class: 'GT4', brand: 'Ginetta' },
  { id: 'ktm_xbow_gt4', name: 'KTM X-Bow GT4', class: 'GT4', brand: 'KTM' },
  { id: 'maserati_granturismo_mc_gt4', name: 'Maserati GranTurismo MC GT4', class: 'GT4', brand: 'Maserati' },
  { id: 'mclaren_570s_gt4', name: 'McLaren 570S GT4', class: 'GT4', brand: 'McLaren' },
  { id: 'mercedes_amg_gt4', name: 'Mercedes-AMG GT4', class: 'GT4', brand: 'Mercedes' },
  { id: 'porsche_718_cayman_gt4_clubsport', name: 'Porsche 718 Cayman GT4 Clubsport', class: 'GT4', brand: 'Porsche' },
  { id: 'toyota_gr_supra_gt4', name: 'Toyota GR Supra GT4', class: 'GT4', brand: 'Toyota' },

  // Single Make
  { id: 'porsche_992_gt3_cup', name: 'Porsche 911 (992) GT3 Cup', class: 'CUP', brand: 'Porsche' },
  { id: 'ferrari_488_challenge_evo', name: 'Ferrari 488 Challenge Evo', class: 'CUP', brand: 'Ferrari' },
  { id: 'lamborghini_huracan_super_trofeo_evo2', name: 'Lamborghini Huracán Super Trofeo EVO2', class: 'CUP', brand: 'Lamborghini' },
  { id: 'bmw_m2_cs_racing', name: 'BMW M2 CS Racing', class: 'TCX', brand: 'BMW' },
];
