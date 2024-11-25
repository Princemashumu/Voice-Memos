import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#1e1e1e',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      paddingTop: 40,
    },
    header: {
      color: 'white',
      fontSize: 38,
      fontWeight: 'bold',
    },
    subHeader: {
      color: 'white',
      fontSize: 18,
      marginTop: 10,
    },
    searchBar: {
     backgroundColor: '#333',
     color: 'white',
     padding: 10,
     borderRadius: 10,
     marginTop: 20,
     width: '90%',
   },
    recordButton: {
      marginTop: 20,
      backgroundColor: '#ff6347',
      borderRadius: 50,
      padding: 20,
      justifyContent: 'center',
      alignItems: 'center',
      bottom:20,
      left:'40%'
    },
    recordingsList: {
      marginTop: 20,
      width: '100%',
      paddingHorizontal: 20,
    },
    recordingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#333',
      marginBottom: 10,
      padding: 15,
      borderRadius: 10,
      justifyContent: 'space-between',
    },
    recordingDetails: {
      flex: 1,
      marginLeft: 10,
    },
    recordingName: {
      color: 'white',
      fontWeight: 'bold',
    },
    recordingTime: {
      color: 'lightgray',
    },
    playbackControls:
     {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    modalContainer:
     {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: 
    {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      width: '80%',
      alignItems: 'center',
    },
    modalIcon: {
      marginBottom: 20,
    },
  });
  