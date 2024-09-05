import { StyleSheet, Text, View,TextInput } from 'react-native'
import React from 'react'
import {theme} from '../constants/them';
import { wp ,hp} from '../helpers/common';

const Input = (props) => {
  return (
    
    <View style={[styles.container, props.containerStyle && props.containerStyle]}>
    
      {
        props.icon && props.icon
      }
      <TextInput
      style={{flex:1}}
      placeholderTextColor={theme.colors.textLight}
      ref={props.inputRef && props.inputRef}
      {...props}
      />
      
    </View>
  )
}

export default Input

const styles = StyleSheet.create({
    container:{
        flexDirection:'row',
        height:hp(7.2),
        alignItems:'center',
        justifyContent:'center',
        borderWidth:0.4,
        borderColor:theme.colors.text,
        borderRadius:theme.radius.xxl,
        borderCurve:'continuous',
        paddingHorizontal:18,
        gap:12,
    }
})