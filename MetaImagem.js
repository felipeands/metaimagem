/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {
  accelerometer,
  gyroscope,
  magenetometer,
  barometer,
  setUpdateIntervalForType,
  SensorTypes
} from "react-native-sensors";

export default class MetaImagem extends Component {

  constructor(props) {
    super(props);

    this.state = {
      timer: null,
      timerFn: null,
      recording: false,

      // current data
      curAccelerometer: { x: 0, y: 0, z: 0, timestamp: 0 },
      curGyroscope: { x: 0, y: 0, z: 0, timestamp: 0 },
      curMagnetometer: { x: 0, y: 0, z: 0, timestamp: 0 },
      curBarometer: 0,

      // temp recorded data
      accelerometers: [],
      gyroscopes: [],
      magenetometers: [],
      barometers: [],
    }

    this.accelerometerSubscription = null;
    this.gyroscopeSubscription = null;
    this.magenetometerSubscription = null;
    this.barometerSubscription = null;
  }

  startSensors() {
    this.subscribeAccelerometer();
    this.subscribeGyroscope();
    this.subscribeMagnetometer();
    this.subscribeBarometer();
    this.setState({ recording: true });
  }

  subscribeAccelerometer() {
    this.accelerometerSubscription = accelerometer.subscribe((data) => {
      this.setState({ curAccelerometer: data });
      // let res = `${x}, ${y}, ${z}, ${timestamp}`;
      console.log(data);
      this.accelerometerSubscription.unsubscribe();
    });
  }

  subscribeGyroscope() {

  }

  subscribeMagnetometer() {

  }

  subscribeBarometer() {

  }

  verifyTimer() {

  }

  storeData() { }

  render() {

    return (
      <>
        <ScrollView>
          <View>
            <Button
              title="Começar ?"
              onPress={() => this.startSensors()} />
          </View>
          <View>
            <Text>Accelerometer: {JSON.stringify(this.state.curAccelerometer)}</Text>
          </View>
          <View>
            <Text>gyroscope: {JSON.stringify(this.state.curGyroscope)}</Text>
          </View>
          <View>
            <Text>Magnetometer: {JSON.stringify(this.state.curMagnetometer)}</Text>
          </View>
          <View>
            <Text>Barometer: {JSON.stringify(this.state.curBarometer)}</Text>
          </View>
        </ScrollView>
      </>
    )

  }

}

// const App = () => {

//   const [accelerometer, setAccelerometer] = useState(0);

//   return (
//     <>
//       <StatusBar barStyle="dark-content" />
//       <SafeAreaView>
//         <ScrollView
//           contentInsetAdjustmentBehavior="automatic"
//           style={styles.scrollView}>
//           <View style={styles.body}>
//             <View style={styles.sectionContainer}>
//               <Button
//                 title="Começar ?"
//                 onPress={() => startSensors()} />
//               <Text style={styles.sectionTitle}>Step One</Text>
//               <Text>
//                 {{ this.state.}}
//               </Text>
//             </View>
//             <LearnMoreLinks />
//           </View>
//         </ScrollView>
//       </SafeAreaView>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   scrollView: {
//     backgroundColor: Colors.lighter,
//   },
//   engine: {
//     position: 'absolute',
//     right: 0,
//   },
//   body: {
//     backgroundColor: Colors.white,
//   },
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//     color: Colors.black,
//   },
//   sectionDescription: {
//     marginTop: 8,
//     fontSize: 18,
//     fontWeight: '400',
//     color: Colors.dark,
//   },
//   highlight: {
//     fontWeight: '700',
//   },
//   footer: {
//     color: Colors.dark,
//     fontSize: 12,
//     fontWeight: '600',
//     padding: 4,
//     paddingRight: 12,
//     textAlign: 'right',
//   },
// });

// function startSensors() {
//   const subscription = accelerometer.subscribe(({ x, y, z, timestamp }) => {
//     let res = `${x}, ${y}, ${z}, ${timestamp}`;
//     alert(res);
//     subscription.unsubscribe();
//   });
// }

// export default App;
