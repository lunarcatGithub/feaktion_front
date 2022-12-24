import {
  Permission,
  PermissionsAndroid,
  PermissionStatus,
  Platform,
} from 'react-native'
import {
  PERMISSIONS,
  RESULTS,
  request,
  check,
  requestMultiple,
} from 'react-native-permissions'

export default function usePermission(): () => Promise<void> {
  const Permiss = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Permissions for record audio',
            message: 'Give permission to your device to record audio',
            buttonPositive: 'ok',
          }
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('permission granted')
        } else {
          console.log('permission denied')
          return
        }
      } catch (err) {
        console.warn(err)
        return
      }
    } else {
      const permissArr = [
        PERMISSIONS.IOS.MICROPHONE,
        PERMISSIONS.IOS.PHOTO_LIBRARY,
        PERMISSIONS.IOS.SPEECH_RECOGNITION,
      ]
      requestMultiple(permissArr).then(statuses => {
        console.log('PHOTO_LIBRARY', statuses[PERMISSIONS.IOS.PHOTO_LIBRARY])
        console.log('MICROPHONE', statuses[PERMISSIONS.IOS.MICROPHONE])
        console.log(
          'SPEECH_RECOGNITION',
          statuses[PERMISSIONS.IOS.SPEECH_RECOGNITION]
        )
      })
      // await IOSpermission()
      // check(PERMISSIONS.IOS.LOCATION_ALWAYS).then(result => {
      //   switch (result) {
      //     case RESULTS.UNAVAILABLE:
      //       console.log(
      //         'This feature is not available (on this device / in this context)'
      //       )
      //       break
      //     case RESULTS.DENIED:
      //       console.log(
      //         'The permission has not been requested / is denied but requestable'
      //       )
      //       break
      //     case RESULTS.LIMITED:
      //       console.log('The permission is limited: some actions are possible')
      //       break
      //     case RESULTS.GRANTED:
      //       console.log('The permission is granted')
      //       break
      //     case RESULTS.BLOCKED:
      //       console.log('The permission is denied and not requestable anymore')
      //       break
      //   }
      // })
    }
  }
  return Permiss
}

const IOSpermission = async () => {
  try {
    const mic = await request(PERMISSIONS.IOS.MICROPHONE)
    const image = await request(PERMISSIONS.IOS.PHOTO_LIBRARY)
    const voice = await request(PERMISSIONS.IOS.SPEECH_RECOGNITION)
    if (mic === RESULTS.GRANTED) {
      console.log('mic ok')
    }
    if (image === RESULTS.GRANTED) {
      console.log('image ok')
    }
    if (voice === RESULTS.GRANTED) {
      console.log('voice ok')
    }
  } catch (e) {
    console.error(e)
  }
}
