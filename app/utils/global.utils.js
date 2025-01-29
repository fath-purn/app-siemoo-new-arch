import { StyleSheet } from "react-native";

export const extractUrlFromIntent = (intentString) => {
  const prefix = "intent://maps.app.goo.gl/?link=";
  const suffixIndex = intentString.indexOf("#Intent");

  if (intentString.startsWith(prefix) && suffixIndex !== -1) {
    return intentString.substring(prefix.length, suffixIndex);
  }

  return null; // Return null or handle the case where the URL cannot be extracted
};

// Function to determine color based on danger level
export const getDangerColor = (level) => {
  switch (level) {
    case 1:
      return "green";
    case 2:
      return "orange";
    case 3:
      return "red";
    default:
      return "gray";
  }
};

export const styles = StyleSheet.create({
  shadow: {
    boxShadow: "0 2px 2px 0 rgba(0, 0, 0, 0.2)", // Format: horizontalOffset verticalOffset blurRadius spreadRadius color
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#40513B'
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#40513B'
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});

export default function sd () {
  return;
}