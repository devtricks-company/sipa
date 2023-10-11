import { openDatabase } from "expo-sqlite"

export const db = openDatabase("saipa012.db")

// "build": {
//     "development": {
//       "developmentClient": true,
//       "distribution": "internal"
//     },
//     "preview": {
//       "distribution": "internal"
//     },
//     "production": {}
//   },
//   "submit": {
//     "production": {}
//   }


// {
//     "cli": {
//       "version": ">= 5.4.0"
//     },
//     "build": {
//       "development": {
//         "developmentClient": true,
//         "distribution": "internal"
//       },
//       "preview": {
//         "distribution": "internal",
  
//         "android" : {
//           "buildType": "apk"
//         }
//       },
//       "production": {}
//     },
//     "submit": {
//       "production": {}
//     }
//   }
  