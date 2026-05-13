jest.mock("@react-native-async-storage/async-storage", () => ({
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
  __esModule: true,
}));

jest.mock("expo-location", () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
  Accuracy: {
    Balanced: 4,
  },
}));

jest.mock("expo-image-picker", () => ({
  launchImageLibraryAsync: jest.fn(),
  MediaTypeOptions: {
    Images: "Images",
  },
}));

jest.mock("react-native-maps", () => {
  const React = require("react");
  const { View } = require("react-native");

  const MockMapView = React.forwardRef((props: Record<string, unknown>, ref: unknown) =>
    React.createElement(View, { ...props, ref, testID: "mock-map" })
  );
  MockMapView.displayName = "MapView";

  const MockMarker = (props: Record<string, unknown>) =>
    React.createElement(View, { ...props, testID: "mock-marker" });

  return {
    __esModule: true,
    default: MockMapView,
    Marker: MockMarker,
  };
});
