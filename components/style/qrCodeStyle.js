import {StyleSheet} from "react-native"

export const s = StyleSheet.create({
    container : {
        flex: 1, 
        justifyContent: "center",
        alignItems:"center",
        backgroundColor:"#fff",
        
    },
    button:{
        backgroundColor:"blue",
        padding:10,
        borderRadius:5,
    },
    buttonText:{
        color:"#fff",
        fontSize:16,
    },
    scanInstructionsContainer: {
		position: "absolute",
		bottom: 100,
		left: 0,
		right: 0,
		alignItems: "center",
	},
	scanInstructionsText: {
		color: "white",
		fontSize: 16,
		fontWeight: "500",
		backgroundColor: "rgba(0, 0, 0, 0.6)",
		paddingVertical: 8,
		paddingHorizontal: 16,
		borderRadius: 20,
	},
})