// import { useState } from 'react';
// import DeviceBrightness from 'react-native-device-brightness';

// // It will throw a exception when value less than 0 or more than 1.

// export default function Brightness() {
//   const [bright, getBright] = useState(0);

//   DeviceBrightness.setBrightnessLevel(bright);
//   DeviceBrightness.getBrightnessLevel()
//       .then((luminous) => {
//           // Get current brightness level
//           // 0 ~ 1
//           console.log(luminous);
//       });
//   // Android only
//   DeviceBrightness.getSystemBrightnessLevel()
//       .then((luminous) => {
//           // Get current brightness level
//           // 0 ~ 1
//           console.log(luminous);
//       });

//   return [bright, getBright];
// }
