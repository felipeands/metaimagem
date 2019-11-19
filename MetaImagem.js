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

import FirebaseService from './firebaseService.js';
import { firebaseDatabase } from './firebaseUtils.js'

export default class MetaImagem extends Component {

  constructor(props) {
    super(props);

    this.state = {
      countDown: 0,
      timerMs: 6000,
      isRecording: false,
      lastSensor: null,
      timerInterval: 1000,

      // array data
      accelerometer: [],
      gyroscope: [],
      magnetometer: [],
      barometer: [],
    }

    this.timerFn = null;
    this.timerCountdown = null

    this.accelerometerSubscription = null;
    this.gyroscopeSubscription = null;
    this.magnetometerSubscription = null;
    this.barometerSubscription = null;

    this.state = Object.assign(this.state, this.getInitialStates());
  }

  componentDidMount() {
    FirebaseService.getDataList('history', (res) => {
      console.log('list', res);
    });
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

    this.setState({ isRecording: true, countDown: (this.state.timerMs / this.state.timerInterval) });

    const t = this;
    this.timerFn = setTimeout(function () {
      t.stopSensors();
    }, this.state.timerMs);

    this.timerCountdown = setInterval(function () {
      t.setState({ countDown: t.state.countDown - 1 });
      if (t.state.countDown <= 0) { clearInterval(t.timerCountdown); }
    }, this.state.timerInterval);
  }

  stopSensors() {
    if (this.timerFn) clearTimeout(this.timerFn);
    if (this.timerCountdown) clearInterval(this.timerCountdown);

    if (this.accelerometerSubscription) this.accelerometerSubscription.unsubscribe();
    if (this.gyroscopeSubscription) this.gyroscopeSubscription.unsubscribe();
    if (this.magnetometerSubscription) this.magnetometerSubscription.unsubscribe();
    if (this.barometerSubscription) this.barometerSubscription.unsubscribe();

    this.setState({ isRecording: false });
    this.sendData();

    this.timerFn
  }

  sendData() {

    const objData = {
      accelerometer: this.state.accelerometer,
      gyroscope: this.state.gyroscope,
      magnetometer: this.state.magnetometer,
      barometer: this.state.barometer
    }

    console.log('send', objData);
    
    const newId = firebaseDatabase.ref().child('history').push(objData);
    console.log('id', newId);
  }

  subscribeAccelerometer() {
    setUpdateIntervalForType(SensorTypes.accelerometer, this.state.timerInterval);
    this.setState({ accelerometer: this.getInitialStates().accelerometer });
    this.accelerometerSubscription = accelerometer.subscribe((data) => {
      this.recordData({ store: 'accelerometer', data: data });
    });
  }

  subscribeGyroscope() {
    setUpdateIntervalForType(SensorTypes.gyroscope, this.state.timerInterval);
    this.setState({ gyroscope: this.getInitialStates().gyroscope });
    this.gyroscopeSubscription = gyroscope.subscribe((data) => {
      this.recordData({ store: 'gyroscope', data: data });
    });
  }

  subscribeMagnetometer() {
    setUpdateIntervalForType(SensorTypes.magnetometer, this.state.timerInterval);
    this.setState({ gyroscope: this.getInitialStates().magnetometer });
    this.magnetometerSubscription = magnetometer.subscribe((data) => {
      this.recordData({ store: 'magnetometer', data: data });
    });
  }

  subscribeBarometer() {
    setUpdateIntervalForType(SensorTypes.barometer, this.state.timerInterval);
    this.setState({ barometer: this.getInitialStates().barometer });
    this.barometerSubscription = barometer.subscribe((data) => {
      this.recordData({ store: 'barometer', data: data });
    });
  }

  recordData(target) {

    if (target.store != this.state.lastSensor) {

      let current = { ...this.state.current };
      current[target.store] = target.data;

      console.log('last', target.store);

      let data = [...this.state[target.store], target.data];
      this.setState({ [target.store]: data, current: current, lastSensor: target.store });
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
        onPress={() => this.stopSensors()} />
    )

    return (
      <>
        <ScrollView>
          <View>
            <Text>Tempo: {this.state.countDown}</Text>
          </View>
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