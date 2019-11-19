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
  magnetometer,
  barometer,
  setUpdateIntervalForType,
  SensorTypes
} from "react-native-sensors";

export default class MetaImagem extends Component {

  constructor(props) {
    super(props);

    this.state = {
      timer: null,
      isRecording: false,
      isWaitingData: false,
      lastSensor: null,

      // array data
      accelerometer: [],
      gyroscope: [],
      magnetometer: [],
      barometer: [],
    }

    this.timerFn = null;
    this.timerInterval = null;

    this.accelerometerSubscription = null;
    this.gyroscopeSubscription = null;
    this.magnetometerSubscription = null;
    this.barometerSubscription = null;

    this.state = Object.assign(this.state, this.getInitialStates());
  }

  getInitialStates() {
    return {
      current: {
        accelerometer: { x: 0, y: 0, z: 0, timestamp: 0 },
        gyroscope: { x: 0, y: 0, z: 0, timestamp: 0 },
        magnetometer: { x: 0, y: 0, z: 0, timestamp: 0 },
        barometer: 0
      },
      accelerometer: [],
      gyroscope: [],
      magnetometer: [],
      barometer: [],
    }
  }

  startSensors() {
    this.subscribeAccelerometer();
    this.subscribeGyroscope();
    this.subscribeMagnetometer();
    this.subscribeBarometer();

    this.setState({ isRecording: true, isWaitingData: true });

    const t = this
    this.timerFn = setTimeout(function () {
      t.stopSensors();
    }, 6e3);
  }

  stopSensors() {
    if (this.timerFn) clearTimeout(this.timerFn);

    if (this.accelerometerSubscription) this.accelerometerSubscription.unsubscribe();
    if (this.gyroscopeSubscription) this.gyroscopeSubscription.unsubscribe();
    if (this.magnetometerSubscription) this.magnetometerSubscription.unsubscribe();
    if (this.barometerSubscription) this.barometerSubscription.unsubscribe();

    this.setState({ isRecording: false });
    this.sendData();
  }

  sendData() {
    console.log('send', this.state.accelerometer);
  }

  subscribeAccelerometer() {
    this.setState({ accelerometer: this.getInitialStates().accelerometer });
    this.accelerometerSubscription = accelerometer.subscribe((data) => {
      this.recordData({ store: 'accelerometer', data: data });
    });
  }

  subscribeGyroscope() {
    this.setState({ gyroscope: this.getInitialStates().gyroscope });
    this.gyroscopeSubscription = gyroscope.subscribe((data) => {
      this.recordData({ store: 'gyroscope', data: data });
    });
  }

  subscribeMagnetometer() {
    this.setState({ gyroscope: this.getInitialStates().magnetometer });
    this.magnetometerSubscription = magnetometer.subscribe((data) => {
      this.recordData({ store: 'magnetometer', data: data });
    });
  }

  subscribeBarometer() {
    this.setState({ barometer: this.getInitialStates().barometer });
    this.barometerSubscription = barometer.subscribe((data) => {
      this.recordData({ store: 'barometer', data: data });
    });
  }

  recordData(target) {

    if (this.state.isWaitingData && target.store != this.state.lastSensor) {

      this.setState({ isWaitingData: false, lastSensor: target.store });

      let current = { ...this.state.current };
      current[target.store] = target.data;

      let data = [...this.state[target.store], target.data];
      this.setState({ [target.store]: data, current: current });

      const t = this;
      setTimeout(function () {
        t.setState({ isWaitingData: true });
      }, 330);
    }
  }

  render() {

    let btn = (!this.state.isRecording ?
      <Button
        title="Começar ?!"
        onPress={() => this.startSensors()} />
      :
      <Button
        title="Parar ?"
        onPress={() => this.startSensors()} />
    )

    return (
      <>
        <ScrollView>
          <View>
            {btn}
          </View>
          <View>
            <Text>Accelerometer: {JSON.stringify(this.state.current.accelerometer)}</Text>
          </View>
          <View>
            <Text>gyroscope: {JSON.stringify(this.state.current.gyroscope)}</Text>
          </View>
          <View>
            <Text>Magnetometer: {JSON.stringify(this.state.current.magnetometer)}</Text>
          </View>
          <View>
            <Text>Barometer: {JSON.stringify(this.state.current.barometer)}</Text>
          </View>
        </ScrollView>
      </>
    )

  }

}