import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {theme,Colors} from '../constants/them'

const Loading = ({size="large",color=theme.colors.violetred}) => {
  return (
    <View style={{justifyContent:'center',alignItems:'center'}}>

      <ActivityIndicator size={size} color={color}/>
    </View>
  )
}

export default Loading

const styles = StyleSheet.create({})