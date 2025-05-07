export const getCountryNameFromLatLng = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`
    );
    const data = await response.json();
    console.log(data);
  } catch (err) {
    console.error(err);
  }
};
