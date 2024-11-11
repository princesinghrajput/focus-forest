import { StyleSheet, Platform } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderTopLeftRadius: wp('5%'),
    borderTopRightRadius: wp('5%'),
    overflow: 'hidden',
    paddingBottom: Platform.OS === 'ios' ? hp('3%') : hp('1%'),
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: hp('1.5%'),
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: hp('1%'),
  },
  tabContent: {
    alignItems: 'center',
    position: 'relative',
  },
  tabLabel: {
    fontSize: wp('3%'),
    marginTop: hp('0.5%'),
    fontWeight: '600',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: hp('-1.5%'),
    width: wp('1.5%'),
    height: wp('1.5%'),
    borderRadius: wp('0.75%'),
    backgroundColor: '#4CAF50',
  },
}); 