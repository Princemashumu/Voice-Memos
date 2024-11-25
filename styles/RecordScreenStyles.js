import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',  // Set background to white
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingTop: 40,
  },
  header: {
    color: 'black',  // Set text color to black
    fontSize: 38,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalIcon: {
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  allowButton: {
    backgroundColor: '#dc3545',
  },
  cancelButton: {
    backgroundColor: '#dc3545',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  subHeader: {
    color: 'black',  // Set text color to black
    fontSize: 18,
    marginTop: 10,
  },
  searchBar: {
    backgroundColor: '#333',
    color: 'white',
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
    margin:20,
    width: '90%',
  },
  recordButton: {
    marginTop: 20,
    backgroundColor: '#ff6347',
    borderRadius: 50,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 20,
    left: '40%',
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
  playbackControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalIcon: {
    marginBottom: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // This places the "Voice Memo" on the left and the profile icon on the right
    alignItems: 'center',
    // marginTop: 20,
    marginBottom: 10,
    width: '90%',
    padding:20
  
  },
 profileContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    elevation: 5, // for Android shadow
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 15,
    padding: 10,
  },
  closeText: {
    color: '#fff',
    fontSize: 18,
  },
  profileDetails: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileEmail: {
    fontSize: 16,
    color: 'gray',
  },

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
