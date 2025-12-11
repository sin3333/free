import { StyleSheet } from 'react-native';

export const modalStyles = StyleSheet.create({

  /*use in app/test/test1.tsx*/


  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    width: '80%',
    padding: 20,
    borderRadius: 16,
    backgroundColor: 'white',
    gap: 8,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: "center",
  },
})